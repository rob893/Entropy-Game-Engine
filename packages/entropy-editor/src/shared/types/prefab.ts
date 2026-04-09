import type { ISerializedGameObject } from '@entropy-engine/entropy-game-engine';

// ── Prefab Definition ──

export interface IEditorPrefab {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly thumbnail?: string;
  readonly template: ISerializedGameObject;
}

// ── Prefab Instance (placed on map) ──

export interface IEditorPrefabInstance {
  readonly id: string;
  readonly prefabId: string;
  readonly name: string;
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
  readonly scaleX: number;
  readonly scaleY: number;
  readonly componentOverrides: IComponentOverride[];
  readonly parentInstanceId: string | null;
  readonly zIndex: number;
  readonly enabled: boolean;
}

export interface IComponentOverride {
  readonly typeName: string;
  readonly fieldPath: string;
  readonly value: unknown;
}

// ── Component Schema ──

export type ComponentFieldType = 'number' | 'string' | 'boolean' | 'vector2' | 'color' | 'enum' | 'asset';

export interface IComponentFieldDescriptor {
  readonly name: string;
  readonly displayName: string;
  readonly type: ComponentFieldType;
  readonly defaultValue: unknown;
  readonly group?: string;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly enumValues?: string[];
  readonly description?: string;
}

export interface IComponentSchema {
  readonly typeName: string;
  readonly displayName: string;
  readonly fields: IComponentFieldDescriptor[];
  readonly category: string;
}
