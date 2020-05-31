import { CollisionDetector } from './CollisionDetector';
import { CollisionResolver } from './CollisionResolver';
import { GameEngine } from '../GameEngine';

export interface GameEngineConfiguration {
  gameCanvas: HTMLCanvasElement;
  collisionDetectorGenerator?: (gameEngine: GameEngine) => CollisionDetector;
  collisionResolverGenerator?: (gameEngine: GameEngine) => CollisionResolver;
}
