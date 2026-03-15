import arg from 'arg';
import chalk from 'chalk';
import inquirer, { type Question } from 'inquirer';
import { createRequire } from 'module';
import { createProject } from './lib.js';

const require = createRequire(import.meta.url);

interface PackageJson {
  version: string;
}

export interface ParsedArgs {
  _: string[];
  '--git'?: boolean;
  '--yes'?: boolean;
  '--install'?: boolean;
  '--version'?: boolean;
}

export interface Options {
  skipPrompts: boolean;
  git: boolean;
  runInstall: boolean;
  args: ParsedArgs;
  template?: string;
  command?: string;
  targetDirectory?: string;
  templateDirectory?: string;
}

interface PromptAnswers {
  template?: 'TypeScript' | 'JavaScript';
  git?: boolean;
  runInstall?: boolean;
}

export const commands = new Set<string>(['init']);

function getPackageJson(): unknown {
  return require('../package.json') as unknown;
}

function isPackageJson(value: unknown): value is PackageJson {
  return typeof value === 'object' && value !== null && 'version' in value && typeof value.version === 'string';
}

function getCLIVersion(): string {
  const packageJson = getPackageJson();

  if (!isPackageJson(packageJson)) {
    throw new Error('Unable to determine CLI version.');
  }

  return packageJson.version;
}

function parseArgumentsIntoOptions(rawArgs: string[]): Options {
  const args: ParsedArgs = arg(
    {
      '--git': Boolean,
      '--yes': Boolean,
      '--install': Boolean,
      '--version': Boolean,
      '-g': '--git',
      '-y': '--yes',
      '-i': '--install',
      '-v': '--version'
    },
    {
      argv: rawArgs.slice(2)
    }
  );

  const requestedCommand = args._[0];
  const command = requestedCommand !== undefined && commands.has(requestedCommand) ? requestedCommand : undefined;
  const template = args._[1];

  return {
    skipPrompts: args['--yes'] ?? false,
    git: args['--git'] ?? false,
    runInstall: args['--install'] ?? false,
    template,
    command,
    args
  };
}

async function promptForMissingOptions(options: Options): Promise<Options> {
  const defaultTemplate = 'TypeScript';

  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template ?? defaultTemplate
    };
  }

  const questions: Question<PromptAnswers>[] = [];
  const javaScriptResponses = [
    "Don't use JavaScript.",
    'You really should not use JavaScript for this...',
    "You really want to use JavaScript don't you? Well you shouldn't."
  ];
  let resIndex = 0;

  while (!options.template || options.template === 'JavaScript') {
    if (options.template === 'JavaScript') {
      console.error(chalk.red.bold(javaScriptResponses[resIndex]));
      resIndex = (resIndex + 1) % javaScriptResponses.length;
    }

    questions.push({
      type: 'list',
      name: 'template',
      message: 'Please choose which project template to use',
      choices: ['TypeScript', 'JavaScript'],
      default: defaultTemplate
    });

    const templateAnswer = await inquirer.prompt<PromptAnswers>(questions);

    questions.length = 0;
    options = {
      ...options,
      template: templateAnswer.template
    };
  }

  if (!options.git) {
    questions.push({
      type: 'confirm',
      name: 'git',
      message: 'Initialize a git repository?',
      default: false
    });
  }

  if (!options.runInstall) {
    questions.push({
      type: 'confirm',
      name: 'runInstall',
      message: 'Install packages?',
      default: false
    });
  }

  const answers = questions.length > 0 ? await inquirer.prompt<PromptAnswers>(questions) : {};

  return {
    ...options,
    template: options.template ?? answers.template ?? defaultTemplate,
    git: options.git || (answers.git ?? false),
    runInstall: options.runInstall || (answers.runInstall ?? false)
  };
}

export async function cli(args: string[]): Promise<void> {
  try {
    let options = parseArgumentsIntoOptions(args);

    if (options.args['--version']) {
      console.log(getCLIVersion());
      return;
    }

    if (!options.command) {
      console.log('Invalid command. Valid commands are:');
      commands.forEach(command => console.log(command));
      return;
    }

    options = await promptForMissingOptions(options);
    await createProject(options);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    console.error(message);
  }
}
