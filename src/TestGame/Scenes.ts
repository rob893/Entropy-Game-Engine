import { Scene } from '../GameEngine/Core/Interfaces/Scene';
import { RenderableBackground } from '../GameEngine/Core/Interfaces/RenderableBackground';
import { GameObject } from '../GameEngine/Core/GameObject';
import { Scene1TerrainSpec } from './Terrains/Scene1TerrainSpec';
import { RectangleBackground } from '../GameEngine/Core/Helpers/RectangleBackground';
import { Color } from '../GameEngine/Core/Enums/Color';
import { GameManagerObject } from './GameObjects/GameManagerObject';
import { Trump } from './GameObjects/Trump';
import { Player2 } from './GameObjects/Player2';
import { ImageBackground } from '../GameEngine/Core/Helpers/ImageBackground';
import Scene2Background from './Assets/Images/background.png';
import { PlayerRB } from './GameObjects/PlayerRB';
import { Borders } from './GameObjects/Borders';
import { Layer } from '../GameEngine/Core/Enums/Layer';
import { GameEngineAPIs } from '../GameEngine/Core/Interfaces/GameEngineAPIs';
import { AssetPool } from '../GameEngine/Core/Helpers/AssetPool';
import { SpriteSheet } from '../GameEngine/Core/Helpers/SpriteSheet';
import TrumpIdle from './Assets/Images/trump_idle.png';
import TrumpRun from './Assets/Images/trump_run.png';
import Explosion from './Assets/Images/explosion.png';
import ExplosionSound from './Assets/Sounds/explosion.mp3';
import HurtSound from './Assets/Sounds/fat_1_male_hit_1.wav';
import { AudioClip } from '../GameEngine/Core/Helpers/AudioClip';


export const scene1: Scene = {
    name: 'Scene1',
    loadOrder: 1,
    terrainSpec: new Scene1TerrainSpec(3),

    getSkybox(gameCanvas: HTMLCanvasElement): RectangleBackground {
        return new RectangleBackground(gameCanvas, Color.Black);
    },

    getStartingGameObjects(apis: GameEngineAPIs): GameObject[] {
        return [
            new GameManagerObject(apis, 'gameManager'),
            new Trump(apis, 'trump'),
            new Player2(apis, 'player', 400, 250)
        ];
    },

    async getAssetPool(): Promise<AssetPool> {
        const assets = new Map<string, any>();

        const trumpIdleSpriteSheet = await SpriteSheet.buildSpriteSheetAsync(TrumpIdle, 10, 4);
        assets.set('trumpIdleSpriteSheet', trumpIdleSpriteSheet);

        const trumpRunSpriteSheet = await SpriteSheet.buildSpriteSheetAsync(TrumpRun, 6, 4);
        assets.set('trumpRunSpriteSheet', trumpRunSpriteSheet);

        const explosionSpriteSheet = await SpriteSheet.buildSpriteSheetAsync(Explosion, 5, 5);
        assets.set('explosionSpriteSheet', explosionSpriteSheet);

        return new AssetPool(assets);
    }
};

export const scene2: Scene = {
    name: 'Scene2',
    loadOrder: 2,
    terrainSpec: null,

    getSkybox(gameCanvas: HTMLCanvasElement): RenderableBackground {
        return new ImageBackground(gameCanvas, Scene2Background);
    },
    
    getStartingGameObjects(apis: GameEngineAPIs): GameObject[] {
        return [
            new GameManagerObject(apis, 'gameManager')
        ];
    },

    async getAssetPool(): Promise<AssetPool> {
        return new Promise(res => res(new AssetPool(new Map()))); 
    }
};

export const scene3: Scene = {
    name: 'Scene3',
    loadOrder: 3,
    terrainSpec: null,

    getSkybox(gameCanvas: HTMLCanvasElement): RectangleBackground {
        return new RectangleBackground(gameCanvas, Color.Black);
    },
    
    getStartingGameObjects(apis: GameEngineAPIs): GameObject[] {
        return [
            new GameManagerObject(apis, 'gameManager'),
            new PlayerRB(apis, 'player'),
            new Borders(apis, 'borders', 0, 0, 0, 'borders', Layer.Terrain),
            //new TrumpRB('trump', 500, 670),
            //new TrumpRB('trump', 570, 670),
            //new TrumpRB('trump', 640, 670),
            //new TrumpRB('trump', 710, 670)
        ];
    },

    async getAssetPool(): Promise<AssetPool> {
        const assets = new Map<string, any>();

        const trumpIdleSpriteSheet = await SpriteSheet.buildSpriteSheetAsync(TrumpIdle, 10, 4);
        assets.set('trumpIdleSpriteSheet', trumpIdleSpriteSheet);

        const trumpRunSpriteSheet = await SpriteSheet.buildSpriteSheetAsync(TrumpRun, 6, 4);
        assets.set('trumpRunSpriteSheet', trumpRunSpriteSheet);

        const explosionSpriteSheet = await SpriteSheet.buildSpriteSheetAsync(Explosion, 5, 5);
        assets.set('explosionSpriteSheet', explosionSpriteSheet);

        const explosionSound = await AudioClip.buildAudioClipAsync(ExplosionSound, 5);
        assets.set('explosionSound', explosionSound);

        const hurtSound = await AudioClip.buildAudioClipAsync(HurtSound, 5);
        assets.set('hurtSound', hurtSound);

        return new AssetPool(assets);
    }
};