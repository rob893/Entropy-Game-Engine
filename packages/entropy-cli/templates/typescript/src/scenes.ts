import {
    Scene,
    RectangleBackground,
    Color,
    AssetPool,
    GameObject,
    GameEngine
} from '@entropy-engine/entropy-game-engine';
import { SampleGameObject } from './game-objects/SampleGameObject';
import { Box } from './game-objects/Box';

export const scene1: Scene = {
    name: 'Scene1',
    loadOrder: 1,
    terrainSpec: null,

    getSkybox(gameCanvas: HTMLCanvasElement): RectangleBackground {
        return new RectangleBackground(gameCanvas, Color.Black);
    },

    getStartingGameObjects(gameEngine: GameEngine): GameObject[] {
        const topBorder = Box.buildBox(gameEngine, 1280 / 2, 50, 1280, 50, 'topBorder', 'border');
        const bottomBorder = Box.buildBox(gameEngine, 1280 / 2, 720, 1280, 50, 'bottomBorder', 'border', Color.Green);
        const leftBorder = Box.buildBox(gameEngine, 25, 720, 50, 720, 'leftBorder', 'border');
        const rightBorder = Box.buildBox(gameEngine, 1280 - 25, 720, 50, 720, 'rightBorder', 'border');
        const midBox = Box.buildBox(gameEngine, 640, 520, 150, 20, 'midBox', 'border', Color.Brown);

        return [new SampleGameObject({ gameEngine }), topBorder, bottomBorder, leftBorder, rightBorder, midBox];
    },

    getAssetPool(): Promise<AssetPool> {
        const pool = new Map();
        return Promise.resolve(new AssetPool(pool));
    }
};
