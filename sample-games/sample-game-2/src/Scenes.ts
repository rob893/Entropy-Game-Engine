import {
  AssetPool,
  AudioClip,
  GameEngine,
  GameObject,
  ImageUtilities,
  IRenderableBackground,
  IScene,
  SpriteSheet
} from '@entropy-engine/entropy-game-engine';
import ExplosionSound from './assets/audio/explosion.mp3';
import BackgroundImage from './assets/images/grassbg1.png';
import BrickImage from './assets/images/brick.png';
import Explosion from './assets/images/explosion.png';
import HelicopterSpriteSheet from './assets/images/helicopter.png';
import MissileSpriteSheet from './assets/images/missile.png';
import { Background } from './game-objects/Background';
import { GameManager } from './game-objects/GameManager';
import { Player } from './game-objects/Player';

export const scene1: IScene = {
  name: 'Scene1',
  loadOrder: 1,
  terrainSpec: null,

  getSkybox(gameEngine: GameEngine): IRenderableBackground {
    return new Background({ gameEngine });
  },

  getStartingGameObjects(gameEngine: GameEngine): GameObject[] {
    const player = new Player({ gameEngine });
    const gameManager = new GameManager({ gameEngine });
    return [player, gameManager];
  },

  async getAssetPool(): Promise<AssetPool> {
    const assets = new Map<string, unknown>();

    const helicopterSpriteSheet = await SpriteSheet.buildSpriteSheetAsync(HelicopterSpriteSheet, 3, 1, { right: 3 });
    const explosionSpriteSheet = await SpriteSheet.buildSpriteSheetAsync(Explosion, 5, 5);
    const missileSpriteSheet = await SpriteSheet.buildSpriteSheetAsync(MissileSpriteSheet, 1, 13, { bottom: 2 });

    const backgroundImage = await ImageUtilities.loadImage(BackgroundImage);
    const brickImage = await ImageUtilities.loadImage(BrickImage);

    const explosionSound = await AudioClip.buildAudioClipAsync(ExplosionSound, 5);

    assets.set('brickImage', brickImage);
    assets.set('backgroundImage', backgroundImage);
    assets.set('helicopterSpriteSheet', helicopterSpriteSheet);
    assets.set('explosionSpriteSheet', explosionSpriteSheet);
    assets.set('missileSpriteSheet', missileSpriteSheet);
    assets.set('explosionSound', explosionSound);

    return new AssetPool(assets);
  }
};
