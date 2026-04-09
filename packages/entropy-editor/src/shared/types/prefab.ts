// ── Discovered Game Object Class ──

export interface IDiscoveredGameObject {
  readonly className: string;
  readonly filePath: string;
  readonly category: string;
}

// ── Prefab Instance (placed on map) ──

export interface IEditorPrefabInstance {
  readonly id: string;
  readonly gameObjectClass: string;
  readonly name: string;
  readonly tag: string;
  readonly layer: number;
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
  readonly scaleX: number;
  readonly scaleY: number;
  readonly properties: Record<string, unknown>;
  readonly parentInstanceId: string | null;
  readonly zIndex: number;
  readonly enabled: boolean;
}

// ── User Component Discovery ──

export interface IDiscoveredUserComponent {
  readonly typeName: string;
  readonly displayName: string;
  readonly filePath: string;
}
