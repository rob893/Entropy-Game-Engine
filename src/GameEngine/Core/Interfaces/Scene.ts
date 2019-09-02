import { GameObject } from '../GameObject';
import { RenderableBackground } from './RenderableBackground';
import { TerrainSpec } from './TerrainSpec';
import { AssetPool } from '../Helpers/AssetPool';
import { GameEngine } from '../GameEngine';

export interface Scene {
    name: string;
    loadOrder: number;
    terrainSpec: TerrainSpec;
    getSkybox(gameCanvas: HTMLCanvasElement): RenderableBackground;
    getStartingGameObjects(gameEngine: GameEngine): GameObject[];
    getAssetPool(): Promise<AssetPool>;
}