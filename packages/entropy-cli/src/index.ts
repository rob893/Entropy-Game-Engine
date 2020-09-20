import arg from 'arg';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { createProject } from './lib';

const pkg = require('../package.json');

export interface Options {
  skipPrompts: boolean;
  git: boolean;
  runInstall: boolean;
  args: any;
  template?: string;
  command?: string;
  targetDirectory?: string;
  templateDirectory?: string;
}

export const commands = new Set<string>(['init']);

function getCLIVersion(): string {
  return pkg.version;
}

function parseArgumentsIntoOptions(rawArgs: string[]): Options {
  const args = arg(
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

  const command = commands.has(args._[0]) ? args._[0] : undefined;
  const templateIndex = 1;
  const template = args._[templateIndex];

  return {
    skipPrompts: args['--yes'] || false,
    git: args['--git'] || false,
    runInstall: args['--install'] || false,
    template,
    command,
    args
  };
}

async function promptForMissingOptions(options: Options): Promise<any> {
  const defaultTemplate = 'TypeScript';

  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate
    };
  }

  const questions = [];
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

    const templateAnswer = await inquirer.prompt(questions);
    questions.length = 0;
    options.template = templateAnswer.template;
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

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    template: options.template || answers.template,
    git: options.git || answers.git,
    runInstall: options.runInstall || answers.runInstall
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
  } catch (error) {
    console.error(error.message);
  }
}
