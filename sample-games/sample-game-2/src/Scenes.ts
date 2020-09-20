import {
  AssetPool,
  AudioClip,
  Color,
  GameEngine,
  GameObject,
  ImageUtilities,
  RectangleBackground,
  RenderableBackground,
  Scene,
  SpriteSheet
} from '@entropy-engine/entropy-game-engine';
import HelicopterSpriteSheet from './assets/images/helicopter.png';
import MissileSpriteSheet from './assets/images/missile.png';
import BrickImage from './assets/images/brick.png';
import BackgroundImage from './assets/images/grassbg1.png';
import Explosion from './assets/images/explosion.png';
import ExplosionSound from './assets/audio/explosion.mp3';
import { Player } from './game-objects/Player';
import { Background } from './game-objects/Background';
import { Border } from './game-objects/Border';
import { GameManager } from './game-objects/GameManager';

export const scene1: Scene = {
  name: 'Scene1',
  loadOrder: 1,
  terrainSpec: null,

  getSkybox(gameEngine: GameEngine): RenderableBackground {
    return new Background({ gameEngine });
  },

  getStartingGameObjects(gameEngine: GameEngine): GameObject[] {
    const player = new Player({ gameEngine });
    const gameManager = new GameManager({ gameEngine });
    return [player, gameManager];
  },

  async getAssetPool(): Promise<AssetPool> {
    const assets = new Map<string, any>();

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
