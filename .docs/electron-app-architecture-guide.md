# Electron App Architecture Guide

> A comprehensive template for building production-grade Electron desktop applications with React renderers, strict process isolation, and scalable conventions.

---

## Table of Contents

- [1. Architecture Overview](#1-architecture-overview)
- [2. Project Structure](#2-project-structure)
- [3. Main Process Decomposition](#3-main-process-decomposition)
- [4. IPC Communication Layer](#4-ipc-communication-layer)
- [5. Renderer Process & React SPA](#5-renderer-process--react-spa)
- [6. Shared Contract Layer](#6-shared-contract-layer)
- [7. Web Security & Electron Hardening](#7-web-security--electron-hardening)
- [8. App Startup & Lifecycle](#8-app-startup--lifecycle)
- [9. State Management](#9-state-management)
- [10. UI & Styling Conventions](#10-ui--styling-conventions)
- [11. Accessibility](#11-accessibility)
- [12. Database & Persistence](#12-database--persistence)
- [13. Performance & Bundle Splitting](#13-performance--bundle-splitting)
- [14. Testing Strategy](#14-testing-strategy)
- [15. Build & Dev Workflow](#15-build--dev-workflow)
- [16. Telemetry & Observability](#16-telemetry--observability)
- [17. Caching](#17-caching)
- [18. New Feature Checklist](#18-new-feature-checklist)

---

## 1. Architecture Overview

An Electron app has three strict process boundaries. Respecting these boundaries is the single most important architectural decision.

```
┌─────────────────────────────────┐
│         Main Process            │  Node.js — full system access
│  (app lifecycle, IPC handlers,  │  Can access file system, network,
│   auth, DB, native APIs)        │  spawn processes, use native modules
├─────────────────────────────────┤
│         Preload Script          │  Bridge — contextBridge only
│  (contextBridge.exposeInWorld)  │  Runs in renderer context but can
│                                 │  access select Node.js/Electron APIs
├─────────────────────────────────┤
│        Renderer Process         │  Browser sandbox — no Node.js
│  (React SPA, UI, user           │  Communicates with main process
│   interaction, presentation)    │  exclusively through the preload API
└─────────────────────────────────┘
```

### Core Rules

1. **Main process** owns all privileged operations: auth, database, HTTP to external services, file system access, native OS integration.
2. **Renderer process** is a pure browser SPA. It must never import Node.js modules (`fs`, `path`, `child_process`, `better-sqlite3`, etc.).
3. **Communication** between main and renderer goes through Electron IPC only, mediated by the preload script's `contextBridge`.
4. **Shared types** define the contract between processes. The `ElectronAPI` interface, `preload.ts` implementation, and renderer type declarations must stay in sync.

---

## 2. Project Structure

```
your-app/
├── src/
│   ├── main/                        # Main process (Node.js)
│   │   ├── core/                    # App lifecycle & bootstrap
│   │   │   ├── main.ts              # Entry point
│   │   │   ├── startup.ts           # Initialization sequence
│   │   │   ├── window-factory.ts    # BrowserWindow creation
│   │   │   ├── web-security.ts      # CSP & security configuration
│   │   │   ├── app-events.ts        # App-level event handlers
│   │   │   ├── app-menu.ts          # Native menu definition
│   │   │   └── prereq-checks.ts     # System prerequisite validation
│   │   ├── ipc/                     # IPC communication layer
│   │   │   ├── preload.ts           # contextBridge API surface
│   │   │   ├── utils.ts             # handle() helper, error wrapping
│   │   │   └── handlers/            # Grouped IPC request handlers
│   │   │       ├── index.ts         # Handler registration
│   │   │       ├── app-handlers.ts
│   │   │       ├── auth-handlers.ts
│   │   │       ├── db-crud-handlers.ts
│   │   │       ├── settings-handlers.ts
│   │   │       └── <domain>-handlers.ts
│   │   ├── auth/                    # Authentication & token flows
│   │   ├── platform/                # Cross-cutting infrastructure
│   │   │   ├── http-client.ts       # Centralized HTTP with retries
│   │   │   ├── cache.ts             # Main-process cache layer
│   │   │   ├── telemetry.ts         # Telemetry client
│   │   │   └── user-settings.ts     # Settings file I/O
│   │   ├── integrations/            # External service integrations
│   │   │   ├── ado/                 # e.g. Azure DevOps
│   │   │   ├── kusto/               # e.g. Azure Data Explorer
│   │   │   └── <service>/
│   │   ├── db/                      # Database layer
│   │   │   ├── schema.ts            # ORM schema (source of truth)
│   │   │   ├── migrations/          # Generated migration SQL
│   │   │   ├── data-access/         # CRUD functions per domain
│   │   │   │   ├── <entity>.ts
│   │   │   │   └── index.ts
│   │   │   └── __tests__/
│   │   ├── configs/                 # Built-in config arrays
│   │   ├── tools/                   # Tool-specific backend logic
│   │   └── __tests__/
│   │
│   ├── renderer/                    # Renderer process (React SPA)
│   │   ├── index.tsx                # React DOM mount point
│   │   ├── App.tsx                  # Root component (lazy routing)
│   │   ├── components/              # Shared reusable components
│   │   │   ├── DataTable/           # Generic sortable/filterable table
│   │   │   ├── ItemToolbar/         # Save/open/rename/delete toolbar
│   │   │   ├── HtmlRenderer/        # Sanitized HTML display
│   │   │   ├── CodeEditor/          # Monaco wrapper
│   │   │   └── <Component>/
│   │   ├── context/                 # React context providers
│   │   │   ├── AuthContext.tsx
│   │   │   └── SettingsContext.tsx
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useFormDialog.ts
│   │   │   ├── useClipboardCopy.ts
│   │   │   └── useSearchFilter.ts
│   │   ├── pages/                   # Tool/feature pages
│   │   │   └── <PageName>/          # Folder-based page structure
│   │   │       ├── index.tsx        # Page entry component
│   │   │       ├── styles.ts        # makeStyles hooks
│   │   │       ├── types.ts         # Page-local types
│   │   │       ├── utils.ts         # Pure helper functions
│   │   │       ├── store.ts         # Zustand store (if needed)
│   │   │       ├── <Sub>.tsx        # Sub-components
│   │   │       └── __tests__/       # Co-located tests
│   │   ├── stores/                  # Global/cross-page Zustand stores
│   │   ├── styles/                  # Shared style definitions
│   │   │   └── pageStyles.ts        # usePageStyles() hook
│   │   ├── types/                   # Renderer-specific types
│   │   │   └── electron.d.ts        # window.electronAPI declarations
│   │   └── utils/                   # Renderer utilities
│   │       ├── telemetry.ts
│   │       └── errors.ts
│   │
│   └── shared/                      # Shared contract (both processes)
│       ├── types/                   # Cross-process type definitions
│       │   ├── electron-api.ts      # ElectronAPI interface contract
│       │   ├── <domain>.ts          # Domain-specific types
│       │   └── index.ts             # Barrel re-export
│       ├── utils/                   # Cross-process utilities
│       │   └── errors.ts            # getErrorMessage() helper
│       ├── ipc-types.ts             # IPC channel & payload types
│       ├── constants.ts             # Shared constants
│       └── schemas/                 # Zod validation schemas
│
├── index.html                       # Electron renderer entry HTML
├── vite.config.ts                   # Build configuration
├── tsconfig.json                    # TypeScript configuration
├── vitest.config.ts                 # Test configuration
├── eslint.config.mjs                # Linting rules
├── drizzle.config.ts                # DB migration config
└── package.json
```

---

## 3. Main Process Decomposition

The main process should be decomposed into **clearly separated responsibilities**. Avoid monolithic `main.ts` files.

### 3.1 Core Module (`src/main/core/`)

Handles app lifecycle and bootstrap. Split into focused files:

| File                | Responsibility                                                                  |
| ------------------- | ------------------------------------------------------------------------------- |
| `main.ts`           | Entry point. Creates the BrowserWindow, loads preload, sets up dev tools        |
| `startup.ts`        | Initialization sequence: DB migration, auth init, config loading, prereq checks |
| `window-factory.ts` | BrowserWindow creation with security options (contextIsolation, etc.)           |
| `web-security.ts`   | CSP injection, session security headers, navigation restrictions                |
| `app-events.ts`     | Global app events (will-quit, window-all-closed, activate)                      |
| `app-menu.ts`       | Native Electron menu definition                                                 |
| `prereq-checks.ts`  | System prerequisites validation (versions, permissions, connectivity)           |

### 3.2 IPC Handlers (`src/main/ipc/handlers/`)

**Never register IPC handlers directly in `main.ts`.** Instead:

1. Create a `handle()` wrapper utility that strips the Electron event parameter and adds error logging:

```typescript
// src/main/ipc/utils.ts
import { ipcMain } from 'electron';

export function handle<T extends unknown[], R>(channel: string, handler: (...args: T) => Promise<R> | R): void {
  ipcMain.handle(channel, async (_event, ...args: T) => {
    try {
      return await handler(...(args as T));
    } catch (error) {
      console.error(`IPC handler error [${channel}]:`, error);
      throw error;
    }
  });
}
```

2. Group handlers by domain in separate files:

```typescript
// src/main/ipc/handlers/auth-handlers.ts
import { handle } from '../utils';
import { getAuthToken, login, logout } from '../../auth/auth-service';

export function registerAuthHandlers(): void {
  handle('auth:get-token', getAuthToken);
  handle('auth:login', login);
  handle('auth:logout', logout);
}
```

3. Register all handlers from a central index:

```typescript
// src/main/ipc/handlers/index.ts
import { registerAuthHandlers } from './auth-handlers';
import { registerDbHandlers } from './db-crud-handlers';
import { registerSettingsHandlers } from './settings-handlers';

export function registerAllHandlers(): void {
  registerAuthHandlers();
  registerDbHandlers();
  registerSettingsHandlers();
  // Add new handler groups here
}
```

### 3.3 Integration Modules (`src/main/integrations/`)

Each external service gets its own folder with:

- API client functions
- Response type mapping
- Error handling specific to that service

Keep integrations thin — they transform external API calls into internal types. Business logic stays in `tools/` or handler files.

### 3.4 Platform Module (`src/main/platform/`)

Cross-cutting infrastructure shared across the main process:

| Module             | Purpose                                                                          |
| ------------------ | -------------------------------------------------------------------------------- |
| `http-client.ts`   | Centralized HTTP client with retries, auth header injection, error normalization |
| `cache.ts`         | In-memory cache with TTL, invalidation, and scheduled refresh                    |
| `telemetry.ts`     | Telemetry/logging client initialization and event emission                       |
| `user-settings.ts` | Settings file read/write (JSON-based preferences only)                           |

**Rule:** All HTTP requests should go through the centralized `httpRequest()` function unless retries are intentionally unwanted.

---

## 4. IPC Communication Layer

IPC is the trust boundary between the privileged main process and the sandboxed renderer. Treat it like an API contract.

### 4.1 The Three Files That Must Stay in Sync

```
src/shared/types/electron-api.ts  ← Interface definition (contract)
src/main/ipc/preload.ts           ← Implementation (main-side bridge)
src/renderer/types/electron.d.ts  ← Type declarations (renderer-side)
```

When adding a new IPC method, update all three.

### 4.2 Preload Script Pattern

```typescript
// src/main/ipc/preload.ts
import { contextBridge, ipcRenderer } from 'electron';

const electronAPI = {
  // Auth
  getAuthToken: (): Promise<string> => ipcRenderer.invoke('auth:get-token'),
  login: (): Promise<void> => ipcRenderer.invoke('auth:login'),

  // Database CRUD
  getItems: (): Promise<Item[]> => ipcRenderer.invoke('db:get-items'),
  createItem: (data: CreateItemInput): Promise<Item> => ipcRenderer.invoke('db:create-item', data),

  // Settings
  getSettings: (): Promise<AppSettings> => ipcRenderer.invoke('settings:get'),
  updateSettings: (settings: Partial<AppSettings>): Promise<void> => ipcRenderer.invoke('settings:update', settings),

  // Event listeners (main → renderer push)
  onUpdateAvailable: (callback: (version: string) => void) => {
    const sub = (_event: unknown, version: string) => callback(version);
    ipcRenderer.on('app:update-available', sub);
    return () => ipcRenderer.removeListener('app:update-available', sub);
  }
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
```

### 4.3 Renderer Usage

```typescript
// Renderer code — no Node.js imports, only the bridge API
const items = await window.electronAPI.getItems();
const token = await window.electronAPI.getAuthToken();
```

### 4.4 IPC Handler Conventions

- Use `ipcMain.handle` / `ipcRenderer.invoke` (request-response) over `ipcMain.on` / `ipcRenderer.send` (fire-and-forget). The invoke/handle pattern provides return values and proper error propagation.
- Validate all inputs from the renderer in the handler before processing. The renderer is untrusted.
- Use channel namespacing: `auth:get-token`, `db:create-item`, `settings:update`.
- Transfer minimal data across the bridge. Don't send full datasets when subsets suffice.

---

## 5. Renderer Process & React SPA

### 5.1 Entry Point

```typescript
// src/renderer/index.tsx
import { createRoot } from 'react-dom/client';
import { App } from './App';

createRoot(document.getElementById('root')!).render(<App />);
```

### 5.2 Root App Component

`App.tsx` is the orchestrator. It should:

- Wrap the app in theme/context providers
- Define lazy-loaded routes for all pages
- Set up global error handlers
- Manage top-level layout (sidebar + content area)

```typescript
// src/renderer/App.tsx
import { lazy, Suspense, useState } from 'react';
import { FluentProvider, webDarkTheme, Spinner } from '@fluentui/react-components';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';

// Lazy-load every tool page for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings  = lazy(() => import('./pages/Settings'));
const ToolA     = lazy(() => import('./pages/ToolA'));
const ToolB     = lazy(() => import('./pages/ToolB'));
// ... add more pages

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <FluentProvider theme={webDarkTheme}>
      <AuthProvider>
        <SettingsProvider>
          <div className={styles.layout}>
            <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
            <main className={styles.content}>
              <Suspense fallback={<Spinner label="Loading..." />}>
                {renderPage(currentPage)}
              </Suspense>
            </main>
          </div>
        </SettingsProvider>
      </AuthProvider>
    </FluentProvider>
  );
}
```

### 5.3 Page Structure (Folder-Based)

Every page should be a self-contained folder:

```
src/renderer/pages/<PageName>/
├── index.tsx        # Page entry — exported component, page-level state
├── styles.ts        # All makeStyles hooks for this page + subcomponents
├── types.ts         # Page-local types, re-export shared types as needed
├── utils.ts         # Pure helpers (no React, no side effects)
├── store.ts         # Zustand store (for moderate/complex state)
├── <SubComponent>.tsx  # Focused subcomponents with defined props
└── __tests__/       # Co-located tests
    ├── utils.test.ts
    ├── store.test.ts
    └── PageName.test.tsx
```

**Rules:**

- `index.tsx` is the exported page entry (the file `App.tsx` imports).
- `styles.ts` contains all `makeStyles` hooks for the page and its subcomponents.
- `types.ts` contains page-local types; re-export shared types as needed.
- `utils.ts` contains pure helper functions only (no React, no side effects).
- Page-level state lives in `index.tsx` or `store.ts`; subcomponents should be focused/presentational.

### 5.4 Shared Components

Build a library of reusable components to enforce consistency:

| Component               | Purpose                                                      |
| ----------------------- | ------------------------------------------------------------ |
| `DataTable`             | Sortable, filterable, paginated data grid with column resize |
| `ItemToolbar`           | Save/open/rename/delete/share workflow toolbar               |
| `ItemNameDisplay`       | Active item name with dirty/unsaved indicator                |
| `HtmlRenderer`          | Sanitized HTML display (DOMPurify + dark-theme styling)      |
| `CodeEditor`            | Monaco editor wrapper with lazy loading                      |
| `DeleteConfirmDialog`   | Destructive action confirmation                              |
| `HistoryDialog`         | Searchable execution/access history                          |
| `ScreenReaderAnnouncer` | Live region for accessible status announcements              |

**Rule:** Reuse existing shared components before creating page-local alternatives. If a pattern repeats across 3+ pages, extract it to the shared component library.

### 5.5 Shared Hooks

Similarly, build reusable hooks:

| Hook                 | Purpose                                                                      |
| -------------------- | ---------------------------------------------------------------------------- |
| `useFormDialog`      | Unified add/edit dialog state (eliminates duplicate `new*`/`edit*` useState) |
| `useClipboardCopy`   | Copy-to-clipboard with feedback                                              |
| `useSearchFilter`    | Client-side search/filter with debounce                                      |
| `useNavigationGuard` | Unsaved changes prompt before navigation                                     |

### 5.6 Context Providers

Use React Context for truly global, rarely-changing state:

- `AuthContext` — auth state, login/logout, current user
- `SettingsContext` — user preferences, theme selection

**Rule:** Context is for global singletons. For page/feature state, use Zustand stores.

---

## 6. Shared Contract Layer

The `src/shared/` directory is the contract between main and renderer processes.

### 6.1 What Belongs in Shared

- **Type definitions** — `ElectronAPI` interface, domain types, IPC payload types
- **Constants** — shared enums, magic strings, config keys
- **Validation schemas** — Zod schemas for runtime validation of settings, configs
- **Pure utilities** — error formatting (`getErrorMessage`), string helpers, validators

### 6.2 What Does NOT Belong in Shared

- React components or hooks (renderer-only)
- Node.js imports like `fs`, `path`, `child_process` (main-only)
- Electron imports (process-specific)
- Side-effectful code

### 6.3 ElectronAPI Contract

```typescript
// src/shared/types/electron-api.ts
export interface ElectronAPI {
  // Auth
  getAuthToken(): Promise<string>;
  login(): Promise<void>;
  logout(): Promise<void>;

  // Items CRUD
  getItems(): Promise<Item[]>;
  createItem(data: CreateItemInput): Promise<Item>;
  updateItem(id: string, data: UpdateItemInput): Promise<Item>;
  deleteItem(id: string): Promise<void>;

  // Settings
  getSettings(): Promise<AppSettings>;
  updateSettings(settings: Partial<AppSettings>): Promise<void>;

  // Event subscriptions (returns unsubscribe function)
  onUpdateAvailable(callback: (version: string) => void): () => void;
}
```

This interface is the **source of truth**. Both preload.ts and renderer type declarations derive from it.

---

## 7. Web Security & Electron Hardening

Security is non-negotiable for Electron apps. The renderer has browser-level access, but the main process has full system access — the IPC bridge is the critical trust boundary.

### 7.1 BrowserWindow Security Options

```typescript
// src/main/core/window-factory.ts
const mainWindow = new BrowserWindow({
  webPreferences: {
    contextIsolation: true, // REQUIRED — isolates preload from renderer
    nodeIntegration: false, // REQUIRED — no Node.js in renderer
    sandbox: true, // Recommended — OS-level sandboxing
    webSecurity: true, // REQUIRED — enforces same-origin policy
    preload: path.join(__dirname, 'preload.js')
    // NEVER enable these:
    // allowRunningInsecureContent: false,
    // experimentalFeatures: false,
    // enableBlinkFeatures: undefined,
  }
});
```

### 7.2 Content Security Policy

Inject CSP at runtime via session headers for flexibility:

```typescript
// src/main/core/web-security.ts
import { session } from 'electron';

export function configureCSP(): void {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          [
            "default-src 'self'",
            "script-src 'self'",
            "style-src 'self' 'unsafe-inline'", // Required for CSS-in-JS
            "img-src 'self' data: https:",
            "font-src 'self' data:",
            "connect-src 'self' https://*.your-domain.com",
            "frame-src 'none'",
            "object-src 'none'",
            "base-uri 'self'"
          ].join('; ')
        ]
      }
    });
  });
}
```

### 7.3 Navigation Restrictions

```typescript
// Prevent the renderer from navigating to arbitrary URLs
mainWindow.webContents.on('will-navigate', (event, url) => {
  if (!url.startsWith('file://')) {
    event.preventDefault();
  }
});

// Prevent new window creation
mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
```

### 7.4 External URL Validation

```typescript
// Validate URLs before opening in the system browser
import { shell } from 'electron';

const ALLOWED_EXTERNAL_DOMAINS = ['your-domain.com', 'github.com', 'learn.microsoft.com'];

export function openExternalSafe(url: string): void {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'https:' && ALLOWED_EXTERNAL_DOMAINS.some(d => parsed.hostname.endsWith(d))) {
      shell.openExternal(url);
    }
  } catch {
    // Invalid URL — silently ignore
  }
}
```

### 7.5 Security Checklist

- [ ] `contextIsolation: true` on all BrowserWindow instances
- [ ] `nodeIntegration: false` on all BrowserWindow instances
- [ ] `sandbox: true` where possible
- [ ] `webSecurity: true` (never disable)
- [ ] CSP enforced (no `unsafe-eval`, no wildcard sources)
- [ ] Navigation restricted to same-origin
- [ ] `shell.openExternal()` calls validate URLs against allowlist
- [ ] No `remote` module usage (deprecated)
- [ ] No `eval()`, `new Function()`, or `innerHTML` without sanitization
- [ ] All user/external HTML goes through DOMPurify
- [ ] Tokens never persisted without encryption
- [ ] No sensitive data in logs or telemetry
- [ ] IPC handler inputs validated before processing
- [ ] File paths validated to prevent directory traversal
- [ ] SQL queries use parameterized statements (never string concatenation)

---

## 8. App Startup & Lifecycle

### 8.1 Startup Sequence

Decompose startup into an ordered, non-blocking sequence:

```typescript
// src/main/core/startup.ts
export async function initializeApp(): Promise<void> {
  // 1. System prerequisites (fail fast)
  await checkPrerequisites();

  // 2. Database initialization & migration
  await initDatabase();

  // 3. Auth initialization
  await initAuth();

  // 4. Load user settings
  await loadSettings();

  // 5. Register all IPC handlers
  registerAllHandlers();

  // 6. Configure web security (CSP, navigation)
  configureCSP();

  // 7. Create main window
  const mainWindow = createMainWindow();

  // 8. Start background tasks (cache warm, update check)
  // These are non-blocking — don't await
  warmCache();
  checkForUpdates();
}
```

### 8.2 Graceful Shutdown

```typescript
// src/main/core/app-events.ts
app.on('will-quit', () => {
  closeDatabase(); // Close SQLite connection
  flushTelemetry(); // Ensure telemetry is sent
  cleanupTempFiles(); // Remove temporary artifacts
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
```

### 8.3 Main Entry Point

Keep `main.ts` minimal — delegate to startup:

```typescript
// src/main/core/main.ts
import { app } from 'electron';
import { initializeApp } from './startup';

app.whenReady().then(initializeApp);
```

---

## 9. State Management

### 9.1 Decision Matrix

| Complexity       | Solution                     | Use When                                                           |
| ---------------- | ---------------------------- | ------------------------------------------------------------------ |
| Simple           | `useState` / `useReducer`    | Single component, 1–3 state variables                              |
| Moderate         | Zustand store (page-local)   | Page with 4+ state variables, multiple subcomponents sharing state |
| Complex          | Zustand store (split slices) | Store exceeds 1000 lines; split by concern                         |
| Global singleton | React Context                | Auth state, user settings, theme                                   |

### 9.2 Zustand Store Pattern

```typescript
// src/renderer/pages/MyTool/store.ts
import { create } from 'zustand';
import { getErrorMessage } from '@/shared/utils/errors';

interface MyToolState {
  items: Item[];
  selectedId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadItems: () => Promise<void>;
  selectItem: (id: string) => void;
  deleteItem: (id: string) => Promise<void>;
}

export const useMyToolStore = create<MyToolState>((set, get) => ({
  items: [],
  selectedId: null,
  isLoading: false,
  error: null,

  loadItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await window.electronAPI.getItems();
      set({ items, isLoading: false });
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },

  selectItem: id => set({ selectedId: id }),

  deleteItem: async id => {
    await window.electronAPI.deleteItem(id);
    set(state => ({
      items: state.items.filter(i => i.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId
    }));
  }
}));
```

### 9.3 Splitting Large Stores

When a store exceeds ~1000 lines, split into slices:

```typescript
// store/items-slice.ts
export const createItemsSlice = (set, get) => ({
  items: [],
  loadItems: async () => {
    /* ... */
  }
});

// store/filters-slice.ts
export const createFiltersSlice = (set, get) => ({
  searchTerm: '',
  setSearchTerm: (term: string) => set({ searchTerm: term })
});

// store/index.ts
export const useMyToolStore = create((...args) => ({
  ...createItemsSlice(...args),
  ...createFiltersSlice(...args)
}));
```

---

## 10. UI & Styling Conventions

### 10.1 Component Library

Use a single UI component library consistently. **Never mix versions or libraries.**

For example, with Fluent UI v9 (or some other UI library):

```typescript
import { Button, Input, Dialog } from '@fluentui/react-components';
import { Search24Regular } from '@fluentui/react-icons';
```

### 10.2 Styling with `makeStyles`

Use the UI library's CSS-in-JS solution with design tokens:

```typescript
// src/renderer/pages/MyTool/styles.ts
import { makeStyles, tokens } from '@fluentui/react-components';

export const useMyToolStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '20px'
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)', // Glassmorphism tier
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: tokens.borderRadiusMedium,
    padding: '16px'
  },
  heading: {
    fontSize: '24px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1
  },
  codeBlock: {
    fontFamily: "'Cascadia Code', 'Consolas', monospace",
    fontSize: '13px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: '12px',
    borderRadius: tokens.borderRadiusMedium
  }
});
```

### 10.3 Shared Style Reuse

Create a shared styles hook that all pages extend:

```typescript
// src/renderer/styles/pageStyles.ts
export const usePageStyles = makeStyles({
  container: {
    /* standard page container */
  },
  header: {
    /* standard page header */
  },
  card: {
    /* standard glassmorphism card */
  },
  errorText: { color: '#f1707a', fontSize: '13px' },
  sectionHeader: {
    /* standard section heading */
  }
  // ... other common patterns
});
```

**Usage in pages:**

```typescript
import { mergeClasses } from '@fluentui/react-components';
import { usePageStyles } from '../../styles/pageStyles';
import { useMyToolStyles } from './styles';

function MyTool() {
  const page = usePageStyles();
  const styles = useMyToolStyles();

  return (
    <div className={page.container}>
      <div className={mergeClasses(page.card, styles.specialCard)}>
        {/* Extend shared styles, don't duplicate */}
      </div>
    </div>
  );
}
```

### 10.4 Styling Rules

- Use `makeStyles` + design tokens. Keep inline styles minimal (simple layout only).
- Respect dark theme — use tokens for colors, not hardcoded hex values.
- Never duplicate a shared style locally. Extend with `mergeClasses()`.
- If a custom style appears in 3+ pages, promote it to shared `pageStyles.ts`.
- Use monospace font (`'Cascadia Code', 'Consolas', monospace`) for code/token displays.

### 10.5 Design System Tiers (Glassmorphism Example)

If using a glassmorphism design language, define consistent tiers:

| Tier           | Background                  | Blur                       | Border                      | Use                   |
| -------------- | --------------------------- | -------------------------- | --------------------------- | --------------------- |
| Standard card  | `rgba(255, 255, 255, 0.04)` | `blur(12px)`               | `rgba(255, 255, 255, 0.08)` | Content cards, panels |
| Elevated panel | `rgba(255, 255, 255, 0.05)` | `blur(16px)`               | `rgba(255, 255, 255, 0.1)`  | Sidebars, toolbars    |
| Heavy glass    | `rgba(255, 255, 255, 0.06)` | `blur(24px) saturate(1.4)` | `rgba(255, 255, 255, 0.12)` | Dialogs, modals       |
| Hover state    | Background +0.04 opacity    | —                          | Border +0.07 opacity        | Interactive elements  |

---

## 11. Accessibility

All new components and UX must be accessible by default.

### 11.1 Interactive Elements

- Use `<button>` (not `<div onClick>`) for clickable elements.
- If a `<div>` must be clickable, add `role="button"`, `tabIndex={0}`, and `onKeyDown` for Enter/Space.
- Icon-only buttons must have `aria-label` (not just `title`).

### 11.2 Form Inputs

- Every `<Input>`, `<Textarea>`, `<Dropdown>` must have `aria-label` or be wrapped in `<Field label="...">`.
- Required fields: `aria-required="true"`.
- Error messages: associate with input via `aria-describedby`.

### 11.3 Page Structure

- Page titles use `<h1>` for heading navigation.
- Heading hierarchy (`h1` → `h2` → `h3`) must be logical, no skipped levels.
- Use landmark roles: `role="navigation"`, `role="main"`, `role="complementary"`.

### 11.4 Dynamic Content

- Expandable sections must use `aria-expanded` on the toggle control.
- Status changes (errors, loading, clipboard feedback) should use a live region announcer.
- Tree structures need `role="tree"` / `role="treeitem"`.
- Tab strips need `role="tablist"` / `role="tab"` with `aria-selected`.

### 11.5 Visual Accessibility

- Never use color as the sole indicator of state — pair with text or icons.
- Never use `outline: none` without `:focus-visible` — keyboard focus must be visible.
- Support `prefers-reduced-motion` for animations.
- Support high-contrast mode (`forced-colors` media queries).

### 11.6 Screen Reader Announcements

Create a live region component for programmatic announcements:

```typescript
// src/renderer/components/ScreenReaderAnnouncer.tsx
// Provides an announce() function for status changes
// Uses aria-live="polite" region
export function announce(message: string): void {
  /* ... */
}
```

Call `announce()` for: copy-to-clipboard success, operation results, loading state changes, errors.

---

## 12. Database & Persistence

### 12.1 Persistence Mechanisms

| Mechanism             | Use For                                                    | Location                        |
| --------------------- | ---------------------------------------------------------- | ------------------------------- |
| SQLite (via ORM)      | Structured tool data, user-created items, history, results | `{userData}/app.db`             |
| Settings JSON         | UI preferences only (theme, favorites, layout)             | `{userData}/settings.json`      |
| Collection JSON files | Git-syncable item collections                              | `{userData}/collections/*.json` |

**Rule:** Never store data records in the settings file. Settings are for preferences only.

### 12.2 Database Layer Structure

```
src/main/db/
├── schema.ts              # ORM schema (source of truth)
├── migrations/            # Auto-generated migration SQL
│   ├── 0000_initial.sql
│   ├── 0001_add_history.sql
│   └── meta/              # Migration journal
├── data-access/           # CRUD functions per domain
│   ├── items.ts
│   ├── history.ts
│   └── index.ts           # Barrel export
└── __tests__/
    └── test-harness.ts    # In-memory DB for tests
```

### 12.3 Schema Definition Example (Drizzle ORM)

```typescript
// src/main/db/schema.ts
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const items = sqliteTable('items', {
  id: text('id').primaryKey(),
  label: text('label').notNull(),
  url: text('url').notNull(),
  category: text('category', { enum: ['a', 'b', 'c'] }).notNull(),
  userDefined: integer('user_defined', { mode: 'boolean' }).default(true)
});

export const itemResults = sqliteTable(
  'item_results',
  {
    id: text('id').primaryKey(),
    itemId: text('item_id').notNull(),
    timestamp: integer('timestamp').notNull(),
    success: integer('success', { mode: 'boolean' }).notNull()
  },
  t => [index('idx_item_results_timestamp').on(t.timestamp)]
);
```

### 12.4 Adding a New Persisted Entity

Follow all 7 steps every time:

1. **Schema** — Add table definition in `schema.ts`
2. **Migration** — Generate migration (`npm run db:generate`) and commit the SQL files
3. **Data access** — Add CRUD functions in `data-access/<entity>.ts`
4. **Types** — Add/extend types in `src/shared/types/`; re-export from `index.ts`
5. **ElectronAPI** — Add method signatures to `electron-api.ts`
6. **IPC handlers** — Register handlers in `src/main/ipc/handlers/`
7. **Preload** — Expose methods via `preload.ts`

### 12.5 Database Conventions

- Schema in `schema.ts` is the source of truth. Never modify migration SQL manually.
- The renderer **never** imports database modules. All DB access goes through IPC.
- Initialize database on app startup; close on `will-quit`.
- Use indexes on frequently queried columns.
- Use parameterized queries — never concatenate user input into SQL.

---

## 13. Performance & Bundle Splitting

### 13.1 Code Splitting

- **Every page** must be lazy-loaded via `React.lazy()` + `<Suspense>`:

```typescript
const MyTool = lazy(() => import('./pages/MyTool'));
```

- **Heavy libraries** (Monaco Editor, Mermaid, charting libraries) must be dynamically imported with singleton loader patterns:

```typescript
// src/renderer/components/monacoSetup.ts
let monacoPromise: Promise<typeof monaco> | null = null;

export function preloadMonaco(): Promise<typeof monaco> {
  if (!monacoPromise) {
    monacoPromise = import('monaco-editor');
  }
  return monacoPromise;
}
```

- Use `import type` for type-only imports (erased at build time):

```typescript
import type { Item } from '../../shared/types'; // Type only — not in bundle
```

### 13.2 React Rendering Efficiency

- Use `useMemo` / `useCallback` for expensive computations and stable callback references.
- Avoid creating new object/array/function references in JSX props.
- Use virtualization for large lists (DataTable with windowing).
- Keep frequently-changing state isolated from expensive render subtrees.
- Use stable `key` props (entity IDs, not array indices) on dynamic lists.

### 13.3 Memory Management

- Clean up all event listeners, intervals, and subscriptions in `useEffect` return functions.
- Remove IPC listeners on component unmount.
- Don't hold large datasets in state longer than needed.
- Watch for closures in long-lived callbacks capturing large objects.

### 13.4 Main Process Efficiency

- Use the cache layer for all main-process reads. Invalidate on writes.
- Use `Promise.all` for independent async operations (don't await sequentially).
- Avoid synchronous file I/O in IPC handlers — use async variants.
- Transfer minimal data over IPC. Don't send full datasets when subsets suffice.
- Debounce/throttle high-frequency renderer → main calls.

### 13.5 Build Configuration (Vite)

```typescript
// vite.config.ts (simplified)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';

export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        entry: 'src/main/core/main.ts', // Main process entry
        outDir: 'dist-electron'
      },
      {
        entry: 'src/main/ipc/preload.ts', // Preload script entry
        outDir: 'dist-electron'
      }
    ])
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // Path alias: @/* → src/*
    }
  },
  build: {
    // Don't raise chunkSizeWarningLimit — fix chunking instead
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': ['@fluentui/react-components']
        }
      }
    }
  }
});
```

---

## 14. Testing Strategy

### 14.1 Framework & Configuration

- **Framework:** Vitest + `@testing-library/react`
- **Location:** Co-located `__tests__/` folders inside the same directory as the file under test
- **Naming:** `*.test.ts` / `*.test.tsx`
- **Imports:** Relative paths from test files to modules under test

### 14.2 What to Test

| Layer                       | Test Type                 | What to Assert                                   |
| --------------------------- | ------------------------- | ------------------------------------------------ |
| `shared/utils/`             | Unit tests                | Pure function behavior, edge cases               |
| `main/db/data-access/`      | Unit tests (in-memory DB) | CRUD operations, constraints, migrations         |
| `main/ipc/handlers/`        | Integration tests         | Input validation, error handling, response shape |
| `renderer/pages/*/utils.ts` | Unit tests                | Pure helpers                                     |
| `renderer/pages/*/store.ts` | Unit tests                | State transitions, action logic                  |
| `renderer/hooks/`           | Hook tests                | Hook behavior with `renderHook()`                |
| `renderer/components/`      | Component tests           | Rendering, interaction, accessibility            |

### 14.3 Testing Conventions

- Always write regression tests for bug fixes.
- Always include unit tests for new features.
- Test behavior, not implementation details.
- Test both happy paths and error/edge cases.
- Mock the IPC bridge (`window.electronAPI`) consistently across test files.
- Use in-memory SQLite for database tests (create a test harness).

### 14.4 Commands

```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

---

## 15. Build & Dev Workflow

### 15.1 Development

```bash
npm run dev              # Start Electron + Vite dev server (hot reload)
npm run lint             # Run ESLint
npm run lint:fix         # Auto-fix lint issues
npm test                 # Run tests
npm run test:watch       # Tests in watch mode
```

### 15.2 Production Build

```bash
npm run build            # Build main + renderer
npm run dist:win         # Package for Windows (electron-builder)
npm run dist:mac         # Package for macOS
npm run dist:linux       # Package for Linux
```

### 15.3 Database Migrations

```bash
npm run db:generate      # Generate migration from schema changes
# Then commit the generated migration SQL + meta/journal files
```

### 15.4 Output Directories

| Directory        | Contents                       |
| ---------------- | ------------------------------ |
| `dist/`          | Built renderer (HTML/CSS/JS)   |
| `dist-electron/` | Built main process + preload   |
| `release/`       | Packaged application artifacts |

### 15.5 Code Conventions

- Keep files under 1000 lines. Split when it grows beyond that.
- All imports at top-level. No inline `require()`.
- Use `import type` for type-only imports.
- Don't disable ESLint without a short reason comment.
- Use a centralized error-to-string helper (e.g., `getErrorMessage(err)`) — no inline `err instanceof Error ? err.message : ...` patterns.
- Path alias: `@/*` → `src/*`.

---

## 16. Telemetry & Observability

### 16.1 Renderer Telemetry

Create a centralized telemetry module:

```typescript
// src/renderer/utils/telemetry.ts
export const logger = {
  /* structured logging */
};
export function emitEvent(name: string, data: Record<string, unknown>): void {
  /* ... */
}
export function trackToolOpen(toolId: string, entryPoint: string): void {
  /* ... */
}
export function startToolTimer(toolId: string): { done: (success: boolean, error?: string) => void } {
  /* ... */
}
```

### 16.2 Usage Pattern

```typescript
// Track page opens
trackToolOpen('my-tool', 'sidebar');

// Track user-triggered actions with timing
const { done } = startToolTimer('my-tool');
try {
  await performAction();
  done(true);
} catch (err) {
  done(false, getErrorMessage(err));
}
```

### 16.3 Rules

- Place timer start after early returns.
- Every user-triggered tool action must emit timing telemetry.
- All telemetry is forwarded to the main process via IPC.
- Never log sensitive data (tokens, passwords, PII) in telemetry events.
- Never make direct telemetry SDK calls from the renderer — route through the centralized module.

---

## 17. Caching

### 17.1 Main-Process Cache Layer

```typescript
// src/main/platform/cache.ts
const cache = new Map<string, { data: unknown; expiresAt: number }>();

export function getMainCached<T>(key: string): T | undefined {
  /* ... */
}
export function setMainCache<T>(key: string, data: T, ttlMs: number): void {
  /* ... */
}
export function clearMainCache(key: string): void {
  /* ... */
}
export function scheduleMainRefresh(key: string, refreshFn: () => Promise<unknown>, intervalMs: number): void {
  /* ... */
}
```

### 17.2 Caching Rules

- Every main-process read path should check the cache first via `getMainCached`.
- Invalidate or update cache entries on writes.
- Use `scheduleMainRefresh` for data that benefits from periodic background updates.
- Document any read path that intentionally bypasses the cache.

---

## 18. New Feature Checklist

### Adding a New Tool Page

1. [ ] Create `src/renderer/pages/<PageName>/` with `index.tsx` + `styles.ts`
2. [ ] Add tool ID to your routing enum/union in `App.tsx`
3. [ ] Add lazy import + render case in `App.tsx`
4. [ ] Add navigation entry in `Sidebar` (sorted alphabetically within category)
5. [ ] Add welcome/landing card on home page
6. [ ] Add telemetry: `trackToolOpen(toolId)` on navigation, `startToolTimer(toolId)` on actions
7. [ ] Write unit tests for `utils.ts` and `store.ts`
8. [ ] Write component tests for key interactions

### Adding a New Persisted Entity

1. [ ] Add table in `schema.ts`
2. [ ] Generate migration (`npm run db:generate`)
3. [ ] Commit generated migration files
4. [ ] Add CRUD data-access functions
5. [ ] Add `ElectronAPI` method signatures
6. [ ] Register IPC handlers
7. [ ] Expose in preload
8. [ ] Write tests for data-access functions

### Adding a New IPC Channel

1. [ ] Add method to `ElectronAPI` interface (`src/shared/types/electron-api.ts`)
2. [ ] Add handler in `src/main/ipc/handlers/<domain>-handlers.ts`
3. [ ] Expose in `src/main/ipc/preload.ts`
4. [ ] Update `src/renderer/types/electron.d.ts`
5. [ ] Validate inputs in the handler
6. [ ] Write integration test for the handler

---

## Quick Reference

### Files That Must Stay in Sync

| Change          | Files to Update                                                            |
| --------------- | -------------------------------------------------------------------------- |
| New IPC method  | `electron-api.ts` + `preload.ts` + `electron.d.ts` + handler file          |
| New DB table    | `schema.ts` + generate migration + data-access + types + handler + preload |
| New page        | Page folder + `App.tsx` route + Sidebar nav + Welcome card                 |
| New shared type | `src/shared/types/<domain>.ts` + re-export from `index.ts`                 |

### Decision Quick Guide

| Question                      | Answer                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------- |
| Where does this HTTP call go? | Main process, through centralized `httpRequest()`                                     |
| Where does state live?        | Simple: `useState`. Complex: Zustand store. Global: Context                           |
| How do I style this?          | `makeStyles` + tokens. Check `pageStyles.ts` first. Extend with `mergeClasses`.       |
| How do I display user HTML?   | Through a sanitizing `HtmlRenderer` (DOMPurify). Never raw `dangerouslySetInnerHTML`. |
| How do I persist this data?   | SQLite via IPC. Settings file for UI prefs only.                                      |
| How do I handle errors?       | Centralized `getErrorMessage(err)` helper. Never inline `instanceof Error`.           |
| How do I add a new page?      | Folder-based structure. Lazy load in App.tsx. Register in sidebar + welcome.          |

---

_This guide is a generic template derived from production Electron app conventions. Adapt the specific technologies (Fluent UI, Drizzle ORM, Zustand, Vite) to your preferred stack while keeping the architectural principles and process boundaries intact._
