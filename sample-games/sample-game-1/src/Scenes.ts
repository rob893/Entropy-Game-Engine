import {
  AssetPool,
  AudioClip,
  Color,
  GameEngine,
  GameObject,
  RectangleBackground,
  Scene,
  SpriteSheet,
  DefaultCamera
} from '@entropy-engine/entropy-game-engine';
import { Scene1TerrainSpec } from './terrains/Scene1TerrainSpec';
import { GameManagerObject } from './game-objects/GameManagerObject';
import { Player } from './game-objects/Player';
import { PlayerRB } from './game-objects/PlayerRB';
import KnightSheet from './assets/images/knight.png';
import MinotaurSheet from './assets/images/minotaur.png';
import TrumpIdle from './assets/images/trump_idle.png';
import TrumpRun from './assets/images/trump_run.png';
import KnightRun from './assets/images/characters/male-knight/Male_Knight_Run.png';
import KnightIdle from './assets/images/characters/male-knight/Male_Knight_Idle6.png';
import KnightAttack1 from './assets/images/characters/male-knight/Male_Knight_Attack One Handed Overhead.png';
import KnightAttack2 from './assets/images/characters/male-knight/Male_Knight_Attack One Handed Side Slash.png';
import Explosion from './assets/images/explosion.png';
import RedFireball from './assets/images/redFireball.png';
import ExplosionSound from './assets/audio/explosion.mp3';
import HurtSound from './assets/audio/fat_1_male_hit_1.wav';
import { Minotaur } from './game-objects/Minotaur';
import { Box } from './game-objects/Box';
import { UICanvas } from './game-objects/UICanvas';

export const scene1: Scene = {
  name: 'Scene1',
  loadOrder: 1,
  terrainSpec: new Scene1TerrainSpec(3),

  getSkybox({ gameCanvas }): RectangleBackground {
    return new RectangleBackground(gameCanvas, Color.Black);
  },

  getStartingGameObjects(gameEngine: GameEngine): GameObject[] {
    return [
      new DefaultCamera({ gameEngine }),
      new GameManagerObject({ gameEngine, id: 'gameManager' }),
      // new Minotaur({ gameEngine, id: 'minotaur' }),
      new Player({ gameEngine, id: 'player', x: 400, y: 250 }),
      new UICanvas({ gameEngine, id: 'ui-canvas' })
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

    const knightSpriteSheet = await SpriteSheet.buildSpriteSheetAsync(
      KnightSheet,
      6,
      16,
      { bottom: 5, top: 0, left: 0, right: 0 },
      knightMapping
    );
    const minotaurSheet = await SpriteSheet.buildSpriteSheetAsync(
      MinotaurSheet,
      9,
      20,
      { bottom: 25, top: 0, left: 0, right: 0 },
      minotaurMapping
    );
    const explosionSpriteSheet = await SpriteSheet.buildSpriteSheetAsync(Explosion, 5, 5);
    const fireballSpriteSheet = await SpriteSheet.buildSpriteSheetAsync(RedFireball, 3, 2);
    const knightRunSpriteSheet = await SpriteSheet.buildSpriteSheetAsync(KnightRun, 8, 8);
    const knightIdleSpriteSheet = await SpriteSheet.buildSpriteSheetAsync(KnightIdle, 3, 8);
    const knightAttack1SpriteSheet = await SpriteSheet.buildSpriteSheetAsync(KnightAttack1, 3, 8);
    const knightAttack2SpriteSheet = await SpriteSheet.buildSpriteSheetAsync(KnightAttack2, 3, 8);
    const explosionSound = await AudioClip.buildAudioClipAsync(ExplosionSound, 5);
    const hurtSound = await AudioClip.buildAudioClipAsync(HurtSound, 5);

    assets.set('knightSpriteSheet', knightSpriteSheet);
    assets.set('knightRunSpriteSheet', knightRunSpriteSheet);
    assets.set('knightIdleSpriteSheet', knightIdleSpriteSheet);
    assets.set('knightAttack1SpriteSheet', knightAttack1SpriteSheet);
    assets.set('knightAttack2SpriteSheet', knightAttack2SpriteSheet);
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

  getSkybox({ gameCanvas }): RectangleBackground {
    return new RectangleBackground(gameCanvas, Color.Black);
  },

  getStartingGameObjects(gameEngine: GameEngine): GameObject[] {
    const topBorder = Box.buildBox(gameEngine, 1280 / 2, 50, 1280, 50, 'topBorder', 'border');
    const bottomBorder = Box.buildBox(gameEngine, 1280 / 2, 720, 1280, 50, 'bottomBorder', 'border', Color.Green);
    const leftBorder = Box.buildBox(gameEngine, 25, 720, 50, 720, 'leftBorder', 'border');
    const rightBorder = Box.buildBox(gameEngine, 1280 - 25, 720, 50, 720, 'rightBorder', 'border');
    const midBox = Box.buildBox(gameEngine, 640, 520, 150, 20, 'midBox', 'border', Color.Brown);

    return [
      new DefaultCamera({ gameEngine }),
      new GameManagerObject({ gameEngine, id: 'gameManager' }),
      new PlayerRB({ gameEngine, id: 'player' }),
      topBorder,
      bottomBorder,
      leftBorder,
      rightBorder,
      midBox
    ];
  },

  async getAssetPool(): Promise<AssetPool> {
    const assets = new Map<string, any>();

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
    const minotaurSheet = await SpriteSheet.buildSpriteSheetAsync(
      MinotaurSheet,
      9,
      20,
      { bottom: 25, top: 0, left: 0, right: 0 },
      minotaurMapping
    );
    const trumpIdleSpriteSheet = await SpriteSheet.buildSpriteSheetAsync(TrumpIdle, 10, 4);
    const trumpRunSpriteSheet = await SpriteSheet.buildSpriteSheetAsync(TrumpRun, 6, 4);
    const explosionSpriteSheet = await SpriteSheet.buildSpriteSheetAsync(Explosion, 5, 5);
    const explosionSound = await AudioClip.buildAudioClipAsync(ExplosionSound, 5);
    const hurtSound = await AudioClip.buildAudioClipAsync(HurtSound, 5);

    assets.set('minotaurSpriteSheet', minotaurSheet);
    assets.set('trumpIdleSpriteSheet', trumpIdleSpriteSheet);
    assets.set('trumpRunSpriteSheet', trumpRunSpriteSheet);
    assets.set('explosionSpriteSheet', explosionSpriteSheet);
    assets.set('explosionSound', explosionSound);
    assets.set('hurtSound', hurtSound);

    return new AssetPool(assets);
  }
};
