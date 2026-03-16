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
  - `helpers/` — `Vector2`, `Input`, `SceneManager`, `Topic` (pub/sub), A\* pathfinding, etc.
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

- **Component Library**: HeroUI v3 (`@heroui/react@rc` + `@heroui/styles@rc`). **Always check `.heroui-docs/react/components/` and `.heroui-docs/react/demos/` before creating any custom component.** If HeroUI has a component for it, use it.
- **Styling**: HeroUI components handle their own styling via built-in variants. Only use Tailwind utility classes for layout (`flex`, `grid`, `gap`, etc.) and HeroUI semantic color tokens (`text-foreground`, `bg-surface`, `text-muted`, etc.). Never write custom CSS for things HeroUI components already handle (buttons, inputs, tooltips, modals, etc.).
- **Icons**: Lucide React — never use emoji or text labels for icons.
- **Utilities**: `cn()` from `src/renderer/lib/utils.ts` (clsx + tailwind-merge) for className composition when needed.

### Component Rules

**ALWAYS use HeroUI components — NEVER raw HTML for interactive elements:**
- `<Button>` not `<button>` — uses `onPress` (not `onClick`), `isDisabled` (not `disabled`), `isIconOnly` for icon-only buttons
- `<ToggleButton>` for on/off toggles — `isSelected` + `onChange`, `isIconOnly`
- `<ToggleButtonGroup>` for exclusive/multi selection groups — `selectionMode="single"|"multiple"`
- `<Toolbar>` for toolbar containers — provides arrow key navigation
- `<Tooltip>` for hover hints — `<Tooltip><Button>trigger</Button><Tooltip.Content>text</Tooltip.Content></Tooltip>`
- `<Modal>` for dialogs — `<Modal.Backdrop isOpen={} onOpenChange={}><Modal.Container><Modal.Dialog>...</Modal.Dialog></Modal.Container></Modal.Backdrop>`
- `<Form>` not `<form>` for form containers
- `<TextField>` + `<Label>` + `<Input>` for text inputs (not raw `<label>` + `<input>`)
- `<NumberField>` + `<NumberField.Group>` + `<NumberField.Input>` for number inputs
- `<Select>` not `<select>` for dropdowns
- `<Separator>` not `<div className="w-px bg-border">` for dividers
- `<Surface>` for panel/card containers (not raw `<div>` with bg classes)
- `<Disclosure>` for collapsible sections
- `<CloseButton>` for dismiss buttons

**HeroUI v3 docs reference**: `.heroui-docs/react/components/` for component docs, `.heroui-docs/react/demos/` for working code examples. Always read the relevant demo before using a component.

**Editor-specific components** (only when HeroUI has no equivalent):
- `src/renderer/components/editor/Panel.tsx` — sidebar panel wrapper (uses Surface internally)
- `src/renderer/components/editor/ToolButton.tsx` — toolbar icon button with tooltip (uses ToggleButton + Tooltip)
- `src/renderer/components/editor/ErrorToast.tsx` — error notification (uses Surface + CloseButton)

### Color Tokens (HeroUI theme)

Use HeroUI's semantic token names in Tailwind classes:
- `text-foreground`, `bg-background` — primary text/bg
- `text-muted` — secondary text
- `bg-surface`, `bg-surface-secondary`, `bg-surface-tertiary` — panel backgrounds
- `bg-accent`, `text-accent`, `text-accent-foreground` — accent/primary color
- `bg-danger`, `text-danger` — error/destructive
- `border-border`, `outline-focus` — borders and focus rings
- `bg-overlay` — dialog overlays
- `bg-default`, `bg-default-hover` — neutral/default elements

Theme is defined in `src/renderer/styles/globals.css` using oklch color values.

### Styling Rules

- No `@/` import aliases — use relative paths only
- No raw `<button>`, `<input>`, `<select>`, `<form>`, `<label>` — always use HeroUI equivalents
- No custom CSS class names for button styling — use HeroUI's `variant`, `size`, `isIconOnly` props
- Keep `imageRendering: 'pixelated'` as inline style on canvas elements (no Tailwind equivalent)
- Canvas 2D API colors are hardcoded (can't use CSS vars) — acceptable
