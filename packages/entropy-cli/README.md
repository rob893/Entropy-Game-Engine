# Entropy CLI
CLI for the Entropy Game Engine to make initial project creation and set up easy.

## Prerequisites

- Nodejs 12+

## Installation

- `npm i -g @entropy-engine/entropy-cli`

## Usage

- Use `entropy` with the following commands and flags.

### Commands

- `init` create a new project in the current directory.

### Flags

- If not passed, you will be prompted for these.
- `-i` `--install` install dependencies
- `-g` `--git` init a git repository
- `-y` `--yes` skip prompts

### Examples

- `entropy init -i -g` create a new project in the current directory with a git repository and install dependencies.