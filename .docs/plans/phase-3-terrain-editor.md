# Phase 3: Terrain Editor MVP

## Goal

Build a visual tile map editor as an Electron desktop app where users can paint terrain maps, manage tile layers, and save/load maps as JSON — replacing the painful hand-coded array workflow in files like `Scene1TerrainSpec.ts`.

## Platform & Tech

- **Shell:** Electron via `electron-vite` (integrates with existing Vite tooling)
- **UI Framework:** React (editor panels — tile palette, layers, properties)
- **Renderer:** Entropy engine canvas in paused mode with manual `renderScene()` calls
- **New workspace package:** `packages/entropy-editor`

## Current State

The engine already supports:
- JSON terrain format: `{ tileWidth, tileHeight, grid: number[][], tileSet: Record<number, string> }`
- `SceneSerializer.toJSON()` / `SceneSerializer.fromJSON()` for save/load
- `TerrainBuilder` that builds terrain from JSON spec
- Camera with `screenToWorld()` / `worldToScreen()` coordinate conversion
- Spritesheet fragment notation: `"tileset.png#x,y,w,h"`

What's missing:
- No public `renderFrame()` method on `GameEngine` (render is private)
- No terrain hot-reload (`updateTerrain()` method)
- No tile layer support (single flat grid)
- No editor UI

---

## Implementation Plan

### 3A. Engine Additions (no editor dependency)

Small targeted additions to the engine package to support editor use cases:

1. **`GameEngine.renderFrame()`** — Public method that calls `renderingEngine.renderScene()` once. Allows editor to render on demand without running the game loop.

2. **`GameEngine.updateTerrain(newSpec)`** — Rebuilds terrain from a new spec without reloading the entire scene. Destroys old terrain, builds new one, updates rendering engine reference.

3. **Tile layer support in `ITerrainSpec`** — Extend the terrain format:
   ```typescript
   interface ITerrainLayer {
     name: string;
     grid: number[][];
     tileSet: Record<number, string>;
     visible: boolean;
     opacity: number;
   }

   // ITerrainSpec gets optional layers field
   interface ITerrainSpec {
     // ... existing fields (backward compatible)
     layers?: ITerrainLayer[];
   }
   ```
   Update `TerrainBuilder` to composite multiple layers in z-order.

4. **Grid overlay gizmo** — A debug renderable that draws tile grid lines over the terrain when `developmentMode` is true. Useful in editor and during development.

### 3B. Editor Package Scaffold

Create `packages/entropy-editor` as a new workspace package:

```
packages/entropy-editor/
├── package.json
├── electron.vite.config.ts
├── tsconfig.json
├── src/
│   ├── main/              # Electron main process
│   │   └── index.ts       # Window creation, IPC, file system
│   ├── preload/
│   │   └── index.ts       # Context bridge for file I/O
│   └── renderer/          # Electron renderer process (React app)
│       ├── index.html
│       ├── main.tsx        # React entry point
│       ├── App.tsx         # Root layout
│       ├── editor/         # Editor core logic
│       │   ├── EditorEngine.ts     # Wraps GameEngine for editor use
│       │   ├── TileMapEditor.ts    # Terrain editing state machine
│       │   └── EditorHistory.ts    # Undo/redo stack
│       ├── components/     # React UI components
│       │   ├── Canvas.tsx          # Engine canvas wrapper
│       │   ├── TilePalette.tsx     # Tile selection grid
│       │   ├── LayerPanel.tsx      # Layer list with visibility toggles
│       │   ├── PropertiesPanel.tsx # Selected tile/terrain properties
│       │   ├── Toolbar.tsx         # Tool buttons (brush, fill, eraser, select)
│       │   └── MenuBar.tsx         # File menu (new, open, save, export)
│       ├── hooks/          # React hooks
│       │   ├── useEditorEngine.ts
│       │   └── useTileMap.ts
│       └── styles/
│           └── editor.css
```

### 3C. Editor Engine Wrapper

`EditorEngine.ts` wraps `GameEngine` for editor use:

- Creates a `GameEngine` in paused mode
- Loads a minimal scene with just terrain (no game objects simulating)
- Exposes `renderFrame()` for on-demand rendering
- Handles camera pan/zoom via mouse wheel and middle-click drag
- Converts mouse clicks to grid coordinates via `camera.screenToWorld()`
- Calls `gameEngine.updateTerrain()` when the map changes

### 3D. Tile Palette

`TilePalette.tsx` — React component:

- Load a tileset image (spritesheet) from disk via Electron file dialog
- Parse the spritesheet into a grid of tiles based on tile width/height
- Display tiles in a scrollable grid
- Click to select active tile (stores tile ID)
- Show tile ID, dimensions, and preview of selected tile
- Support multiple tilesets (dropdown to switch)

### 3E. Canvas + Painting Tools

`Canvas.tsx` + `TileMapEditor.ts`:

**Tools:**
- **Brush** — Click/drag to paint selected tile onto grid cells
- **Eraser** — Click/drag to clear cells (set to 0)
- **Fill (bucket)** — Flood fill contiguous same-ID region with selected tile
- **Eyedropper** — Click a tile to select its ID as active
- **Rectangle select** — Select a region for copy/paste or batch operations

**Canvas interaction:**
- Left click: apply active tool
- Middle click drag: pan camera
- Scroll wheel: zoom camera
- Right click: toggle passable/impassable on clicked cell
- Keyboard: Z = undo, Y = redo, G = toggle grid, number keys = switch tools

**Rendering:**
- Engine renders terrain normally via `renderFrame()`
- Editor overlay canvas (layered on top) draws:
  - Grid lines
  - Selection highlight
  - Hover preview (ghost tile under cursor)
  - Tool cursors

### 3F. Layer Panel

`LayerPanel.tsx`:

- List layers with name, visibility toggle (eye icon), opacity slider
- Click to select active layer (painting goes to this layer)
- Add/remove/reorder layers via buttons
- Each layer has its own `grid[][]` and `tileSet`
- Layers rendered bottom-to-top by `TerrainBuilder`

### 3G. Properties Panel

`PropertiesPanel.tsx`:

- **Terrain properties:** Map dimensions (rows × cols), tile size, name
- **Selected tile properties:** Tile ID, passable/impassable, weight (for pathfinding)
- **Resize map:** Change dimensions (with anchor option — grow from which edge)

### 3H. File Operations (Electron IPC)

**Save/Load terrain:**
- Save: serialize terrain layers to JSON, write to disk via Electron IPC
- Load: read JSON file, deserialize, rebuild terrain
- File format: `.entropy-map` (JSON with ISerializedTerrain + layers)

**Import tileset:**
- File dialog to select PNG spritesheet
- Auto-detect tile size or let user specify
- Copy asset to project assets directory

**Export:**
- Export rendered terrain as PNG image
- Export to Tiled JSON format (.tmj) for interop

### 3I. Undo/Redo

`EditorHistory.ts`:

- Command pattern: each edit operation creates a command object
- Commands store previous state (for undo) and new state (for redo)
- Stack-based: undo pops from undo stack, pushes to redo stack
- Batch support: group rapid brush strokes into single undo operation
- Memory-efficient: store diffs (changed cells) not full grid copies

---

## Dependency Order

```
3A (engine additions)  ← no dependencies, parallel with scaffold
3B (editor scaffold)   ← no dependencies, parallel with engine additions

3C (editor engine)     ← depends on 3A, 3B
3D (tile palette)      ← depends on 3B
3E (canvas + painting) ← depends on 3C, 3D
3F (layer panel)       ← depends on 3C
3G (properties panel)  ← depends on 3C
3H (file operations)   ← depends on 3B
3I (undo/redo)         ← depends on 3E

Parallelizable groups:
  Wave 1: [3A, 3B]
  Wave 2: [3C, 3D, 3H]
  Wave 3: [3E, 3F, 3G]
  Wave 4: [3I]
```

---

## Out of Scope (Phase 4)

- General game object placement/manipulation
- Component inspector panels
- Play/pause/step game simulation in editor
- Asset browser with drag-and-drop
- Multi-scene management
- Prefab system UI
- Publishing/exporting game builds
