# Object Layer Feature — Design (v2: Code-Only Prefabs)

## Problem Statement

The editor needs to let users **place game objects** onto maps visually — drag them from a library, position them, and export the scene so the engine can reconstruct them at runtime.

## Design Decision: Code-Only Prefabs

Rather than a data-driven approach (composing game objects from JSON), prefabs are defined **entirely in code** as classes extending `GameObject`. This is the natural fit because:

- Complex objects like `Player` need asset pool access, component cross-references, and child hierarchies that can't be expressed in JSON
- The engine already has a robust class-based composition model (`buildInitialComponents()`, `getPrefabSettings()`)
- No serialize/deserialize burden on every component
- Asset pool sharing works naturally — no duplicate loading

**A prefab = a TypeScript class extending `GameObject`.** The editor discovers these classes, shows them in a library, and lets you drag-and-drop instances onto the map. Each instance stores only placement data (position, rotation, scale). At runtime, the engine calls the class constructor.

---

## Data Model

### Discovered Game Object Class (editor-side)

```typescript
interface IDiscoveredGameObject {
  className: string;        // "Player", "Minotaur", "Box"
  filePath: string;         // Relative path: "src/game-objects/Player.ts"
  category: string;         // Derived from directory: "game-objects", or user-defined
}
```

### Instance (placed on map)

```typescript
interface IEditorPrefabInstance {
  id: string;               // Unique instance ID (UUID)
  gameObjectClass: string;  // Class name: "Player", "Box"
  name: string;             // Display name: "Player", "Player (1)"
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  parentInstanceId: string | null;
  zIndex: number;
  enabled: boolean;
}
```

No `componentOverrides` — the class defines everything. The editor only controls placement.

### Object Layer

```typescript
interface IEditorObjectLayer {
  type: 'object';
  name: string;
  instances: IEditorPrefabInstance[];
  visible: boolean;
  opacity: number;
}
```

---

## Editor Flow

1. **Project scan** discovers `class X extends GameObject` files in the project's `src/` directory
2. **Prefab Library** shows discovered classes, grouped by directory/category
3. **Drag-and-drop** from library to canvas creates an instance with position
4. **Object Hierarchy** shows all instances in the scene
5. **Inspector** shows instance transform (position, rotation, scale) — no component editing
6. **Scene export** writes a manifest mapping instance IDs to class names + positions

---

## Scene Export / Runtime Integration

The editor exports a scene manifest that the game's scene loader uses to instantiate objects:

```typescript
// Exported by editor: scene-objects.json
{
  "objects": [
    { "className": "Player", "x": 400, "y": 250, "rotation": 0, "scaleX": 1, "scaleY": 1 },
    { "className": "Minotaur", "x": 600, "y": 300, "rotation": 0, "scaleX": 1, "scaleY": 1 },
    { "className": "Box", "x": 100, "y": 500, "rotation": 0, "scaleX": 1, "scaleY": 1 }
  ]
}
```

The game registers its classes with a **GameObjectRegistry** (name → constructor map), then the scene loader iterates the manifest and calls `new ClassName({ gameEngine, x, y, rotation })` for each entry.

```typescript
// In the game project
const GAME_OBJECTS = new Map([
  ['Player', Player],
  ['Minotaur', Minotaur],
  ['Box', Box],
]);

// Scene loader
for (const obj of manifest.objects) {
  const ctor = GAME_OBJECTS.get(obj.className);
  if (ctor) {
    gameEngine.instantiate(ctor, new Vector2(obj.x, obj.y), obj.rotation);
  }
}
```

---

## What Gets Removed (from v1 data-driven approach)

- `IEditorPrefab` type and `.entropy-prefab.json` files
- `PrefabRegistry` and `instantiatePrefab()` on engine
- `PrefabName` branded type and declaration merging
- Component schemas (`COMPONENT_SCHEMAS`, `IComponentSchema`, `IComponentFieldDescriptor`)
- Prefab Editor modal (component list, field editors)
- `ComponentFieldEditor` component
- `PrefabBaker` and `PrefabManifestExporter`
- Component override system (`IComponentOverride`)
- Prefab CRUD store actions and IPC handlers

## What Gets Kept

- Object layers with instances
- Prefab Library panel (shows discovered classes instead of JSON prefabs)
- Object Hierarchy panel
- Canvas instance rendering, drag-and-drop, selection, dragging
- Instance Inspector (transform fields only — no component editing)
- User component/GameObject discovery scanner

## What Changes

- `IEditorPrefabInstance.prefabId` → `IEditorPrefabInstance.gameObjectClass` (string class name)
- Prefab Library shows discovered GameObjects, not JSON prefabs
- Canvas renders instances as simple markers/icons (can't inspect class internals)
- Scene export emits class name + position manifest (not baked ISerializedGameObject)
- Inspector shows only transform — no component fields

---

## Resolved Design Decisions

1. **Prefab editor UI:** Not needed — classes define their own components in code
2. **Canvas rendering of instances:** Simple markers with class name labels (can't render actual components since they're code-defined)
3. **Custom components:** Naturally supported — they're just part of the class
4. **Nested prefabs:** Handled via `buildAndReturnChildGameObjects()` in code
5. **Undo/redo:** Only for instance placement/movement (map-level undo stack)

