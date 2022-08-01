import { CollisionDetector } from './CollisionDetector';
import { CollisionResolver } from './CollisionResolver';
import { GameEngine } from '../GameEngine';

export interface GameEngineConfiguration {
  gameCanvas: HTMLCanvasElement;
  fpsLimit?: number;
  collisionDetectorGenerator?: (gameEngine: GameEngine) => CollisionDetector;
  collisionResolverGenerator?: (gameEngine: GameEngine) => CollisionResolver;
}
