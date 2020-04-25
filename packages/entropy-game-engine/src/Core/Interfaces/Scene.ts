import { GameObject } from '../../GameObjects/GameObject';
import { RenderableBackground } from './RenderableBackground';
import { TerrainSpec } from './TerrainSpec';
import { AssetPool } from '../Helpers/AssetPool';
import { GameEngine } from '../GameEngine';

export interface Scene {
  name: string;
  loadOrder: number;
  terrainSpec: TerrainSpec | null;
  getSkybox(gameCanvas: HTMLCanvasElement): RenderableBackground;
  getStartingGameObjects(gameEngine: GameEngine): GameObject[];
  getAssetPool(): Promise<AssetPool>;
}
