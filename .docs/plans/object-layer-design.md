# Object Layer Feature — Design Proposal

## Problem Statement

The editor currently supports placing **sprite images** on object layers — flat visual stamps with position, rotation, and scale. There is no concept of a **game object** with components, no prefab system for reusable templates, and no scene hierarchy.

The goal is to let users **compose game objects** (attach components, configure initial field values), save them as **prefabs** (reusable templates), **drag-and-drop** prefab instances onto the map, and view/manage them in an **object hierarchy**.

---

## Key Architectural Insight

The engine already has two composition models:

1. **Class-based (compile-time):** `Box extends GameObject`, overrides `buildInitialComponents()` and `getPrefabSettings()`. This is what sample games use today.

2. **Data-driven (runtime):** `ISerializedGameObject` + `GameObject.deserialize()` + `SerializedGameObjectNode`. This path already works — you can fully describe a game object as JSON and reconstruct it.

The editor's object layer should use **model #2 entirely**. A prefab is an `ISerializedGameObject` template. An instance is a reference to that template placed at a position in the scene.

---

## Data Model

### Prefab Definition

```typescript
interface IEditorPrefab {
  id: string; // Unique prefab ID (UUID)
  name: string; // Human-readable name ("Tree", "Rock", "Enemy")
  category: string; // For library grouping ("Environment", "Characters")
  thumbnail?: string; // Data URL for preview (auto-generated from renderer or user-supplied)
  template: ISerializedGameObject; // The component blueprint
}
```

The `template` uses the engine's existing `ISerializedGameObject` shape:

```typescript
{
  id: "prefab-tree",
  name: "Tree",
  tag: "environment",
  layer: 0,
  enabled: true,
  components: [
    { typeName: "Transform", data: { position: {x:0,y:0}, rotation: 0, scale: {x:1,y:1} } },
    { typeName: "ImageRenderer", data: { imagePath: "assets/tree.png", renderWidth: 32, renderHeight: 64 } },
    { typeName: "RectangleCollider", data: { width: 24, height: 16, offset: {x:0,y:24} } }
  ],
  children: []
}
```

### Prefab Instance (placed on map)

```typescript
interface IEditorPrefabInstance {
  id: string; // Unique instance ID (UUID)
  prefabId: string; // Reference to the prefab template
  name: string; // Instance name (defaults to "Tree", "Tree (1)", etc.)

  // Transform overrides (always per-instance)
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;

  // Component overrides — sparse map of only the fields that differ from prefab
  componentOverrides: IComponentOverride[];

  // Metadata
  parentInstanceId: string | null; // For hierarchy nesting
  zIndex: number;
  enabled: boolean;
}

interface IComponentOverride {
  typeName: string;
  fieldPath: string; // Dot-notation path: "width", "physicalMaterial.bounciness"
  value: unknown; // The overridden value
}
```

**Why overrides instead of full copies?**

- Change a prefab's collider size → all instances update automatically (unless they have an override)
- You can "revert" an instance override to re-inherit from the prefab
- This is the Unity prefab model and is intuitive for game developers

### Updated Object Layer

```typescript
interface IEditorObjectLayer {
  type: 'object';
  name: string;
  visible: boolean;
  opacity: number;
  instances: IEditorPrefabInstance[]; // Replaces current `objects: IEditorObject[]`
}
```

### Project-Level Storage

Prefabs live at the **project level** (not per-map), so they're reusable across maps:

```
my-game/
├── entropy.json                    # Project config
├── maps/
│   └── Level1.entropy-map          # Contains instances (references prefabIds)
├── prefabs/
│   ├── Tree.entropy-prefab.json    # Individual prefab files (JSON)
│   └── Rock.entropy-prefab.json
├── tilesets/
└── sprites/
```

Each `.entropy-prefab.json` file is a JSON `IEditorPrefab`. The project scanner discovers them like it does tilesets and object sprites today.

The map file stores `IEditorPrefabInstance[]` in its object layers — lightweight references that just say "put prefab X at position Y with these overrides."

---

## Component Schema System

To build a property inspector that can edit component fields, the editor needs to know **what fields each component has and their types**. The engine's current `serialize()` returns `Record<string, unknown>` — untyped.

### Approach: Component Field Descriptors

Add a static schema to each serializable component:

```typescript
interface IComponentFieldDescriptor {
  name: string; // "width", "color", "isTrigger"
  displayName: string; // "Width", "Color", "Is Trigger"
  type: 'number' | 'string' | 'boolean' | 'vector2' | 'color' | 'enum' | 'asset';
  defaultValue: unknown;
  group?: string; // For grouping in UI: "Physics", "Rendering"
  min?: number;
  max?: number;
  step?: number;
  enumValues?: string[]; // For type='enum'
  description?: string;
}

interface IComponentSchema {
  typeName: string;
  displayName: string;
  fields: IComponentFieldDescriptor[];
  category: string; // "Rendering", "Physics", "Audio", etc.
}
```

For the initial implementation, these schemas can be **defined in the editor** (not in the engine itself) as a registry mapping `typeName` → `IComponentSchema`. This keeps the engine untouched:

```typescript
// In the editor
const COMPONENT_SCHEMAS: Map<string, IComponentSchema> = new Map([
  [
    'RectangleRenderer',
    {
      typeName: 'RectangleRenderer',
      displayName: 'Rectangle Renderer',
      category: 'Rendering',
      fields: [
        { name: 'renderWidth', displayName: 'Width', type: 'number', defaultValue: 32, min: 1 },
        { name: 'renderHeight', displayName: 'Height', type: 'number', defaultValue: 32, min: 1 },
        { name: 'color', displayName: 'Fill Color', type: 'color', defaultValue: '#808080' },
        { name: 'borderColor', displayName: 'Border Color', type: 'color', defaultValue: null }
      ]
    }
  ],
  [
    'RectangleCollider',
    {
      typeName: 'RectangleCollider',
      displayName: 'Rectangle Collider',
      category: 'Physics',
      fields: [
        { name: 'width', displayName: 'Width', type: 'number', defaultValue: 32, min: 0 },
        { name: 'height', displayName: 'Height', type: 'number', defaultValue: 32, min: 0 },
        { name: 'offset', displayName: 'Offset', type: 'vector2', defaultValue: { x: 0, y: 0 } },
        { name: 'isTrigger', displayName: 'Is Trigger', type: 'boolean', defaultValue: false }
      ]
    }
  ]
  // ... etc for all builtins
]);
```

Later, this could move into the engine as static metadata on each Component class, but starting in the editor avoids engine API changes.

---

## UI Design

### Panel Layout Changes

```
┌──────────────────────────────────────────────────────────┐
│ Toolbar                                                  │
├────────────┬───────────────────────────┬─────────────────┤
│            │                           │                 │
│ Prefab     │                           │  Inspector      │
│ Library    │        Canvas             │  (Properties)   │
│            │                           │                 │
├────────────┤                           │                 │
│            │                           │                 │
│ Hierarchy  │                           │                 │
│            │                           │                 │
├────────────┤                           ├─────────────────┤
│ Layers     │                           │                 │
└────────────┴───────────────────────────┴─────────────────┘
```

### 1. Prefab Library Panel (replaces current ObjectLibrary)

- Shows all prefabs discovered in the project, grouped by category
- Each prefab shows a thumbnail + name
- "New Prefab" button opens the Prefab Editor dialog
- Drag from this panel onto the canvas to instantiate
- Right-click → Edit Prefab, Duplicate, Delete

### 2. Prefab Editor (modal dialog or dedicated view)

This is where you **compose** a prefab:

```
┌─────────────────────────────────────────────────┐
│ Prefab Editor: "Tree"                      [×]  │
├─────────────────────────┬───────────────────────┤
│ Components              │ Component Inspector   │
│                         │                       │
│ ▸ Transform             │ ── Rectangle Collider │
│ ▸ ImageRenderer         │ Width:    [24    ]     │
│ ▸ RectangleCollider  ←  │ Height:   [16    ]     │
│                         │ Offset X: [0     ]     │
│                         │ Offset Y: [24    ]     │
│ [+ Add Component ▾]     │ Is Trigger: [ ]        │
│                         │                       │
├─────────────────────────┤                       │
│ Prefab Settings         │                       │
│ Name: [Tree           ] │                       │
│ Tag:  [environment    ] │                       │
│ Layer: [Default      ▾] │                       │
│ Category: [Environ.  ▾] │                       │
└─────────────────────────┴───────────────────────┘
```

- Left side: list of attached components with add/remove
- Right side: field editor for the selected component, driven by `IComponentSchema`
- Bottom: prefab-level settings (name, tag, layer, category)
- "Add Component" dropdown shows all registered components from the schema registry

### 3. Object Hierarchy Panel (new, replaces nothing)

A tree view showing every instance in the scene:

```
Scene
├── Object Layer 1
│   ├── 🌲 Tree
│   ├── 🌲 Tree (1)
│   ├── 🪨 Rock
│   └── 🧑 Player
│       └── ⚔️ Weapon          ← child instance
└── Object Layer 2
    └── 🌲 Background Tree
```

- Click to select (highlights on canvas + shows in inspector)
- Drag to reparent (set `parentInstanceId`)
- Right-click → Rename, Delete, Duplicate, Focus Camera
- Icons/thumbnails from prefab
- Eye icon to toggle visibility per instance (sets `enabled`)
- The hierarchy and the layer panel coexist — layers are organizational, hierarchy shows the logical scene tree

### 4. Inspector Panel (enhanced PropertiesPanel)

Context-sensitive — shows different content based on selection:

| Selection          | Inspector Shows                                                                       |
| ------------------ | ------------------------------------------------------------------------------------- |
| Nothing            | Map properties (current behavior)                                                     |
| Instance on canvas | Instance transform (x, y, rotation, scale) + component overrides + "Open Prefab" link |
| Prefab in library  | Prefab summary + "Edit Prefab" button                                                 |
| Layer              | Layer settings (name, opacity, visibility)                                            |

For instance inspection, component fields show the **resolved value** (prefab default merged with instance overrides). Overridden fields are visually marked (bold/colored) with a "revert to prefab" action.

---

## Scene Export / Runtime Integration

When the game loads a map, it needs to resolve prefab references into actual `ISerializedGameObject` data. Two approaches:

### Scene Loading: Bake at Export Time

The editor's "export to engine format" step resolves all prefab instances into full `ISerializedGameObject` entries — merging the prefab template with instance overrides and setting the position.

```
Export flow:
  For each object layer:
    For each instance:
      1. Look up prefab template by prefabId
      2. Deep-clone the template's ISerializedGameObject
      3. Apply instance overrides (position, rotation, scale, component field overrides)
      4. Add to the scene's gameObjects array

  Output: ISerializedScene (existing engine format)
```

The engine already supports `ISerializedScene` with `GameObject.deserialize()`, so baked scenes "just work."

### Runtime Prefab Instantiation (P0)

Games must be able to spawn prefabs from scripts at runtime (e.g., spawning projectiles, enemies, pickups). This requires the engine to have a `PrefabRegistry` that loads prefab templates and instantiates them on demand.

**New engine API — `PrefabRegistry`:**

```typescript
export class PrefabRegistry {
  private readonly prefabs = new Map<string, ISerializedGameObject>();

  /** Register a prefab template by name. Called during scene/game setup. */
  public register(name: string, template: ISerializedGameObject): void {
    this.prefabs.set(name, template);
  }

  /** Load all prefabs from a prefab manifest (JSON array of ISerializedGameObject). */
  public loadFromManifest(manifest: ISerializedGameObject[]): void {
    for (const template of manifest) {
      this.prefabs.set(template.name, template);
    }
  }

  /** Get the raw template for a prefab. Returns undefined if not registered. */
  public get(name: string): ISerializedGameObject | undefined {
    return this.prefabs.get(name);
  }

  public has(name: string): boolean {
    return this.prefabs.has(name);
  }

  public getRegisteredNames(): string[] {
    return Array.from(this.prefabs.keys());
  }
}
```

**New `GameEngine` / `GameObject` API — `instantiatePrefab()`:**

```typescript
// On GameEngine (and forwarded through GameObject/Component):
public instantiatePrefab(
  prefabName: string,
  position?: Vector2,
  rotation?: number,
  parent?: Transform
): GameObject {
  const template = this.prefabRegistry.get(prefabName);
  if (template === undefined) {
    throw new Error(`Prefab "${prefabName}" is not registered.`);
  }

  // Deep-clone the template so each instance is independent
  const instanceData: ISerializedGameObject = structuredClone(template);
  instanceData.id = generateUUID(); // Each instance gets a unique ID

  // Apply position/rotation overrides
  const transformData = instanceData.components.find(c => c.typeName === 'Transform');
  if (transformData !== undefined && position !== undefined) {
    (transformData.data as Record<string, unknown>).position = { x: position.x, y: position.y };
  }
  if (transformData !== undefined && rotation !== undefined) {
    (transformData.data as Record<string, unknown>).rotation = rotation;
  }

  // Deserialize into a live GameObject
  const gameObject = GameObject.deserialize(instanceData, this);

  if (parent !== undefined) {
    gameObject.transform.parent = parent;
  }

  // Register and start
  this.gameObjectRegistry.registerGameObject(gameObject);

  return gameObject;
}
```

**Usage from game scripts:**

```typescript
// In a component — spawning a projectile prefab
export class Weapon extends Component {
  public fire(): void {
    const bullet = this.instantiatePrefab('Fireball', this.transform.position, this.transform.rotation);
    // bullet is a live GameObject with all the components defined in the prefab
  }
}

// In a spawner — spawning enemies
export class Spawner extends Component {
  public override update(): void {
    if (this.shouldSpawn()) {
      this.instantiatePrefab('Minotaur', this.spawnPoint);
    }
  }
}
```

**How prefabs get loaded at runtime:**

The editor exports a `prefabs.json` manifest alongside the scene. The game loads it during scene setup:

```typescript
// In a scene definition
const scene: IScene = {
  name: 'Level1',
  async getAssetPool(): Promise<AssetPool> {
    // Load prefab manifest (exported by editor)
    const prefabManifest = await fetch('/assets/prefabs.json').then(r => r.json());
    gameEngine.prefabRegistry.loadFromManifest(prefabManifest);
    // ... load other assets
  },
  getStartingGameObjects(gameEngine: GameEngine): GameObject[] {
    // Scene objects are still baked, but prefabs are available for runtime spawning
    return [...bakedSceneObjects];
  }
};
```

**Forwarding through Component/GameObject:**

Like the existing `instantiate()`, `instantiatePrefab()` is forwarded through the chain:

```
GameEngine.instantiatePrefab()
  ↑ GameObject.instantiatePrefab() — delegates to gameEngine
    ↑ Component.instantiatePrefab() — delegates to gameObject
```

This keeps the existing pattern where components can call `this.instantiatePrefab(...)` directly.

**Relationship to existing `instantiate()`:**

The existing class-based `instantiate<T>(type, position, rotation, parent)` continues to work for class-defined game objects. `instantiatePrefab(name, position, rotation, parent)` is the data-driven counterpart. Both coexist — games can use either or both.

### Type-Safe Prefab Names (Declaration Merging)

The engine declares `PrefabName` as a permissive default:

```typescript
// In the engine (e.g., core/types.ts)
export type PrefabName = string & {};
```

The editor auto-generates a declaration file that narrows the type via module augmentation:

```typescript
// Auto-generated by Entropy Editor — do not edit manually
// File: src/generated/prefabs.d.ts (or similar, in the game project)

declare module '@entropy-engine/entropy-game-engine' {
  export type PrefabName = 'Tree' | 'Rock' | 'Fireball' | 'Minotaur';
}
```

The engine's `instantiatePrefab` signature uses `PrefabName`:

```typescript
// GameEngine
public instantiatePrefab(
  prefabName: PrefabName,
  position?: Vector2,
  rotation?: number,
  parent?: Transform
): GameObject

// Component (forwarded)
protected instantiatePrefab(
  prefabName: PrefabName,
  position?: Vector2,
  rotation?: number,
  parent?: Transform
): GameObject
```

**What this gives you:**

- Without the generated file: `PrefabName` is `string & {}` — anything works, no compile errors, no autocomplete. Good for prototyping or manual setups.
- With the generated file: `PrefabName` narrows to the union — typos are compile errors, IDE autocomplete lists all available prefabs.
- Re-export the editor → the `.d.ts` file is regenerated with the updated union. No manual bookkeeping.

**Editor export step:**

When the editor exports a project, it writes two files:

1. `prefabs.json` — the runtime manifest (array of `ISerializedGameObject`)
2. `prefabs.d.ts` — the type declaration (auto-generated union)

```
my-game/
├── src/
│   └── generated/
│       ├── prefabs.json        ← runtime data
│       └── prefabs.d.ts        ← type narrowing
├── prefabs/
│   ├── Tree.entropy-prefab.json
│   └── Rock.entropy-prefab.json
└── tsconfig.json               ← includes src/generated/
```

---

## Migration Strategy

No existing maps use object layers — only terrain work has been done. The current `IEditorObject` / `IObjectSprite` sprite-based system can be **replaced entirely** by the prefab instance model. No backwards compatibility is needed.

- Remove `IEditorObject`, `IObjectSprite`, and related store actions (`placeObject`, `importObjectSprites`, etc.)
- Replace `IEditorObjectLayer.objects` with `IEditorObjectLayer.instances: IEditorPrefabInstance[]`
- Replace the `ObjectLibrary` panel with the new `PrefabLibrary` panel

---

## Implementation Phases

### Phase 1: Data Foundation

- Define `IEditorPrefab`, `IEditorPrefabInstance`, `IComponentOverride` types
- Define `IComponentSchema` and create schemas for all 15 builtin components
- Add `.entropy-prefab.json` file I/O (IPC handlers for read/write/discover)
- Update project scanner to discover prefabs
- **Engine: Add `PrefabName` type (`string & {}` default) to `core/types.ts`**
- **Engine: Add `PrefabRegistry` class with `register()`, `get()`, `loadFromManifest()`**
- **Engine: Add `instantiatePrefab(name: PrefabName, ...)` to `GameEngine`, `GameObject`, and `Component`**
- **Editor: Auto-generate `prefabs.d.ts` (declaration merging) + `prefabs.json` (runtime manifest) on export**

### Phase 2: Prefab Editor

- Build the Prefab Editor dialog (component list + field inspector)
- "Add Component" dropdown driven by schema registry
- Component field editors: NumberField, TextField, Switch, Vector2 pair, Color picker, Enum select
- Save/load prefab files

### Phase 3: Prefab Library + Drag-and-Drop

- Replace/enhance ObjectLibrary panel with PrefabLibrary
- Implement drag-and-drop from library to canvas
- Generate instance with unique ID, auto-increment name
- Canvas rendering of prefab instances (use thumbnail or render based on components)

### Phase 4: Object Hierarchy

- Build the Hierarchy tree panel
- Selection sync between hierarchy ↔ canvas
- Reparenting via drag
- Context menu actions (delete, duplicate, rename)

### Phase 5: Instance Inspector

- Context-sensitive inspector panel
- Show resolved component values (prefab + overrides)
- Inline editing of instance overrides
- Visual indicators for overridden vs inherited fields
- "Revert to prefab" per field

### Phase 6: Scene Export + Runtime Prefab Loading

- Build the prefab→ISerializedScene bake pipeline (for scene objects)
- Export `prefabs.json` manifest alongside the scene (for runtime spawning)
- Integrate into existing export flow
- Test roundtrip: editor → export → engine load → game runs
- Test runtime: script calls `instantiatePrefab('Tree', position)` → spawns correctly

---

## Resolved Design Decisions

1. **Prefab editor UI:** Modal dialog for v1. Visual prefab editing mode (with canvas preview) is a future enhancement.

2. **Canvas rendering of instances:** Instances render their actual component data — renderers draw their shapes/images, and widgets like collider bounds are drawn as overlays. No placeholder thumbnails.

3. **Custom (user-defined) components:** Required. Users write components in their code editor and those components appear in the game editor for attachment to game objects. The editor discovers user components by **auto-inferring fields from `serialize()` output** — importing/running the user's component code to extract the serialized shape. This requires the editor to load the user's TypeScript project (e.g., via a build step or dynamic import of compiled output).

4. **Nested prefabs:** Yes. A prefab can contain child instances of other prefabs (e.g., "Village" containing "House" instances).

5. **Undo/redo scope:** Prefab editing gets its own undo stack, separate from the map undo stack.
