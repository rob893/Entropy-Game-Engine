import type { ISerializedComponent, ISerializedGameObject } from '@entropy-engine/entropy-game-engine';
import type { IComponentOverride, IEditorPrefab, IEditorPrefabInstance } from '../../shared/types';

const UNSAFE_SEGMENTS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * Bakes a prefab instance into a full ISerializedGameObject by merging
 * the prefab template with instance-specific overrides.
 */
export function bakeInstance(
  instance: IEditorPrefabInstance,
  prefab: IEditorPrefab
): ISerializedGameObject {
  const baked: ISerializedGameObject = structuredClone(prefab.template);

  // Assign unique IDs to all children to avoid duplicates across instances
  regenerateChildIds(baked.children);

  baked.id = instance.id;
  baked.name = instance.name;
  baked.enabled = instance.enabled;

  const transformComp = baked.components.find(c => c.typeName === 'Transform');

  if (transformComp !== undefined) {
    transformComp.data.position = { x: instance.x, y: instance.y };
    transformComp.data.rotation = instance.rotation;
    transformComp.data.scale = { x: instance.scaleX, y: instance.scaleY };
  }

  applyComponentOverrides(baked.components, instance.componentOverrides);

  return baked;
}

/**
 * Recursively regenerate IDs for all children in a cloned game object tree
 * to prevent duplicate IDs when the same prefab is instanced multiple times.
 */
function regenerateChildIds(children: ISerializedGameObject[]): void {
  for (const child of children) {
    child.id = crypto.randomUUID();
    regenerateChildIds(child.children);
  }
}

/**
 * Apply component field overrides to serialized components.
 * Supports dot-notation field paths (e.g., "physicalMaterial.bounciness").
 */
function applyComponentOverrides(
  components: ISerializedComponent[],
  overrides: IComponentOverride[]
): void {
  for (const override of overrides) {
    const component = components.find(c => c.typeName === override.typeName);

    if (component === undefined) {
      continue;
    }

    setNestedValue(component.data, override.fieldPath, override.value);
  }
}

/**
 * Set a value at a dot-notation path in an object.
 * e.g., setNestedValue(obj, "a.b.c", 42) sets obj.a.b.c = 42
 *
 * Rejects paths containing prototype-polluting segments.
 */
export function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split('.');

  for (const part of parts) {
    if (UNSAFE_SEGMENTS.has(part)) {
      return;
    }
  }

  let current: Record<string, unknown> = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];

    if (current[part] === undefined || typeof current[part] !== 'object' || current[part] === null) {
      current[part] = {};
    }

    current = current[part] as Record<string, unknown>;
  }

  const lastPart = parts[parts.length - 1];
  current[lastPart] = value;
}

/**
 * Bake all instances from all object layers into an array of ISerializedGameObject.
 * Preserves layer ordering; within each layer, instances are sorted by zIndex.
 */
export function bakeAllInstances(
  mapFile: { layers: ReadonlyArray<{ type: string; instances?: IEditorPrefabInstance[] }> },
  prefabs: IEditorPrefab[]
): ISerializedGameObject[] {
  const prefabMap = new Map(prefabs.map(p => [p.id, p]));
  const bakedObjects: ISerializedGameObject[] = [];

  for (const layer of mapFile.layers) {
    if (layer.type !== 'object' || layer.instances === undefined) {
      continue;
    }

    const sortedInstances = [...layer.instances].sort((a, b) => a.zIndex - b.zIndex);

    for (const instance of sortedInstances) {
      const prefab = prefabMap.get(instance.prefabId);

      if (prefab === undefined) {
        console.warn(`Prefab not found for instance "${instance.name}" (prefabId: ${instance.prefabId})`);
        continue;
      }

      bakedObjects.push(bakeInstance(instance, prefab));
    }
  }

  return bakedObjects;
}
