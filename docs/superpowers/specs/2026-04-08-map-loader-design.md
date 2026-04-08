# Map Loader: Loading `.entropy-map` Files in the Engine

**Date:** 2026-04-08
**Status:** Draft

## Problem

The Entropy Editor saves terrain maps as `.entropy-map` JSON files. Games currently define terrain manually using TypeScript classes that implement `ITerrainSpec` (e.g., `Scene1TerrainSpec`). There is no way for the engine to consume editor-produced map files directly. Games should be able to load `.entropy-map` files and use them as terrain specs without hand-coding terrain grids.

## Proposed Approach: Static Converter Utility

A `MapLoader` class in the engine with a pure static method that converts parsed `.entropy-map` JSON into an `ITerrainSpec`. The game code is responsible for obtaining the JSON (via import, fetch, etc.) — the engine stays agnostic about file loading.

**Why this approach over alternatives:**

- **vs. Full loader with fetch**: Coupling the engine to `fetch()` limits flexibility. Games using Vite, Webpack, or other bundlers may load assets differently.
- **vs. Scene-level integration (e.g., `IScene.mapUrl`)**: Adding a URL property to `IScene` couples the scene contract to network I/O and async loading in a place that's currently synchronous. The existing `terrainSpec` property works fine.

A convenience `fromUrl()` method is also provided for simple cases where fetching from a URL is appropriate.

## Format Gap

The `.entropy-map` format (editor output) differs from the engine's `ITerrainSpec` in how tile graphics are referenced:

| Aspect | `.entropy-map` | Engine `ITerrainSpec` |
|---|---|---|
| Tile identification | Integer tile IDs per layer, each layer references a `tileSetId` | Integer tile IDs per layer, each ID maps to a path string in `tileSet` |
| Tileset definition | Separate `tilesets[]` array with grid metadata (`columns`, `rows`, `imagePath`) | Inline `tileSet: Record<number, string>` with sprite-sheet coordinates encoded in path fragment |
| Asset paths | Relative paths (e.g., `assets/tilesets/Forest_3_Tile.png`) | Resolved URLs usable by `new Image()` |

**Conversion**: For each tile ID in a layer's grid, compute the sprite sheet coordinates from the tileset's grid layout, then encode as `{imagePath}#{sliceX},{sliceY},{sliceWidth},{sliceHeight}` — the format `TerrainBuilder.parseSpriteSheetTile()` already supports.

## Architecture

### New Types (in `core/types.ts`)

```typescript
// Minimal types matching the .entropy-map JSON structure.
// Structurally compatible with the editor's IEditorMapFile — extra fields are ignored.

interface IMapFile {
  name: string;
  tileWidth: number;
  tileHeight: number;
  layers: IMapLayer[];
  tilesets: IMapTileset[];
}

interface IMapTileLayer {
  type: 'tile';
  name: string;
  grid: number[][];
  tileSetId: string;
  visible: boolean;
  opacity: number;
  passability?: boolean[][];
  weights?: number[][];
}

interface IMapObjectLayer {
  type: 'object';
  [key: string]: unknown;
}

type IMapLayer = IMapTileLayer | IMapObjectLayer;

interface IMapTileset {
  id: string;
  imagePath: string;
  tileWidth: number;
  tileHeight: number;
  columns: number;
  rows: number;
  tileCount: number;
}

interface IMapLoaderOptions {
  /** Base path to prepend to relative asset paths (e.g., '/assets' or 'https://cdn.example.com'). */
  basePath?: string;
  /** Custom function to resolve asset paths. Overrides basePath if provided. */
  resolveAssetPath?: (relativePath: string) => string;
}
```

### MapLoader (new file: `core/helpers/MapLoader.ts`)

```typescript
export class MapLoader {
  /**
   * Converts parsed .entropy-map JSON into an ITerrainSpec.
   * The returned spec uses the layered terrain format.
   */
  static toTerrainSpec(mapData: IMapFile, options?: IMapLoaderOptions): ITerrainSpec;

  /**
   * Fetches a .entropy-map file from a URL, parses it, and converts to ITerrainSpec.
   */
  static async fromUrl(url: string, options?: IMapLoaderOptions): Promise<ITerrainSpec>;
}
```

### Conversion Logic

For each tile layer in `mapData.layers` (skipping object layers):

1. If the layer's grid contains only zeros (empty layer), produce a layer with an empty `tileSet` record — no tileset lookup required. This handles editor-generated layers with `tileSetId: ''` and all-zero grids.
2. Otherwise, find the tileset matching `layer.tileSetId` in `mapData.tilesets`. Throw if not found.
3. Collect all unique tile IDs from `layer.grid` that are in the valid range `[1, tileset.tileCount]`. IDs outside this range (including negative values) are treated as empty — they are replaced with `0` in the output grid.
4. For each valid tile ID, compute sprite sheet coordinates:
   - `column = (tileId - 1) % tileset.columns`
   - `row = Math.floor((tileId - 1) / tileset.columns)`
   - `sliceX = column * tileset.tileWidth`
   - `sliceY = row * tileset.tileHeight`
5. Build the `tileSet` record: `tileSet[tileId] = resolvedPath + '#' + sliceX,sliceY,sliceWidth,sliceHeight`.
6. Resolve the image path using `options.resolveAssetPath(imagePath)` if provided, else `options.basePath + '/' + imagePath` if basePath is set, else `imagePath` as-is.

The output `ITerrainSpec` uses the layered format:
```typescript
{
  tileWidth: mapData.tileWidth,
  tileHeight: mapData.tileHeight,
  layers: [/* converted ITerrainLayer[] */]
}
```

Each converted layer passes through `visible`, `opacity`, `passability`, and `weights` directly from the map file. The `grid` is copied, with any invalid tile IDs replaced with `0`.

**Edge case — no tile layers remain:** If the map file contains no tile layers (e.g., only object layers), `toTerrainSpec()` throws with a clear error: `"Map file contains no tile layers."` This prevents producing an `ITerrainSpec` that `TerrainBuilder` would reject as invalid.

### Error Handling

- Throw if a non-empty tile layer's `tileSetId` doesn't match any tileset in the map file.
- Throw if the map file contains no tile layers at all.
- Tile IDs outside the tileset's valid range (`< 1` or `> tileCount`) are replaced with `0` in the output grid for robustness — the editor should never produce invalid IDs, but corrupted files shouldn't crash the engine.

### Exports

- Add `export * from './MapLoader'` to `core/helpers/index.ts`.
- All new types exported from `core/types.ts`.

## Sample Game Integration

Update `sample-games/sample-game-1` to use the map loader:

1. **Vite config**: Use Vite's `?raw` import suffix to get the `.entropy-map` file as a string. Add a TypeScript module declaration for `*.entropy-map?raw` (e.g., in a `src/vite-env.d.ts` or existing declarations file) so the import type-checks.
2. **Asset serving**: Tileset images referenced by the map file use relative paths like `assets/tilesets/Forest_3_Tile.png`. These must be available at runtime via the browser. **Copy tileset images to `public/assets/tilesets/`** so Vite serves them at predictable URLs (`/assets/tilesets/Forest_3_Tile.png`). Do NOT rely on `new URL(runtimeString, import.meta.url)` — Vite only rewrites static `new URL()` calls; runtime strings from parsed JSON will not be part of the asset graph and will break in production builds.
3. **Vite client types**: Ensure `tsconfig.json` includes `vite/client` types (or add the `src/vite-env.d.ts` reference) so `?raw` imports are recognized.
4. **Scene update**: In `Scenes.ts`, replace `new Scene1TerrainSpec(3)` with:
   ```typescript
   import { MapLoader } from '@entropy-engine/entropy-game-engine';
   import Scene1MapRaw from '../maps/Scene1.entropy-map?raw';

   const scene1MapData = JSON.parse(Scene1MapRaw);
   // terrainSpec: MapLoader.toTerrainSpec(scene1MapData)
   ```
5. **Tile size note**: The current `Scene1TerrainSpec` uses `cellSize: 16` with `scale: 3` (effective 48px tiles). The `.entropy-map` file uses `tileWidth: 32` / `tileHeight: 32` with different tilesets. The map file's own dimensions will be used as-is — this is a different map, not a 1:1 replacement of the legacy spec.

## Testing

New test file: `core/helpers/__tests__/map-loader.test.ts`

Test cases:
- Single-layer map converts to correct `ITerrainSpec` with layered format
- Multi-layer map produces one `ITerrainLayer` per tile layer
- Tile ID → sprite sheet coordinate calculation is correct (edge cases: first tile, last tile, end-of-row)
- `basePath` option prepends to all image paths
- `resolveAssetPath` option is called for each unique image path and overrides basePath
- Object layers are silently skipped
- Non-empty layer with missing tileset throws an error
- Map with no tile layers throws an error
- Empty grid (all zeros) produces a layer with an empty `tileSet` record, no tileset lookup required
- Empty layer with `tileSetId: ''` and all-zero grid does not throw
- Invalid tile IDs (negative, > tileCount) are replaced with `0` in output grid
- `passability` and `weights` arrays are passed through to the output
- `fromUrl()` fetches and parses JSON, then delegates to `toTerrainSpec()`

## Scope Boundaries

**In scope:**
- `MapLoader` utility class with `toTerrainSpec()` and `fromUrl()`
- Map file types in the engine
- Engine exports
- Sample game 1 integration
- Unit tests for MapLoader

**Out of scope:**
- Object layer support (future work)
- Editor changes
- Shared types package between editor and engine
- Scale/zoom support on map files (the map's `tileWidth`/`tileHeight` are used directly)
