import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { execa } from 'execa';
import { Listr } from 'listr2';
import { projectInstall } from 'pkg-install';
import type { Options } from './index.js';

type ResolvedOptions = Options & {
  template: string;
  targetDirectory: string;
  templateDirectory: string;
};

function resolveOptions(options: Options): ResolvedOptions {
  const targetDirectory = options.targetDirectory ?? process.cwd();

  if (!options.template) {
    throw new Error('No template defined');
  }

  const templateDirectory = path.resolve(import.meta.dirname, '../../templates', options.template.toLowerCase());

  return {
    ...options,
    template: options.template,
    targetDirectory,
    templateDirectory
  };
}

async function copyTemplateFiles(
  options: Pick<ResolvedOptions, 'templateDirectory' | 'targetDirectory'>
): Promise<void> {
  await fs.promises.cp(options.templateDirectory, options.targetDirectory, {
    recursive: true,
    force: false
  });
}

async function initGit(options: Pick<ResolvedOptions, 'targetDirectory'>): Promise<boolean> {
  const result = await execa('git', ['init'], {
    cwd: options.targetDirectory
  });

  if (result.failed) {
    return Promise.reject(new Error('Failed to initialize git'));
  }

  return true;
}

export async function createProject(options: Options): Promise<boolean> {
  const resolvedOptions = resolveOptions(options);

  try {
    await fs.promises.access(resolvedOptions.templateDirectory, fs.constants.R_OK);
  } catch {
    console.error('%s Invalid template name', chalk.red.bold('ERROR'));
    process.exit(1);
  }

  const tasks = new Listr([
    {
      title: 'Copy project files',
      task: () => copyTemplateFiles(resolvedOptions)
    },
    {
      title: 'Initialize git',
      task: () => initGit(resolvedOptions),
      enabled: () => resolvedOptions.git
    },
    {
      title: 'Install dependencies',
      task: () =>
        projectInstall({
          cwd: resolvedOptions.targetDirectory
        }),
      skip: () => (!resolvedOptions.runInstall ? 'Pass --install to automatically install dependencies' : false)
    }
  ]);

  await tasks.run();

  console.log('%s Project ready', chalk.green.bold('DONE'));
  return true;
}
