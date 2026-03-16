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

### General

- `any` is not allowed.

### File Naming

- **One class per file**, PascalCase filename matching the class name: `MyClass.ts`
- Multiple related interfaces/enums can share a camelCase file
- Directories use dash-case

### Code Style

- Explicit return types on all functions (except expressions)
- Mark never-reassigned members as `readonly`
- Single quotes, 120 char line width, no trailing commas, 2-space indent
- Prefer template literals, exponentiation operator, object spread, rest params
- This is a 'C#' style engine, so OOP patterns are common and interfaces use the 'I' prefix

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

## Editor Package (`packages/entropy-editor/`)

Visual terrain map editor built with Electron + React. See `.docs/electron-app-architecture-guide.md` for full architecture details.

### Design Stack

- **Styling**: Tailwind CSS v4 (via PostCSS) — all styling via utility classes, no inline `style={{}}` except `imageRendering: 'pixelated'` on canvas elements
- **Component Pattern**: shadcn/ui style (Radix primitives + cva + Tailwind, copy-paste components we own)
- **Icons**: Lucide React — never use emoji or text labels for icons. Consistent sizing: 16px (`h-4 w-4`) in toolbars, 14px (`h-3.5 w-3.5`) in panels
- **Utilities**: `cn()` from `src/renderer/lib/utils.ts` (clsx + tailwind-merge) for all className composition

### Color Palette (dark theme only)

| Token | Value | Usage |
|-------|-------|-------|
| `background` | `#0f0f17` | App background |
| `card` | `#1a1a2e` | Panels, sidebars |
| `popover` | `#252540` | Dialogs, dropdowns |
| `muted` | `#2a2a45` | Toolbar, inputs bg |
| `primary` | `#7c3aed` | Purple — active tools, focus rings, CTAs |
| `accent` | `#10b981` | Green — success, secondary actions |
| `destructive` | `#ef4444` | Danger — delete, errors |
| `foreground` | `#f0f0f5` | Primary text |
| `muted-foreground` | `#8888a0` | Secondary text, labels |

### Typography

- **Sans**: `'Inter', 'Segoe UI', system-ui, sans-serif`
- **Mono**: `'JetBrains Mono', 'Cascadia Code', monospace`
- **Scale**: 11px (labels) → 12px (body) → 13px (default) → 14px (dialogs) → 16px (headings)

### Component Conventions

- **UI primitives** live in `src/renderer/components/ui/` (Button, Dialog, Input, Label, Tooltip)
- **Editor-specific** components live in `src/renderer/components/editor/` (Panel, ToolButton, ErrorToast)
- **Feature components** live in `src/renderer/components/<Name>/index.tsx`
- All new components must use Tailwind classes — never add inline styles
- All interactive elements need `aria-*` attributes and keyboard support
- Dialogs use Radix `@radix-ui/react-dialog` for focus management
- Tooltips use Radix `@radix-ui/react-tooltip` — wrap in `TooltipProvider`

### Styling Rules

- Use CSS variables from `src/renderer/styles/globals.css` via Tailwind `text-foreground`, `bg-primary`, etc.
- Button variants via `class-variance-authority` (cva): `default`, `primary`, `ghost`, `destructive`, `outline`
- No `@/` import aliases — use relative paths only
- Keep `imageRendering: 'pixelated'` as inline style on canvas elements (no Tailwind equivalent)
