import { GameEngine } from '../GameEngine';
import { Layer } from '../enums/Layer';

export interface GameObjectConstructionParams {
  gameEngine: GameEngine;
  id?: string;
  name?: string;
  x?: number;
  y?: number;
  rotation?: number;
  tag?: string;
  layer?: Layer;
}
