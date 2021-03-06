import { Transform } from '../components/Transform';
import { Component } from '../components/Component';
import { GameEngine } from '../core/GameEngine';
import { Layer } from '../core/enums/Layer';
import { PrefabSettings } from '../core/interfaces/PrefabSettings';
import { ComponentAnalyzer } from '../core/helpers/ComponentAnalyzer';
import { Input } from '../core/helpers/Input';
import { Physics } from '../core/physics/Physics';
import { SceneManager } from '../core/helpers/SceneManager';
import { AssetPool } from '../core/helpers/AssetPool';
import { Time } from '../core/Time';
import { Vector2 } from '../core/helpers/Vector2';
import { Terrain } from './Terrain';
import { GameObjectConstructionParams } from '../core/interfaces/GameObjectConstructionParams';

export abstract class GameObject<TConfig extends GameObjectConstructionParams = GameObjectConstructionParams> {
  public id: string;
  public readonly tag: string;
  public readonly layer: Layer;
  public readonly transform: Transform;

  private isEnabled: boolean;
  private readonly updatableComponents: Component[] = [];
  private readonly componentMap: Map<string, Component[]> = new Map<string, Component[]>();
  private readonly componentAnalyzer: ComponentAnalyzer;
  private readonly gameEngine: GameEngine;

  public constructor(config: TConfig) {
    const { gameEngine, id, x, y, rotation, tag, layer } = config;

    this.gameEngine = gameEngine;
    this.isEnabled = true;
    this.componentAnalyzer = gameEngine.componentAnalyzer;

    const prefabSettings = this.getPrefabSettings();

    this.id = id ? id : prefabSettings.id;
    this.transform = new Transform(this, x ? x : prefabSettings.x, y ? y : prefabSettings.y);
    this.transform.rotation = rotation ? rotation : prefabSettings.rotation;
    this.tag = tag ? tag : prefabSettings.tag;
    this.layer = layer ? layer : prefabSettings.layer;

    const initialComponents = this.buildInitialComponents(config); //move this into prefab settings
    initialComponents.push(this.transform);

    this.setComponents(initialComponents);

    const childGameObjects = this.buildAndReturnChildGameObjects(config);

    for (const child of childGameObjects) {
      child.transform.parent = this.transform;
    }
  }

  public get enabled(): boolean {
    return this.isEnabled;
  }

  public set enabled(enabled: boolean) {
    if (enabled === this.isEnabled) {
      return;
    }

    this.isEnabled = enabled;

    for (const component of this.updatableComponents) {
      if (component.enabled) {
        enabled ? component.onEnabled() : component.onDisable();
      }
    }
  }

  public get input(): Input {
    return this.gameEngine.input;
  }

  public get physics(): Physics {
    return this.gameEngine.physics;
  }

  public get sceneManager(): SceneManager {
    return this.gameEngine.sceneManager;
  }

  public get assetPool(): AssetPool {
    return this.gameEngine.assetPool;
  }

  public get time(): Time {
    return this.gameEngine.time;
  }

  public get gameCanvas(): HTMLCanvasElement {
    return this.gameEngine.gameCanvas;
  }

  public get gameCanvasContext(): CanvasRenderingContext2D {
    return this.gameEngine.canvasContext;
  }

  public get terrain(): Terrain {
    return this.gameEngine.terrain;
  }

  public start(): void {
    this.updatableComponents.forEach(c => c.start());
  }

  public update(): void {
    for (const component of this.updatableComponents) {
      if (component.enabled) {
        component.update();
      }
    }
  }

  public findGameObjectById(id: string): GameObject | null {
    return this.gameEngine.findGameObjectById(id);
  }

  public findGameObjectWithTag(tag: string): GameObject | null {
    return this.gameEngine.findGameObjectWithTag(tag);
  }

  public findGameObjectsWithTag(tag: string): GameObject[] {
    return this.gameEngine.findGameObjectsWithTag(tag);
  }

  public instantiate<T extends GameObject>(
    type: new (constructionParams: GameObjectConstructionParams) => T,
    position?: Vector2,
    rotation?: number,
    parent?: Transform
  ): GameObject {
    return this.gameEngine.instantiate(type, position, rotation, parent);
  }

  public destroy(object: GameObject, time: number = 0): void {
    this.gameEngine.destroy(object, time);
  }

  public invoke(funcToInvoke: () => void, time: number): void {
    this.gameEngine.invoke(funcToInvoke, time);
  }

  public invokeRepeating(funcToInvoke: () => void, repeatRate: number, cancelToken?: { cancel: boolean }): void {
    this.gameEngine.invokeRepeating(funcToInvoke, repeatRate, cancelToken);
  }

  /**
   * Use this function to remove one of a game object's components from the update loop. This is used by empty update functions to reduce
   * the amount of update calls per frame (no point in calling empty update functions).
   *
   * @param component the component to be removed from this game object's update loop. It MUST be one of the game object's components.
   */
  public removeComponentFromUpdate(component: Component): void {
    if (!this.componentMap.has(component.constructor.name)) {
      throw new Error(`This game object does not have a component of type ${component.constructor.name}`);
    }

    if (!this.updatableComponents.includes(component)) {
      throw new Error('This game object does not have the component being removed.');
    }

    this.updatableComponents.splice(this.updatableComponents.indexOf(component), 1);
  }

  public hasComponent<T extends Component>(component: new (...args: any[]) => T): boolean {
    return this.componentMap.has(component.name);
  }

  public getComponent<T extends Component>(component: new (...args: any[]) => T): T | null {
    const componentType = component.name;
    const components = this.componentMap.get(componentType);

    if (components === undefined || components.length === 0) {
      return null;
    }

    return components[0] as T;
  }

  public getComponents<T extends Component>(component: new (...args: any[]) => T): T[] {
    const componentType = component.name;
    const components = this.componentMap.get(componentType);

    if (components === undefined || components.length === 0) {
      return [];
    }

    return [...components] as T[];
  }

  public getComponentInParent<T extends Component>(component: new (...args: any[]) => T): T | null {
    let { parent } = this.transform;

    while (parent !== null) {
      if (parent.hasComponent(component)) {
        return parent.getComponent(component);
      }

      parent = parent.parent;
    }

    return null;
  }

  public getComponentsInParent<T extends Component>(component: new (...args: any[]) => T): T[] {
    let { parent } = this.transform;
    const components: T[] = [];

    while (parent !== null) {
      if (parent.hasComponent(component)) {
        const parentComponent = parent.getComponent(component);

        if (parentComponent === null) {
          throw new Error('Error getting parent component');
        }

        components.push(parentComponent);
      }

      parent = parent.parent;
    }

    return components;
  }

  public getComponentInChildren<T extends Component>(component: new (...args: any[]) => T): T | null {
    const { children } = this.transform;

    while (children.length > 0) {
      const child = children.pop();

      if (child === undefined) {
        throw new Error('Error getting child.');
      }

      if (child.hasComponent(component)) {
        return child.getComponent(component);
      }

      for (const childsChild of child.children) {
        children.push(childsChild);
      }
    }

    return null;
  }

  public getComponentsInChildren<T extends Component>(component: new (...args: any[]) => T): T[] {
    const { children } = this.transform;
    const components: T[] = [];

    while (children.length > 0) {
      const child = children.pop();

      if (child === undefined) {
        throw new Error('Error getting child');
      }

      if (child.gameObject.hasComponent(component)) {
        const childComponent = child.getComponent(component);

        if (childComponent === null) {
          throw new Error('Error getting child component.');
        }

        components.push(childComponent);
      }

      for (const childsChild of child.children) {
        children.push(childsChild);
      }
    }

    return components;
  }

  public addComponent<T extends Component>(newComponent: Component): T {
    const currentComponents = this.componentMap.get(newComponent.constructor.name);

    if (currentComponents !== undefined) {
      currentComponents.push(newComponent);
    } else {
      this.componentMap.set(newComponent.constructor.name, [newComponent]);
    }

    this.componentAnalyzer.extractRenderablesCollidersAndRigidbodies(newComponent);

    newComponent.enabled = true;
    newComponent.start();

    return newComponent as T;
  }

  public removeComponent(component: Component): void {
    if (!this.componentMap.has(component.constructor.name)) {
      throw new Error(`This object does not have a ${component.constructor.name} component!`);
    }

    this.updatableComponents.splice(this.updatableComponents.indexOf(component), 1);
    this.componentMap.delete(component.constructor.name);
    component.onDestroy();
  }

  public onDestroy(): void {
    for (const componentType of this.componentMap.values()) {
      for (const component of componentType) {
        component.onDestroy();
      }
    }
  }

  /**
   * This function is meant to be overridden by subclasses that require child game objects. Not making abstract as not all subclasses need it.
   *
   * @param gameEngine The game engine
   */
  protected buildAndReturnChildGameObjects(config: TConfig): GameObject[] {
    return [];
  }

  private setComponents(components: Component[]): void {
    for (const component of components) {
      this.updatableComponents.push(component);
      const currentComponents = this.componentMap.get(component.constructor.name);

      if (currentComponents !== undefined) {
        currentComponents.push(component);
      } else {
        this.componentMap.set(component.constructor.name, [component]);
      }

      this.componentAnalyzer.extractRenderablesCollidersAndRigidbodies(component);
    }
  }

  /**
   * These settings are overridden by non-default constructor values.
   */
  protected abstract getPrefabSettings(): PrefabSettings;
  protected abstract buildInitialComponents(config: TConfig): Component[];
}
