import { Component } from '../components/Component';
import { GameObject } from '../game-objects/GameObject';

type ComponentConstructor = new (gameObject: GameObject, ...args: any[]) => Component;

export class ComponentRegistry {
  private static readonly registry = new Map<string, ComponentConstructor>();

  public static register(name: string, constructor: ComponentConstructor): void {
    this.registry.set(name, constructor);
  }

  public static get(name: string): ComponentConstructor | undefined {
    return this.registry.get(name);
  }

  public static has(name: string): boolean {
    return this.registry.has(name);
  }

  public static getAll(): ReadonlyMap<string, ComponentConstructor> {
    return this.registry;
  }

  public static getRegisteredNames(): string[] {
    return Array.from(this.registry.keys());
  }
}
