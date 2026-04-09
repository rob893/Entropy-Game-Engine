import { Component, type ComponentType, type SerializableComponentType } from '../components/Component';
import { Transform } from '../components/Transform';
import { ComponentRegistry } from '../core/ComponentRegistry';
import { Layer } from '../core/enums/Layer';
import type { GameEngine } from '../core/GameEngine';
import type { AssetPool } from '../core/helpers/AssetPool';
import type { ComponentAnalyzer } from '../core/helpers/ComponentAnalyzer';
import type { Input } from '../core/helpers/Input';
import type { SceneManager } from '../core/helpers/SceneManager';
import { generateUUID } from '../core/helpers/UUID';
import type { Vector2 } from '../core/helpers/Vector2';
import type { Physics } from '../core/physics/Physics';
import type { Time } from '../core/Time';
import type { IPrefabSettings } from '../core/types';
import type { IGameObjectConstructionParams } from '../core/types';
import type { ISerializedComponent, ISerializedGameObject } from '../core/types';
import type { Terrain } from './Terrain';

type SerializableComponentConstructor = SerializableComponentType<Component>;

export abstract class GameObject<TConfig extends IGameObjectConstructionParams = IGameObjectConstructionParams> {
  public name: string;

  public readonly transform: Transform;

  private isEnabled: boolean;

  private readonly updatableComponents: Component[] = [];

  private readonly componentMap: Map<string, Component[]> = new Map<string, Component[]>();

  private readonly componentAnalyzer: ComponentAnalyzer;

  private readonly gameEngine: GameEngine;

  #id: string;

  #tag: string;

  #layer: Layer;

  public constructor(config: TConfig) {
    const { gameEngine, name, x, y, rotation, tag, layer, id } = config;

    this.gameEngine = gameEngine;
    this.isEnabled = true;
    this.componentAnalyzer = gameEngine.componentAnalyzer;

    const prefabSettings = this.getPrefabSettings();

    this.#id = id ?? prefabSettings.id ?? generateUUID();
    this.name = name ?? prefabSettings.name;
    this.transform = new Transform(this, x ?? prefabSettings.x, y ?? prefabSettings.y);
    this.transform.rotation = rotation ?? prefabSettings.rotation;
    this.#tag = tag ?? prefabSettings.tag;
    this.#layer = layer ?? prefabSettings.layer;

    const initialComponents = this.buildInitialComponents(config); //move this into prefab settings
    initialComponents.push(this.transform);

    this.setComponents(initialComponents);

    // Strip parent-specific fields so children generate their own IDs
    const { id: _parentId, name: _parentName, ...childConfig } = config;
    const childGameObjects = this.buildAndReturnChildGameObjects(childConfig as TConfig);

    for (const child of childGameObjects) {
      child.transform.parent = this.transform;
    }
  }

  public get id(): string {
    return this.#id;
  }

  public set id(value: string) {
    if (value === this.#id) {
      return;
    }

    const previousId = this.#id;
    this.#id = value;
    this.gameEngine.syncGameObjectRegistration(this, previousId, this.#tag);
  }

  public get tag(): string {
    return this.#tag;
  }

  public set tag(value: string) {
    if (value === this.#tag) {
      return;
    }

    const previousTag = this.#tag;
    this.#tag = value;
    this.gameEngine.syncGameObjectRegistration(this, this.#id, previousTag);
  }

  public get layer(): Layer {
    return this.#layer;
  }

  public set layer(value: Layer) {
    this.#layer = value;
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
      if (!component.enabled) {
        continue;
      }

      if (enabled) {
        component.onEnabled();
      } else {
        component.onDisable();
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

  public static deserialize(data: ISerializedGameObject, gameEngine: GameEngine): GameObject {
    const gameObject = new SerializedGameObjectNode({
      gameEngine,
      id: data.id,
      name: data.name,
      tag: data.tag,
      layer: data.layer as Layer
    });
    gameObject.deserialize(data);
    return gameObject;
  }

  public serialize(): ISerializedGameObject {
    const components: ISerializedComponent[] = [];
    this.componentMap.forEach(componentGroup => {
      for (const component of componentGroup) {
        if (component instanceof Transform) {
          continue;
        }

        components.push(component.serialize());
      }
    });

    const children: ISerializedGameObject[] = [];
    for (const child of this.transform.children) {
      children.push(child.gameObject.serialize());
    }

    return {
      id: this.id,
      name: this.name,
      tag: this.tag,
      layer: this.layer,
      enabled: this.enabled,
      components: [this.transform.serialize(), ...components],
      children
    };
  }

  public deserialize(data: ISerializedGameObject): void {
    this.id = data.id;
    this.name = data.name;
    this.tag = data.tag;
    this.layer = data.layer as Layer;
    this.enabled = data.enabled;

    this.syncComponents(data.components);
    this.syncChildren(data.children);
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
    type: new (constructionParams: IGameObjectConstructionParams) => T,
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
    if (!this.componentMap.has(component.typeName)) {
      throw new Error(`This game object does not have a component of type ${component.typeName}`);
    }

    if (!this.updatableComponents.includes(component)) {
      throw new Error('This game object does not have the component being removed.');
    }

    this.updatableComponents.splice(this.updatableComponents.indexOf(component), 1);
  }

  public hasComponent<T extends Component>(component: ComponentType<T>): boolean {
    return this.componentMap.has(Component.getTypeName(component));
  }

  public getComponent<T extends Component>(component: ComponentType<T>): T | null {
    const componentType = Component.getTypeName(component);
    const components = this.componentMap.get(componentType);

    if (components === undefined || components.length === 0) {
      return null;
    }

    return components[0] as T;
  }

  public getComponents<T extends Component>(component: ComponentType<T>): T[] {
    const componentType = Component.getTypeName(component);
    const components = this.componentMap.get(componentType);

    if (components === undefined || components.length === 0) {
      return [];
    }

    return [...components] as T[];
  }

  public getComponentInParent<T extends Component>(component: ComponentType<T>): T | null {
    let { parent } = this.transform;

    while (parent !== null) {
      const parentGameObject = parent.gameObject;

      if (parentGameObject.hasComponent(component)) {
        return parentGameObject.getComponent(component);
      }

      parent = parent.parent;
    }

    return null;
  }

  public getComponentsInParent<T extends Component>(component: ComponentType<T>): T[] {
    let { parent } = this.transform;
    const components: T[] = [];

    while (parent !== null) {
      components.push(...parent.gameObject.getComponents(component));
      parent = parent.parent;
    }

    return components;
  }

  public getComponentInChildren<T extends Component>(component: ComponentType<T>): T | null {
    const selfComponent = this.getComponent(component);

    if (selfComponent !== null) {
      return selfComponent;
    }

    const children = [...this.transform.children];

    while (children.length > 0) {
      const child = children.pop();

      if (child === undefined) {
        throw new Error('Error getting child.');
      }

      const childGameObject = child.gameObject;

      if (childGameObject.hasComponent(component)) {
        return childGameObject.getComponent(component);
      }

      for (const childsChild of child.children) {
        children.push(childsChild);
      }
    }

    return null;
  }

  public getComponentsInChildren<T extends Component>(component: ComponentType<T>): T[] {
    const children = [...this.transform.children];
    const components = this.getComponents(component);

    while (children.length > 0) {
      const child = children.pop();

      if (child === undefined) {
        throw new Error('Error getting child');
      }

      components.push(...child.gameObject.getComponents(component));

      for (const childsChild of child.children) {
        children.push(childsChild);
      }
    }

    return components;
  }

  public addComponent<T extends Component>(newComponent: T): T {
    const currentComponents = this.componentMap.get(newComponent.typeName);

    if (currentComponents !== undefined) {
      currentComponents.push(newComponent);
    } else {
      this.componentMap.set(newComponent.typeName, [newComponent]);
    }

    this.componentAnalyzer.extractRenderablesCollidersAndRigidbodies(newComponent);

    newComponent.enabled = true;
    newComponent.start();

    return newComponent;
  }

  public removeComponent(component: Component): void {
    const typeName = component.typeName;
    const components = this.componentMap.get(typeName);

    if (components === undefined) {
      throw new Error(`This object does not have a ${typeName} component!`);
    }

    const componentIndex = components.indexOf(component);

    if (componentIndex === -1) {
      throw new Error(`This specific ${typeName} component is not attached to this object!`);
    }

    components.splice(componentIndex, 1);

    if (components.length === 0) {
      this.componentMap.delete(typeName);
    }

    const updatableIndex = this.updatableComponents.indexOf(component);

    if (updatableIndex !== -1) {
      this.updatableComponents.splice(updatableIndex, 1);
    }

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
    Object.keys(config);
    return [];
  }

  private syncComponents(serializedComponents: ISerializedComponent[]): void {
    const expectedCounts = new Map<string, number>();

    for (const serializedComponent of serializedComponents) {
      if (serializedComponent.typeName === Transform.typeName) {
        continue;
      }

      expectedCounts.set(serializedComponent.typeName, (expectedCounts.get(serializedComponent.typeName) ?? 0) + 1);
    }

    for (const [typeName, components] of Array.from(this.componentMap.entries())) {
      if (typeName === Transform.typeName) {
        continue;
      }

      const expectedCount = expectedCounts.get(typeName) ?? 0;

      while (components.length > expectedCount) {
        const componentToRemove = components[components.length - 1];

        if (componentToRemove === undefined) {
          throw new Error('Error removing extra component.');
        }

        this.removeComponent(componentToRemove);
      }
    }

    const processedCounts = new Map<string, number>();

    for (const serializedComponent of serializedComponents) {
      if (serializedComponent.typeName === Transform.typeName) {
        this.transform.deserialize(serializedComponent.data);
        continue;
      }

      const processedCount = processedCounts.get(serializedComponent.typeName) ?? 0;
      const existingComponents = this.componentMap.get(serializedComponent.typeName) ?? [];
      let component = existingComponents[processedCount];

      if (component === undefined) {
        component = this.createComponentFromSerialized(serializedComponent);
        this.addComponent(component);
      }

      component.deserialize(serializedComponent.data);
      processedCounts.set(serializedComponent.typeName, processedCount + 1);
    }
  }

  private syncChildren(serializedChildren: ISerializedGameObject[]): void {
    const currentChildren = this.transform.children.map(child => child.gameObject);

    for (let i = serializedChildren.length; i < currentChildren.length; i++) {
      currentChildren[i].transform.parent = null;
    }

    for (let i = 0; i < serializedChildren.length; i++) {
      const serializedChild = serializedChildren[i];
      let childGameObject = currentChildren[i];

      if (childGameObject === undefined) {
        childGameObject = new SerializedGameObjectNode({
          gameEngine: this.gameEngine,
          id: serializedChild.id,
          name: serializedChild.name,
          tag: serializedChild.tag,
          layer: serializedChild.layer as Layer
        });
        childGameObject.transform.parent = this.transform;
      } else if (childGameObject.transform.parent !== this.transform) {
        childGameObject.transform.parent = this.transform;
      }

      childGameObject.deserialize(serializedChild);
    }
  }

  private createComponentFromSerialized(serializedComponent: ISerializedComponent): Component {
    const componentConstructor = ComponentRegistry.get(serializedComponent.typeName) as
      | SerializableComponentConstructor
      | undefined;

    if (componentConstructor === undefined) {
      throw new Error(`Component type ${serializedComponent.typeName} is not registered.`);
    }

    if (typeof componentConstructor.createFromSerialized !== 'function') {
      throw new Error(`Component type ${serializedComponent.typeName} cannot be created from serialized data.`);
    }

    return componentConstructor.createFromSerialized(this, serializedComponent.data);
  }

  private setComponents(components: Component[]): void {
    for (const component of components) {
      this.updatableComponents.push(component);
      const currentComponents = this.componentMap.get(component.typeName);

      if (currentComponents !== undefined) {
        currentComponents.push(component);
      } else {
        this.componentMap.set(component.typeName, [component]);
      }

      this.componentAnalyzer.extractRenderablesCollidersAndRigidbodies(component);
    }
  }

  /**
   * These settings are overridden by non-default constructor values.
   */
  protected abstract getPrefabSettings(): IPrefabSettings;
  protected abstract buildInitialComponents(config: TConfig): Component[];
}

class SerializedGameObjectNode extends GameObject {
  protected override getPrefabSettings(): IPrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      name: 'serialized-game-object',
      tag: 'serialized',
      layer: Layer.Default
    };
  }

  protected override buildInitialComponents(): Component[] {
    return [];
  }
}
