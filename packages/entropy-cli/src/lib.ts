import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import execa from 'execa';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';
import { Options } from './index';

const access = promisify(fs.access);
const copy = promisify(ncp);

function copyTemplateFiles(options: any): Promise<void> {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false
  });
}

async function initGit(options: any): Promise<boolean> {
  const result = await execa('git', ['init'], {
    cwd: options.targetDirectory
  });
  if (result.failed) {
    return Promise.reject(new Error('Failed to initialize git'));
  }
  return true;
}

export async function createProject(options: Options): Promise<boolean> {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd()
  };

  if (!options.template) {
    throw new Error('No template defined');
  }

  const templateDir = path.resolve(__dirname, '../templates', options.template.toLowerCase());
  options.templateDirectory = templateDir;

  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    console.error('%s Invalid template name', chalk.red.bold('ERROR'));
    process.exit(1);
  }

  const tasks = new Listr([
    {
      title: 'Copy project files',
      task: () => copyTemplateFiles(options)
    },
    {
      title: 'Initialize git',
      task: () => initGit(options),
      enabled: () => options.git
    },
    {
      title: 'Install dependencies',
      task: () =>
        projectInstall({
          cwd: options.targetDirectory
        }),
      skip: () => (!options.runInstall ? 'Pass --install to automatically install dependencies' : undefined)
    }
  ]);

  await tasks.run();

  console.log('%s Project ready', chalk.green.bold('DONE'));
  return true;
}
