import { GameObject } from '../../game-objects/GameObject';
import { Layer } from '../enums/Layer';
import { GameEngine } from '../GameEngine';
import { ComponentAnalyzer } from '../helpers/ComponentAnalyzer';
import { Input } from '../helpers/Input';
import { SceneManager } from '../helpers/SceneManager';
import { Physics } from '../physics/Physics';
import { InstantiateOptions } from './types';

export interface GameObjectConstructionParams {
  gameEngine: GameEngine;
  id?: string;
  x?: number;
  y?: number;
  rotation?: number;
  tag?: string;
  layer?: Layer;

  componentAnalyzer?: ComponentAnalyzer;
  input?: Input;
  physics?: Physics;
  sceneManager?: SceneManager;

  instantiate?<T extends GameObject>(
    type: new (constructionParams: GameObjectConstructionParams) => T,
    options?: InstantiateOptions
  ): GameObject;
  destroy?(object: GameObject, time?: number): void;
  invoke?(funcToInvoke: () => void, time: number): void;
  invokeRepeating?(funcToInvoke: () => void, repeatRate: number, cancelToken?: { cancel: boolean }): void;
  findGameObjectById?(id: string): GameObject | null;
  findGameObjectWithTag?(tag: string): GameObject | null;
  findGameObjectsWithTag?(tag: string): GameObject[];
}
