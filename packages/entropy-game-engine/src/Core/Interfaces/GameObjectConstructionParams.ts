import { GameEngine } from '../GameEngine';
import { Layer } from '../Enums/Layer';

export interface GameObjectConstructionParams {
  gameEngine: GameEngine;
  id?: string;
  x?: number;
  y?: number;
  rotation?: number;
  tag?: string;
  layer?: Layer;
}
