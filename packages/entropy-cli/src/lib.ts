import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { Listr } from 'listr2';
import { projectInstall } from 'pkg-install';
import { execa } from 'execa';
import { Options } from './index.js';

async function copyTemplateFiles(options: any): Promise<void> {
  await fs.promises.cp(options.templateDirectory, options.targetDirectory, {
    recursive: true,
    force: false
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

  const templateDir = path.resolve(import.meta.dirname, '../../templates', options.template.toLowerCase());
  options.templateDirectory = templateDir;

  try {
    await fs.promises.access(templateDir, fs.constants.R_OK);
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
      skip: () => (!options.runInstall ? 'Pass --install to automatically install dependencies' : false)
    }
  ]);

  await tasks.run();

  console.log('%s Project ready', chalk.green.bold('DONE'));
  return true;
}
