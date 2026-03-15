import type { Transform } from '../components/Transform';
import { GameObject } from '../game-objects/GameObject';
import type { GameEngine } from './GameEngine';
import type { SchedulerService } from './SchedulerService';
import type { IGameObjectConstructionParams } from './types';

export class GameObjectRegistry {
  private readonly gameObjectMap: Map<string, GameObject> = new Map<string, GameObject>();

  private readonly tagMap: Map<string, GameObject[]> = new Map<string, GameObject[]>();

  private readonly gameObjectsMarkedForDelete: GameObject[] = [];

  private gameObjects: GameObject[] = [];

  private readonly scheduler: SchedulerService;

  public constructor(scheduler: SchedulerService) {
    this.scheduler = scheduler;
  }

  public get allGameObjects(): readonly GameObject[] {
    return [...this.gameObjects];
  }

  public findGameObjectById(id: string): GameObject | null {
    const gameObject = this.gameObjectMap.get(id);

    if (gameObject === undefined) {
      return null;
    }

    return gameObject;
  }

  public findGameObjectWithTag(tag: string): GameObject | null {
    const gameObjects = this.tagMap.get(tag);

    if (gameObjects === undefined || gameObjects.length === 0) {
      return null;
    }

    return gameObjects[0];
  }

  public findGameObjectsWithTag(tag: string): GameObject[] {
    const gameObjects = this.tagMap.get(tag);

    if (gameObjects === undefined) {
      return [];
    }

    return [...gameObjects];
  }

  public syncGameObjectRegistration(gameObject: GameObject, previousId: string, previousTag: string): void {
    const isRegistered = this.gameObjectMap.get(previousId) === gameObject || this.gameObjects.includes(gameObject);

    if (!isRegistered) {
      return;
    }

    if (previousId !== gameObject.id) {
      const conflictingObject = this.gameObjectMap.get(gameObject.id);
      if (conflictingObject !== undefined && conflictingObject !== gameObject) {
        throw new Error(`Game object with id ${gameObject.id} is already registered.`);
      }

      if (this.gameObjectMap.get(previousId) === gameObject) {
        this.gameObjectMap.delete(previousId);
      }

      this.gameObjectMap.set(gameObject.id, gameObject);
    }

    if (previousTag === gameObject.tag) {
      return;
    }

    const previousTagObjects = this.tagMap.get(previousTag);
    if (previousTagObjects !== undefined) {
      const previousTagIndex = previousTagObjects.indexOf(gameObject);
      if (previousTagIndex !== -1) {
        previousTagObjects.splice(previousTagIndex, 1);
      }

      if (previousTagObjects.length === 0) {
        this.tagMap.delete(previousTag);
      }
    }

    const nextTagObjects = this.tagMap.get(gameObject.tag);
    if (nextTagObjects !== undefined) {
      if (!nextTagObjects.includes(gameObject)) {
        nextTagObjects.push(gameObject);
      }
    } else {
      this.tagMap.set(gameObject.tag, [gameObject]);
    }
  }

  public instantiate<T extends GameObject>(
    type: new (constructionParams: IGameObjectConstructionParams) => T,
    gameEngine: GameEngine,
    position?: IVector2Like,
    rotation?: number,
    parent?: Transform
  ): GameObject {
    const newGameObject = new type({ gameEngine });

    if (position !== undefined) {
      newGameObject.transform.setPosition(position.x, position.y);
    }

    if (rotation !== undefined) {
      newGameObject.transform.rotation = rotation;
    }

    if (parent !== undefined) {
      newGameObject.transform.parent = parent;
    }

    this.registerGameObject(newGameObject);

    return newGameObject;
  }

  public destroy(object: GameObject, time: number = 0): void {
    if (time === 0) {
      this.markForDestroy(object);
    } else {
      this.scheduler.invoke(() => {
        this.markForDestroy(object);
      }, time);
    }
  }

  public processDestroyQueue(): void {
    while (this.gameObjectsMarkedForDelete.length > 0) {
      const gameObject = this.gameObjectsMarkedForDelete.pop();

      if (gameObject === undefined) {
        throw new Error('Error deleting game object');
      }

      this.removeReferencesToGameObject(gameObject);
    }
  }

  public setGameObjects(gameObjects: GameObject[]): void {
    this.gameObjects = [];

    for (const gameObject of gameObjects) {
      const gameObjectsToRegister = this.collectGameObjects(gameObject);

      for (const currentGameObject of gameObjectsToRegister) {
        this.addGameObjectToCollections(currentGameObject);
      }
    }
  }

  public startAllGameObjects(): void {
    this.gameObjects.forEach(go => go.start());
  }

  public updateAllGameObjects(): void {
    for (const gameObject of this.gameObjects) {
      if (gameObject.enabled) {
        gameObject.update();
      }
    }
  }

  public registerGameObject(newGameObject: GameObject): void {
    const gameObjectsToRegister = this.collectGameObjects(newGameObject);

    for (const gameObject of gameObjectsToRegister) {
      this.addGameObjectToCollections(gameObject);
      gameObject.start();
    }
  }

  public clear(): void {
    this.tagMap.clear();
    this.gameObjectMap.clear();
    this.gameObjects.length = 0;
    this.gameObjectsMarkedForDelete.length = 0;
  }

  private markForDestroy(object: GameObject): void {
    this.gameObjectsMarkedForDelete.push(object);

    const {
      transform: { children }
    } = object;

    while (children.length > 0) {
      const child = children.pop();

      if (child === undefined) {
        throw new Error('Error getting child');
      }

      this.gameObjectsMarkedForDelete.push(child.gameObject);

      for (const childsChild of child.children) {
        children.push(childsChild);
      }
    }
  }

  private removeReferencesToGameObject(object: GameObject): void {
    if (this.gameObjectMap.has(object.id)) {
      this.gameObjectMap.delete(object.id);
    }

    const index = this.gameObjects.indexOf(object);

    if (index !== -1) {
      this.gameObjects.splice(index, 1);
    }

    const gameObjectsWithTag = this.tagMap.get(object.tag);

    if (gameObjectsWithTag !== undefined) {
      const tagIndex = gameObjectsWithTag.indexOf(object);

      if (tagIndex !== -1) {
        gameObjectsWithTag.splice(tagIndex, 1);
      }
    }

    object.onDestroy();
  }

  private addGameObjectToCollections(gameObject: GameObject): void {
    if (this.gameObjectMap.has(gameObject.id)) {
      throw new Error(`Game object with id ${gameObject.id} is already registered.`);
    }

    const gameObjectsWithTag = this.tagMap.get(gameObject.tag);
    if (gameObjectsWithTag !== undefined) {
      gameObjectsWithTag.push(gameObject);
    } else {
      this.tagMap.set(gameObject.tag, [gameObject]);
    }

    this.gameObjectMap.set(gameObject.id, gameObject);
    this.gameObjects.push(gameObject);
  }

  private collectGameObjects(rootGameObject: GameObject): GameObject[] {
    const gameObjects = [rootGameObject];

    for (let i = 0; i < gameObjects.length; i++) {
      gameObjects.push(...gameObjects[i].transform.children.map(child => child.gameObject));
    }

    return gameObjects;
  }
}

interface IVector2Like {
  readonly x: number;
  readonly y: number;
}
