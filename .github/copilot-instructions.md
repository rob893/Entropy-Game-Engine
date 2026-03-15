# Copilot Instructions for Entropy Game Engine

## Build, Test, and Lint

```bash
npm install                # Install all workspaces
npm run compile            # TypeScript compilation (engine + CLI only)
npm run build-games        # Vite production build for all sample games
npm start                  # Dev server for sample-game-1 (port 8080)
npm run start:game2        # Dev server for sample-game-2 (port 8081)
npm run start:game3        # Dev server for sample-game-3 (port 8082)

npm test                   # Vitest with coverage
npx vitest run <file>      # Run a single test file
npx vitest -t "test name"  # Run a single test by name

npm run lint               # ESLint
npm run lint-fix           # ESLint with auto-fix
npm run prettier           # Format all files
```

## Architecture

This is a Unity-style 2D game engine using a **GameObject + Component** pattern, organized as an npm workspaces monorepo.

### Packages

- **`@entropy-engine/entropy-game-engine`** — Core engine library (published to npm). Pure TypeScript, no bundler.
- **`@entropy-engine/entropy-cli`** — CLI scaffolding tool (`entropy init`). ESM module with `"type": "module"`.
- **`sample-game-1/2/3`** — Reference games built with the engine. Bundled with Vite.

### Engine Structure (`packages/entropy-game-engine/src/`)

- **`core/`** — Engine subsystems: `GameEngine`, `PhysicsEngine`, `RenderingEngine`, `Time`
  - `helpers/` — `Vector2`, `Input`, `SceneManager`, `Topic` (pub/sub), A* pathfinding, etc.
  - `physics/` — Collision detection (spatial hashing), impulse resolution
  - `enums/` — `Color`, `Layer`, `Key`, `EventType`, `MouseButton`
  - `interfaces/` — Contracts for scenes, renderables, collision, graphs
- **`components/`** — Attachable behaviors: `Transform`, `Camera`, `Rigidbody`, `Animator`, `RectangleCollider`, renderers, etc.
- **`game-objects/`** — `GameObject` base class, `Terrain`, UI elements

### Component Lifecycle

Components extend `Component` and attach to `GameObject` instances. Every GameObject has a `Transform`. Components access engine systems through inherited properties (`this.input`, `this.time`, `this.physics`, `this.sceneManager`).

```typescript
export class MyComponent extends Component {
  public constructor(gameObject: GameObject) {
    super(gameObject);
  }
}
```

### Coordinate System

Canvas coordinates: origin is top-left, X grows right, Y grows down. `Vector2.up` is `(0, -1)`.

### Event System

Decoupled communication uses `Topic<T>` (pub/sub). Components subscribe to topics and publish events without direct references.

### Sample Game Pattern

Games define `Scene` objects with factory functions for GameObjects, pass them to `GameEngine.setScenes()`, then call `gameEngine.loadScene(sceneNumber)`.

## Conventions

### File Naming

- **One class per file**, PascalCase filename matching the class name: `MyClass.ts`
- Multiple related interfaces/enums can share a camelCase file
- Directories use dash-case

### Code Style

- Explicit return types on all functions (except expressions)
- Mark never-reassigned members as `readonly`
- Single quotes, 120 char line width, no trailing commas, 2-space indent
- Prefer template literals, exponentiation operator, object spread, rest params

### Testing

- Tests live in `__tests__/` directories adjacent to source
- File pattern: `*.test.ts`
- Uses `jest-matcher-deep-close-to` for floating-point comparisons via `expect.extend()`
- Canvas mocking via `vitest-canvas-mock` (configured globally in `vitest.config.ts`)

### Imports

All engine exports are consumed from the single entry point:
```typescript
import { Component, GameObject, Vector2, GameEngine } from '@entropy-engine/entropy-game-engine';
```

Sample games resolve to engine **source** (not dist) via Vite alias for fast dev iteration.
