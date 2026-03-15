# Entropy Game Engine
Custom game engine for browsers written in TypeScript. Modeled after the Unity game engine.
Assets for the sample game are from opengameart.org and itch.io.

## Getting Started
The best way to get started is to use the Entropy CLI.

- Install the CLI `npm i -g @entropy-engine/entropy-cli`
- Run `entropy init` and follow the interactive prompts to create your project

## Development

### Prerequisites
- Node.js 22+

### Setup
```bash
npm install
```

### Scripts
| Command | Description |
|---------|-------------|
| `npm start` | Start sample-game-1 dev server (Vite) |
| `npm run compile` | TypeScript compilation (packages only) |
| `npm run build-games` | Build all sample games with Vite |
| `npm run lint` | Run ESLint |
| `npm run lint-fix` | Auto-fix ESLint issues |
| `npm test` | Run tests with Vitest |
| `npm run test-watch` | Run tests in watch mode |
| `npm run prettier` | Format code with Prettier |

### Tech Stack
- **Monorepo**: npm workspaces
- **Bundler**: Vite (sample games)
- **Test Runner**: Vitest
- **Linter**: ESLint 9 (flat config)
- **Formatter**: Prettier 3
- **TypeScript**: 5.7+

## Samples of Games using Entropy
- https://rwherber.com/entropy/sample-game-1
- https://rwherber.com/entropy/sample-game-2
- https://rwherber.com/entropy/sample-game-3
