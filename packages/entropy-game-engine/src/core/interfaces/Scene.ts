import { GameObject } from '../../game-objects/GameObject';
import { RenderableBackground } from './RenderableBackground';
import { TerrainSpec } from './TerrainSpec';
import { AssetPool } from '../helpers/AssetPool';
import { GameEngine } from '../GameEngine';

export interface Scene {
  name: string;
  loadOrder: number;
  terrainSpec: TerrainSpec | null;
  getSkybox(gameCanvas: HTMLCanvasElement): RenderableBackground;
  getStartingGameObjects(gameEngine: GameEngine): GameObject[];
  getAssetPool(): Promise<AssetPool>;
}
