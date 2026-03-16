---
name: electron-developer
description: >
  Guide for developing the Entropy Editor Electron app. Use this skill when creating, modifying,
  or reviewing code in packages/entropy-editor — including main process, preload, renderer, IPC
  handlers, React components, and shared types.
---

# Electron Developer Skill

This skill provides the critical rules for working on `packages/entropy-editor`.
For the full guide with detailed examples, see `.docs/electron-app-architecture-guide.md`.

## Process Boundaries (The #1 Rule)

Three strict process boundaries. **Never violate these.**

| Process | What it can do | What it must NOT do |
|---------|---------------|---------------------|
| **Main** (`src/main/`) | File system, DB, HTTP, native APIs, IPC handlers | Import React, render UI |
| **Preload** (`src/main/ipc/preload.ts`) | `contextBridge.exposeInMainWorld` only | Business logic, direct DB access |
| **Renderer** (`src/renderer/`) | React SPA, UI, presentation | Import `fs`, `path`, `child_process`, or any Node.js module |

Communication between main and renderer goes **exclusively** through IPC via the preload bridge.

## Project Structure

```
packages/entropy-editor/src/
  main/                          # Main process (Node.js)
    core/                        # Lifecycle: main.ts, startup.ts, window-factory.ts, web-security.ts, app-events.ts, app-menu.ts
    ipc/                         # IPC layer: preload.ts, utils.ts, handlers/<domain>-handlers.ts
    platform/                    # Cross-cutting: telemetry.ts, user-settings.ts
  renderer/                      # Renderer process (React SPA — pure browser)
    components/<Name>/index.tsx  # React components (folder-based)
    stores/                      # Zustand stores
    hooks/                       # Custom React hooks
    styles/                      # CSS
    types/electron.d.ts          # window.electronAPI declarations
    utils/                       # Renderer utilities (telemetry, errors)
  shared/                        # Contract layer (both processes import from here)
```

## IPC Contract — Three Files That Must Stay in Sync

When adding or modifying an IPC method, update **all three** files:

1. `src/shared/types/electron-api.ts` — Interface definition (source of truth)
2. `src/main/ipc/preload.ts` — Implementation via `contextBridge`
3. `src/renderer/types/electron.d.ts` — `window.electronAPI` type declarations

### IPC Handler Pattern

Never register handlers directly in `main.ts`. Use the `handle()` wrapper and group by domain:

```typescript
// src/main/ipc/handlers/<domain>-handlers.ts
import { handle } from '../utils';

export function registerDomainHandlers(): void {
  handle('domain:action', async (arg: string): Promise<Result> => {
    // handler logic
  });
}
```

Register all handlers from `src/main/ipc/handlers/index.ts` via `registerAllHandlers()`.

Use channel namespacing: `file:open`, `tileset:import`, `export:png`.

## Main Process Decomposition

Keep `main.ts` minimal — delegate to `startup.ts`:

| File | Responsibility |
|------|---------------|
| `main.ts` | Entry point: `void app.whenReady().then(initializeApp)` |
| `startup.ts` | Ordered init sequence: handlers → CSP → events → window → menu → load |
| `window-factory.ts` | BrowserWindow creation with security options |
| `web-security.ts` | CSP injection (production only — skip in dev for Vite HMR) |
| `app-events.ts` | `window-all-closed`, `will-quit` handlers |
| `app-menu.ts` | Native Electron menu |

## Security Hardening

Always set on BrowserWindow:
- `contextIsolation: true`
- `nodeIntegration: false`
- `sandbox: true`
- `webSecurity: true`

Restrict navigation to same-origin. Deny new window creation. See §7 in the full guide.

## State Management

| Complexity | Solution |
|-----------|---------|
| Simple (1-3 vars) | `useState` / `useReducer` |
| Moderate (4+ vars, shared across components) | Zustand store |
| Global singleton | React Context |

## Naming Conventions (ESLint-Enforced)

- Interfaces: `I` prefix (`IEditorState`, `IElectronAPI`)
- React component functions: PascalCase (TSX override allows this)
- All other functions/methods: camelCase
- Classes, types, enums: PascalCase
- No `@/` import aliases — use relative paths

## Imports

- Use relative paths (no `@/` alias — banned by ESLint `no-restricted-imports`)
- Use `import type` for type-only imports
- Alphabetical order enforced by `import/order` rule

## Adding a New IPC Channel (Checklist)

1. Add method to `IElectronAPI` interface in `src/shared/types/electron-api.ts`
2. Add handler in `src/main/ipc/handlers/<domain>-handlers.ts` using `handle()` wrapper
3. Expose in `src/main/ipc/preload.ts`
4. Update `src/renderer/types/electron.d.ts`
5. If new domain, register in `src/main/ipc/handlers/index.ts`

## Adding a New React Component

1. Create folder `src/renderer/components/<Name>/`
2. Create `index.tsx` as the entry component
3. Use PascalCase for the exported function name
4. Interface props with `I` prefix (`IMyComponentProps`)
5. Import store via relative path from `../../stores/editor-store`

## Telemetry

- Main: `import { logger } from '../platform/telemetry'`
- Renderer: `import { logger } from '../utils/telemetry'`
- Use `logger.child('context')` for scoped logging
- Use `logger.startTimer('event')` for duration tracking
- Call `logger.flush()` before app quit
- The `ITelemetryTransport` interface allows adding App Insights/OpenTelemetry later

## Key Don'ts

- **Don't** import Node.js modules in the renderer
- **Don't** register IPC handlers in `main.ts`
- **Don't** use `@/` import aliases
- **Don't** skip the `I` prefix on interfaces
- **Don't** use `any` — the repo bans it
- **Don't** put CSP in `index.html` — use runtime injection in `web-security.ts` (production only)
- **Don't** use `console.log` directly — use the Logger
