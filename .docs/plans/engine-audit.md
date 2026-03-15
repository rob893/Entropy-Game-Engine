# Entropy Game Engine — Comprehensive Audit Report

## Executive Summary

This audit examined the entire engine codebase across 6 subsystems: game loop/time, physics, rendering, GameObject/component system, scene/terrain management, and editor readiness. The engine has a solid architectural foundation inspired by Unity's GameObject + Component pattern, but suffers from **critical bugs in physics and timing**, **missing serialization infrastructure**, and **several design gaps** that will need to be addressed before building a visual editor.

**Overall Editor Readiness: ~30%** — The component architecture is sound, but the engine lacks serialization, a real camera system, fixed-timestep physics, and data-driven scene formats.

---

## 1. Time & Game Loop

### Critical Bugs

**BUG: Delta Time Applied Inconsistently in Physics**
- `PhysicsEngine.ts:39` multiplies gravity by `deltaTime`, but `Rigidbody.ts:77` translates by raw velocity without `deltaTime`
- Result: physics is frame-rate dependent — objects move faster at higher FPS
- Fix: velocity integration must multiply by deltaTime: `transform.translate(velocity * deltaTime)`

**BUG: FPS Limiter Uses Mismatched Timing Sources**
- `GameEngine.ts:608-618` throttles frames using `performance.now()` but passes RAF's `timeStamp` to `update()`
- These timestamps drift apart, making deltaTime unreliable when frames are throttled

**BUG: Pause Doesn't Reset Time**
- When unpaused after a long pause, deltaTime includes all paused time
- Causes physics explosion (objects teleport) on unpause
- Fix: reset `prevTime` when unpausing, or track pause state in `Time`

**BUG: No Maximum Delta Time Clamp**
- Tab-out pauses RAF; on tab-in, first frame has enormous deltaTime
- No `Math.min(deltaTime, 0.1)` safeguard — physics spirals into instability

### Design Issues

**No Fixed Timestep for Physics** — Physics uses variable deltaTime tied to frame rate. Needs an accumulator pattern:
```
accumulator += deltaTime;
while (accumulator >= FIXED_DT) { physicsStep(FIXED_DT); accumulator -= FIXED_DT; }
```

**No Lifecycle Phases** — Only a single `update()`. Missing `fixedUpdate()` (physics-rate), `lateUpdate()` (camera follow), pre/post-physics hooks.

**Update Order Issues** — Time updates mid-frame (after deletions), physics runs before scripts, no clear phase separation.

**`invoke()`/`invokeRepeating()` Use `setTimeout`** — Runs on real time, not game time. Won't respect pause or time scale.

### Editor Blockers
- No `timeScale` property for slow motion / fast forward
- No `stepFrame()` method for frame-by-frame debugging
- Cannot start/stop/step physics independently

---

## 2. Physics Engine

### Critical Bugs

**BUG: Shared `Vector2.zero` Instance (CRITICAL)**
- `Rigidbody.ts:8`: `velocity = Vector2.zero` — if `Vector2.zero` returns a shared instance, ALL rigidbodies share the same velocity vector
- Fix: initialize with `new Vector2(0, 0)` in constructor

**BUG: Impulses Applied as Forces (Double Mass Scaling)**
- `ImpulseCollisionResolver.ts:63-69` passes impulses to `addForce()`, which divides by mass again
- Collision response is far too weak
- Fix: apply impulses directly to velocity

**BUG: Gravity Treats Force Wrong**
- `PhysicsEngine.ts:39`: gravity (665) is divided by mass, making heavy objects fall slower
- Gravity should be an acceleration (independent of mass), or multiplied by mass when treated as force

**BUG: Raycast Returns Farthest, Not Closest**
- `Physics.ts:32`: comparison uses `>` instead of `<`

**BUG: Incorrect Friction Formula**
- `ImpulseCollisionResolver.ts:49`: uses `μA² + μB²` instead of geometric mean `√(μA × μB)`

**BUG: Division by Zero with Infinite Mass**
- `ImpulseCollisionResolver.ts:35,47`: no guard when both objects have `inverseMass = 0`

**BUG: Collision Normal Zero for Overlapping Centers**
- `BaseCollisionDetector.ts:49`: normalized vector becomes `(0,0)` when colliders share center

### Design Issues
- No continuous collision detection (fast objects tunnel through walls)
- No collision resolution ordering (stacked objects jitter)
- No sleeping system (all rigidbodies update every frame)
- Duplicate collision events in spatial hash when objects span cells
- `getPossibleColliders()` returns empty array (incomplete)
- Penetration correction uses hardcoded magic numbers
- "Kinematic" misspelled as "kinomatic" throughout

---

## 3. Rendering Engine

### Critical Bugs

**BUG: Broken GUI Z-Index Sorting**
- `RenderingEngine.ts:75`: `sort(element => element.zIndex)` is wrong — `Array.sort()` needs a comparator `(a, b) => a.zIndex - b.zIndex`
- GUI elements render in arbitrary order

**BUG: Canvas Not Cleared Before Rendering**
- No `clearRect()` call — relies on background existing to cover previous frame
- Artifacts accumulate if no background is set

**BUG: Transform Leak Between Objects**
- `ImageRenderer` and `Animator` manually apply/reverse transforms instead of `context.save()`/`context.restore()`
- If an exception occurs mid-render, transforms leak to all subsequent objects

**BUG: Animation Updates During Render**
- `Animator.ts:49`: `animation.updateAnimation()` called in `render()`, not `update()`
- Animation speed varies with render performance

**BUG: Animation Completion Event Fires Every Frame**
- `Animation.ts:49-51`: once complete, publishes event every frame forever (no once-guard)

### Design Issues

**Camera Is an Empty Stub** — `Camera extends Component {}` — no viewport transform, zoom, follow, or pan. Critical gap for both gameplay and editor viewport.

**No World Object Z-Ordering** — World objects render in insertion order. No z-index or layer sorting.

**No Viewport Culling** — All objects render every frame, even off-screen.

**Terrain Is Special-Cased** — Stored separately from regular renderables, not treated uniformly.

### Editor Blockers
- No render-time vs game-time separation (can't render while paused for editing)
- Gizmo system is boolean only (no per-object or per-type control)
- No editor overlay render layer (selection boxes, handles)
- Private renderable arrays with no public getters for inspection
- No render statistics (draw calls, object counts)
- No asset ID system (renderers take raw `HTMLImageElement`)

---

## 4. GameObject & Component System

### Critical Bugs

**BUG: `removeComponent()` Deletes ALL Components of That Type**
- `GameObject.ts:297-305`: calls `componentMap.delete(name)`, removing the entire array of components with that type name, not just the one instance

**BUG: `getComponentInParent()` Type Error**
- `GameObject.ts:194-227`: calls `parent.hasComponent()` on a `Transform` object instead of `parent.gameObject.hasComponent()`

**BUG: Transform Parent Ignores Rotation/Scale**
- `Transform.ts:44-63`: parent-child position only uses offset addition, ignoring parent rotation and scale entirely

**BUG: Destroy Doesn't Remove from `tagMap`**
- `GameEngine.ts:360-371`: destroyed objects remain in `tagMap`, causing `findGameObjectsWithTag()` to return dead objects

**BUG: `ComponentAnalyzer` Not Called on Remove**
- `removeComponent()` calls `onDestroy()` but doesn't unregister from physics/rendering engines — phantom colliders and ghost renders persist

**BUG: Component `start()` Called Immediately on Add**
- `GameObject.ts:292`: `addComponent()` calls `start()` immediately, even mid-frame during another component's update — can cause iteration bugs

### Design Issues

**Weak Prefab System** — "Prefabs" are just default values via `getPrefabSettings()`. Not reusable templates, no inheritance, no overrides, no nested prefabs.

**String-Based Component Lookup (Minification Unsafe)** — Uses `constructor.name` for component registry. Minifiers rename classes, breaking lookup in production builds.

**No Component Removal Validation** — Can remove `Transform` and break the entire GameObject.

**Confusing Auto-Remove in `update()`** — Base `Component.update()` removes itself from the update loop. Calling `super.update()` accidentally removes the component from updates.

**Unstable IDs** — Mutable public IDs with auto-cloning names ("enemy", "enemy Clone(1)"). No UUID system.

### Editor Blockers
- **ZERO serialization infrastructure** — No `toJSON()`/`fromJSON()`, circular references prevent `JSON.stringify()`, components require constructor instances. This is the #1 editor blocker.
- No component type registry (can't convert type name strings back to constructors)
- No component metadata/decorators for auto-generating property inspectors
- Scenes are code-only (TypeScript functions, not data files)

---

## 5. Scenes, Input & Terrain

### Current State

**Scenes** are TypeScript interfaces with factory methods — `getStartingGameObjects(engine)` returns manually constructed objects. No declarative format exists.

**Terrain** is built from 2D number arrays (e.g., `Scene1TerrainSpec.ts` — hundreds of lines of handcoded tile indices). `TerrainBuilder` converts these arrays into tile GameObjects. This is the biggest pain point for content creation.

**Input** system is well-designed with key/mouse listeners, composable via `addKeyListener()`. Already editor-ready.

**NavGrid** auto-generates from terrain data — a positive.

**Asset Pipeline** is entirely imperative (webpack/Vite `import` statements). No asset manifest, registry, or lazy loading system.

### Editor Blockers
- No data-driven scene format (JSON/YAML)
- Terrain spec is hardcoded arrays — visual tile editor would have highest ROI
- No asset manifest for editor asset browser
- Scene construction is constructor-based, preventing editor serialization

---

## 6. Editor Readiness Assessment

### What Works Well
- Clean GameObject + Component architecture (good foundation)
- Pause system exists (objects remain visible)
- Terrain data IS structured (2D arrays) — could be serialized
- Input system is composable and extensible
- NavGrid auto-generates from terrain

### What's Missing (Prioritized)

| Priority | Feature | Why It Matters |
|----------|---------|----------------|
| **P0** | Serialization system | Can't save/load anything without it |
| **P0** | Component type registry | Editor needs to list available components |
| **P0** | Data-driven scene format | Scenes must be JSON, not TypeScript code |
| **P1** | Fixed timestep physics | Physics breaks at variable frame rates |
| **P1** | Camera system | Editor viewport needs pan/zoom/follow |
| **P1** | Stable entity IDs (UUIDs) | Object references must survive save/load |
| **P2** | Component metadata/decorators | Auto-generate property inspectors |
| **P2** | Asset manifest/registry | Editor asset browser and drag-drop |
| **P2** | Undo/redo infrastructure | State snapshots for edit operations |
| **P3** | Runtime component add/remove (fixed) | Inspector panel needs reliable CRUD |
| **P3** | Edit mode vs play mode | Render scene without simulating |
| **P3** | Gizmo system (per-object) | Selection handles, bounding boxes |

### Recommended Development Phases

**Phase 1 (Foundation):** Fix critical bugs — shared Vector2, delta time, physics integration, GUI sorting, canvas clearing. Implement fixed timestep. Add delta time clamp. ~2-4 weeks.

**Phase 2 (Serialization):** Build serialization layer — component registry, `toJSON()`/`fromJSON()` on all objects, UUID-based entity IDs, data-driven scene format (JSON). Implement Camera system. ~4-6 weeks.

**Phase 3 (Terrain Editor MVP):** Visual tile map editor — load/save terrain specs as JSON, tile palette, paint tools, preview in engine canvas. This has the highest user-value ROI since terrain authoring is the biggest pain point. ~4-6 weeks.

**Phase 4 (Full Editor):** Object placement, component inspector panels, play/pause/step controls, asset browser, undo/redo. Electron shell. ~8-12 weeks.

---

## Bug Count Summary

| Subsystem | Critical Bugs | Design Issues | Editor Blockers |
|-----------|:---:|:---:|:---:|
| Time & Game Loop | 4 | 4 | 3 |
| Physics | 7 | 7+ | 8 |
| Rendering | 5 | 4+ | 6 |
| GameObject/Component | 6 | 5+ | 4 |
| Scenes/Terrain | 0 | 3 | 3 |
| **Total** | **22** | **23+** | **24** |
