import { Terrain } from '../../game-objects/Terrain';
import type { GameEngine } from '../GameEngine';
import type { ISpriteData } from '../types';
import type { ITerrainSpec } from '../types';
import { NavGrid } from './NavGrid';
import { Vector2 } from './Vector2';

type LegacyTerrainSpec = Required<Pick<ITerrainSpec, 'spriteSheetUrl' | 'scale' | 'cellSize' | 'getSpec'>>;
type JSONTerrainSpec = Required<Pick<ITerrainSpec, 'tileWidth' | 'tileHeight' | 'grid'>> &
  Pick<ITerrainSpec, 'tileSet'>;
type LayeredTerrainSpec = Required<Pick<ITerrainSpec, 'layers'>> &
  Required<Pick<ITerrainSpec, 'tileWidth' | 'tileHeight'>>;

export class TerrainBuilder {
  private readonly context: CanvasRenderingContext2D;

  private readonly canvas: HTMLCanvasElement;

  private readonly imageCache: Map<string, Promise<HTMLImageElement>> = new Map<string, Promise<HTMLImageElement>>();

  public constructor(width: number = 1024, height: number = 576) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    const context = this.canvas.getContext('2d');

    if (context === null) {
      throw new Error('Bad context');
    }

    this.context = context;
  }

  public async buildTerrain(gameEngine: GameEngine, terrainSpec: ITerrainSpec): Promise<Terrain> {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.isLayeredTerrainSpec(terrainSpec)) {
      return await this.buildLayeredTerrain(gameEngine, terrainSpec);
    }

    if (this.isLegacyTerrainSpec(terrainSpec)) {
      return await this.buildLegacyTerrain(gameEngine, terrainSpec);
    }

    if (this.isJSONTerrainSpec(terrainSpec)) {
      return await this.buildJSONTerrain(gameEngine, terrainSpec);
    }

    throw new Error('Invalid terrain spec.');
  }

  private async buildLegacyTerrain(gameEngine: GameEngine, terrainSpec: LegacyTerrainSpec): Promise<Terrain> {
    const spriteSheet = await this.loadImage(terrainSpec.spriteSheetUrl);
    const terrainGrid = terrainSpec.getSpec();
    const navGrid = new NavGrid(terrainSpec.cellSize * terrainSpec.scale);
    const colliderOffsets: Vector2[] = [];

    let x = 0;
    let y = 0;
    for (let i = 0; i < terrainGrid.length; i++) {
      for (let j = 0; j < terrainGrid[i].length; j++) {
        const gridCell = terrainGrid[i][j];

        if (gridCell === null) {
          x = j === terrainGrid[i].length - 1 ? 0 : x + terrainSpec.cellSize * terrainSpec.scale;
          y = j === terrainGrid[i].length - 1 ? y + terrainSpec.cellSize * terrainSpec.scale : y;
          continue;
        }

        navGrid.addCell({
          passable: gridCell.passable,
          weight: gridCell.weight,
          position: new Vector2(x, y)
        });

        if (!gridCell.passable) {
          colliderOffsets.push(new Vector2(x, y));
        }

        const spriteData = gridCell.spriteData;
        this.context.drawImage(
          spriteSheet,
          spriteData.sliceX,
          spriteData.sliceY,
          spriteData.sliceWidth,
          spriteData.sliceHeight,
          x,
          y,
          spriteData.sliceWidth * terrainSpec.scale,
          spriteData.sliceHeight * terrainSpec.scale
        );

        x = j === terrainGrid[i].length - 1 ? 0 : x + spriteData.sliceWidth * terrainSpec.scale;
        y = j === terrainGrid[i].length - 1 ? y + spriteData.sliceHeight * terrainSpec.scale : y;
      }
    }

    return await this.createTerrain(gameEngine, navGrid, colliderOffsets);
  }

  private async buildJSONTerrain(gameEngine: GameEngine, terrainSpec: JSONTerrainSpec): Promise<Terrain> {
    const navGrid = new NavGrid(Math.max(terrainSpec.tileWidth, terrainSpec.tileHeight));
    const colliderOffsets: Vector2[] = [];

    for (let row = 0; row < terrainSpec.grid.length; row++) {
      for (let column = 0; column < terrainSpec.grid[row].length; column++) {
        const tileValue = terrainSpec.grid[row][column];

        if (tileValue === 0) {
          continue;
        }

        const x = column * terrainSpec.tileWidth;
        const y = row * terrainSpec.tileHeight;
        const passable = tileValue > 0;

        navGrid.addCell({
          passable,
          weight: 0,
          position: new Vector2(x, y)
        });

        if (!passable) {
          colliderOffsets.push(new Vector2(x, y));
        }

        const assetPath = terrainSpec.tileSet?.[Math.abs(tileValue)];

        if (assetPath !== undefined) {
          await this.drawTile(assetPath, x, y, terrainSpec.tileWidth, terrainSpec.tileHeight);
        }
      }
    }

    return await this.createTerrain(gameEngine, navGrid, colliderOffsets);
  }

  private async buildLayeredTerrain(gameEngine: GameEngine, terrainSpec: LayeredTerrainSpec): Promise<Terrain> {
    const layers = terrainSpec.layers;
    const tileWidth = terrainSpec.tileWidth;
    const tileHeight = terrainSpec.tileHeight;
    const navGrid = new NavGrid(Math.max(tileWidth, tileHeight));
    const colliderOffsets: Vector2[] = [];
    const layerImages: HTMLImageElement[] = [];
    const layerVisibility: boolean[] = [];
    const layerOpacity: number[] = [];

    for (let layerIndex = 0; layerIndex < layers.length; layerIndex++) {
      const layer = layers[layerIndex];
      layerVisibility.push(layer.visible);
      layerOpacity.push(layer.opacity);

      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let row = 0; row < layer.grid.length; row++) {
        for (let column = 0; column < layer.grid[row].length; column++) {
          const tileValue = layer.grid[row][column];

          if (tileValue === 0) {
            continue;
          }

          const x = column * tileWidth;
          const y = row * tileHeight;

          const passable = layer.passability !== undefined ? (layer.passability[row]?.[column] ?? true) : true;

          const weight = layer.weights !== undefined ? (layer.weights[row]?.[column] ?? 1) : 1;

          navGrid.addCell({
            passable,
            weight,
            position: new Vector2(x, y)
          });

          if (!passable) {
            colliderOffsets.push(new Vector2(x, y));
          }

          const assetPath = layer.tileSet[tileValue];

          if (assetPath !== undefined) {
            await this.drawTile(assetPath, x, y, tileWidth, tileHeight);
          }
        }
      }

      const layerImage = await this.canvasToImage();
      layerImages.push(layerImage);
    }

    return this.createLayeredTerrain(gameEngine, navGrid, colliderOffsets, layerImages, layerVisibility, layerOpacity);
  }

  private async createTerrain(gameEngine: GameEngine, navGrid: NavGrid, colliderOffsets: Vector2[]): Promise<Terrain> {
    const image = await this.canvasToImage();
    return new Terrain(gameEngine, image, navGrid, colliderOffsets);
  }

  private createLayeredTerrain(
    gameEngine: GameEngine,
    navGrid: NavGrid,
    colliderOffsets: Vector2[],
    layerImages: HTMLImageElement[],
    layerVisibility: boolean[],
    layerOpacity: number[]
  ): Terrain {
    return new Terrain(
      gameEngine,
      layerImages[0],
      navGrid,
      colliderOffsets,
      layerImages,
      layerVisibility,
      layerOpacity
    );
  }

  private async canvasToImage(): Promise<HTMLImageElement> {
    return await new Promise((resolve, reject) => {
      const image = new Image();
      image.src = this.canvas.toDataURL();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Failed to create terrain layer image'));
    });
  }

  private async drawTile(
    assetPath: string,
    x: number,
    y: number,
    tileWidth: number,
    tileHeight: number
  ): Promise<void> {
    const spriteSheetTile = this.parseSpriteSheetTile(assetPath);

    if (spriteSheetTile === null) {
      const tileImage = await this.loadImage(assetPath);
      this.context.drawImage(tileImage, x, y, tileWidth, tileHeight);
      return;
    }

    const tileImage = await this.loadImage(spriteSheetTile.path);
    this.context.drawImage(
      tileImage,
      spriteSheetTile.spriteData.sliceX,
      spriteSheetTile.spriteData.sliceY,
      spriteSheetTile.spriteData.sliceWidth,
      spriteSheetTile.spriteData.sliceHeight,
      x,
      y,
      tileWidth,
      tileHeight
    );
  }

  private parseSpriteSheetTile(assetPath: string): { path: string; spriteData: ISpriteData } | null {
    const fragmentIndex = assetPath.lastIndexOf('#');

    if (fragmentIndex === -1) {
      return null;
    }

    const path = assetPath.slice(0, fragmentIndex);
    const coordinates = assetPath
      .slice(fragmentIndex + 1)
      .split(',')
      .map(value => Number(value));

    if (coordinates.length !== 4 || coordinates.some(value => !Number.isFinite(value))) {
      return null;
    }

    const [sliceX, sliceY, sliceWidth, sliceHeight] = coordinates;

    return {
      path,
      spriteData: {
        sliceX,
        sliceY,
        sliceWidth,
        sliceHeight
      }
    };
  }

  private async loadImage(src: string): Promise<HTMLImageElement> {
    const existingImage = this.imageCache.get(src);

    if (existingImage !== undefined) {
      return await existingImage;
    }

    const imagePromise = new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.src = src;
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`Unable to load terrain image: ${src}`));
    });

    this.imageCache.set(src, imagePromise);
    return await imagePromise;
  }

  private isLegacyTerrainSpec(terrainSpec: ITerrainSpec): terrainSpec is LegacyTerrainSpec {
    return (
      typeof terrainSpec.spriteSheetUrl === 'string' &&
      typeof terrainSpec.scale === 'number' &&
      typeof terrainSpec.cellSize === 'number' &&
      typeof terrainSpec.getSpec === 'function'
    );
  }

  private isLayeredTerrainSpec(terrainSpec: ITerrainSpec): terrainSpec is LayeredTerrainSpec {
    return (
      Array.isArray(terrainSpec.layers) &&
      terrainSpec.layers.length > 0 &&
      typeof terrainSpec.tileWidth === 'number' &&
      typeof terrainSpec.tileHeight === 'number'
    );
  }

  private isJSONTerrainSpec(terrainSpec: ITerrainSpec): terrainSpec is JSONTerrainSpec {
    return (
      typeof terrainSpec.tileWidth === 'number' &&
      typeof terrainSpec.tileHeight === 'number' &&
      Array.isArray(terrainSpec.grid)
    );
  }
}
