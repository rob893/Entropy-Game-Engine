import type { ISerializedGameObject } from './types';

export class PrefabRegistry {
  private readonly prefabs = new Map<string, ISerializedGameObject>();

  public register(name: string, template: ISerializedGameObject): void {
    this.prefabs.set(name, template);
  }

  public loadFromManifest(manifest: ISerializedGameObject[]): void {
    for (const template of manifest) {
      this.prefabs.set(template.name, template);
    }
  }

  public get(name: string): ISerializedGameObject | undefined {
    return this.prefabs.get(name);
  }

  public has(name: string): boolean {
    return this.prefabs.has(name);
  }

  public getRegisteredNames(): string[] {
    return Array.from(this.prefabs.keys());
  }

  public clear(): void {
    this.prefabs.clear();
  }
}
