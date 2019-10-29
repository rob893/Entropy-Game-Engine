import { Scene } from '../GameEngine/Core/Interfaces/Scene';
import { GameObject } from '../GameEngine/Core/GameObject';
import { Scene1TerrainSpec } from './Terrains/Scene1TerrainSpec';
import { RectangleBackground } from '../GameEngine/Core/Helpers/RectangleBackground';
import { Color } from '../GameEngine/Core/Enums/Color';
import { GameManagerObject } from './GameObjects/GameManagerObject';
import { Trump } from './GameObjects/Trump';
import { Player } from './GameObjects/Player';
import { PlayerRB } from './GameObjects/PlayerRB';
import { Borders } from './GameObjects/Borders';
import { Layer } from '../GameEngine/Core/Enums/Layer';
import { AssetPool } from '../GameEngine/Core/Helpers/AssetPool';
import { SpriteSheet } from '../GameEngine/Core/Helpers/SpriteSheet';
import KnightSheet from './Assets/Images/knight.png';
import MinotaurSheet from './Assets/Images/minotaur.png';
import TrumpIdle from './Assets/Images/trump_idle.png';
import TrumpRun from './Assets/Images/trump_run.png';
import Explosion from './Assets/Images/explosion.png';
import RedFireball from './Assets/Images/redFireball.png';
import ExplosionSound from './Assets/Sounds/explosion.mp3';
import HurtSound from './Assets/Sounds/fat_1_male_hit_1.wav';
import { AudioClip } from '../GameEngine/Core/Helpers/AudioClip';
import { GameEngine } from '../GameEngine/Core/GameEngine';
import { Minotaur } from './GameObjects/Minotaur';
import { Box } from './GameObjects/Box';
import { RectangleRenderer } from '../GameEngine/Components/RectangleRenderer';
import { RectangleCollider } from '../GameEngine/Components/RectangleCollider';


export const scene1: Scene = {
    name: 'Scene1',
    loadOrder: 1,
    terrainSpec: new Scene1TerrainSpec(3),

    getSkybox(gameCanvas: HTMLCanvasElement): RectangleBackground {
        return new RectangleBackground(gameCanvas, Color.Black);
    },

    getStartingGameObjects(gameEngine: GameEngine): GameObject[] {
        return [
            new GameManagerObject(gameEngine, 'gameManager'),
            new Minotaur(gameEngine, 'minotaur'),
            new Player(gameEngine, 'player', 400, 250)
        ];
    },

    async getAssetPool(): Promise<AssetPool> {
        const assets = new Map<string, any>();

        //Need to await all assets here because edge breaks if we try to load them all at the same time.
        const knightMapping = new Map<number, number>([
            [5, 5],
            [6, 5],
            [7, 3],
            [8, 3],
            [9, 3],
            [10, 3],
            [11, 5],
            [12, 5]
        ]);

        const minotaurMapping = new Map<number, number>([
            [1, 5],
            [2, 8],
            [3, 5],
            [5, 5],
            [6, 6],
            [8, 3],
            [9, 3],
            [10, 6],
            [11, 5],
            [12, 8],
            [13, 5],
            [15, 5],
            [16, 6],
            [18, 3],
            [19, 3],
            [20, 6]
        ]);
        const knightSpriteSheet = await SpriteSheet.buildSpriteSheetAsync(KnightSheet, 6, 16, {bottom: 5, top: 0, left: 0, right: 0}, knightMapping);
        const minotaurSheet = await SpriteSheet.buildSpriteSheetAsync(MinotaurSheet, 9, 20, {bottom: 25, top: 0, left: 0, right: 0}, minotaurMapping);
        const explosionSpriteSheet = await SpriteSheet.buildSpriteSheetAsync(Explosion, 5, 5);
        const fireballSpriteSheet = await SpriteSheet.buildSpriteSheetAsync(RedFireball, 3, 2);
        const explosionSound = await AudioClip.buildAudioClipAsync(ExplosionSound, 5);
        const hurtSound = await AudioClip.buildAudioClipAsync(HurtSound, 5);

        assets.set('knightSpriteSheet', knightSpriteSheet);
        assets.set('minotaurSpriteSheet', minotaurSheet);
        assets.set('explosionSpriteSheet', explosionSpriteSheet);
        assets.set('redFireball', fireballSpriteSheet);
        assets.set('explosionSound', explosionSound);
        assets.set('hurtSound', hurtSound);

        return new AssetPool(assets);
    }
};

export const scene3: Scene = {
    name: 'Scene3',
    loadOrder: 3,
    terrainSpec: null,

    getSkybox(gameCanvas: HTMLCanvasElement): RectangleBackground {
        return new RectangleBackground(gameCanvas, Color.Black);
    },
    
    getStartingGameObjects(gameEngine: GameEngine): GameObject[] {
        //const topBorder = new Box(gameEngine, 1280 / 2, 50, 1280, 50);//Box.buildBox(gameEngine, 1280 / 2, 50, 1280, 50);
        //const bottomBorder = Box.buildBox(gameEngine, 1280 / 2, 720, 1280, 50);
        //const leftBorder = Box.buildBox(gameEngine, 25, 720, 50, 720);
        //const rightBorder = Box.buildBox(gameEngine, 1280 - 25, 720, 50, 720);
        
        return [
            new GameManagerObject(gameEngine, 'gameManager'),
            new PlayerRB(gameEngine, 'player'),
            new Borders(gameEngine, 'borders', 0, 0, 0, 'borders', Layer.Terrain)
            //topBorder,
            //bottomBorder,
            //leftBorder,
            //rightBorder
        ];
    },

    async getAssetPool(): Promise<AssetPool> {
        const assets = new Map<string, any>();

        const trumpIdleSpriteSheet = await SpriteSheet.buildSpriteSheetAsync(TrumpIdle, 10, 4);
        const trumpRunSpriteSheet = await SpriteSheet.buildSpriteSheetAsync(TrumpRun, 6, 4);
        const explosionSpriteSheet = await SpriteSheet.buildSpriteSheetAsync(Explosion, 5, 5);
        const explosionSound = await AudioClip.buildAudioClipAsync(ExplosionSound, 5);
        const hurtSound = await AudioClip.buildAudioClipAsync(HurtSound, 5);

        assets.set('trumpIdleSpriteSheet', trumpIdleSpriteSheet);
        assets.set('trumpRunSpriteSheet', trumpRunSpriteSheet);
        assets.set('explosionSpriteSheet', explosionSpriteSheet);
        assets.set('explosionSound', explosionSound);
        assets.set('hurtSound', hurtSound);

        return new AssetPool(assets);
    }
};