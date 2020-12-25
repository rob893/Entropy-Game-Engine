import { SpriteData } from '../interfaces/SpriteData';
import { NavGrid } from './NavGrid';
import { Vector2 } from './Vector2';
import { Terrain } from '../../game-objects/Terrain';
import { TerrainSpec } from '../interfaces/TerrainSpec';
import { GameEngine } from '../GameEngine';

export class TerrainBuilder {
  private readonly builderMap: Map<HTMLImageElement, Map<string, SpriteData[]>> = new Map<
    HTMLImageElement,
    Map<string, SpriteData[]>
  >();
  private readonly spriteSheetSet: Set<string> = new Set<string>();
  private currentSpriteSheet: HTMLImageElement | null = null;

  public async buildTerrain(gameEngine: GameEngine, terrainSpec: TerrainSpec): Promise<Terrain> {
    await this.using(terrainSpec.spriteSheetUrl);

    const canvas = document.createElement('canvas');
    canvas.width = terrainSpec.width;
    canvas.height = terrainSpec.height;
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Error loading context from canvas');
    }

    //return new Promise(resolve => {
    const { scale } = terrainSpec;
    const terrainGrid = terrainSpec.getSpec();
    const { cellSize } = terrainSpec;
    const navGrid = new NavGrid(cellSize * scale);
    const colliderOffsets: Vector2[] = [];

    let x = 0;
    let y = 0;
    for (let i = 0; i < terrainGrid.length; i++) {
      for (let j = 0; j < terrainGrid[i].length; j++) {
        const gridCell = terrainGrid[i][j];

        if (gridCell === null) {
          x = j === terrainGrid[i].length - 1 ? 0 : x + cellSize * scale;
          y = j === terrainGrid[i].length - 1 ? y + cellSize * scale : y;
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

        const c = gridCell.spriteData;

        if (this.currentSpriteSheet === null) {
          throw new Error('Error building terrain.');
        }

        let image = this.currentSpriteSheet;

        if (c.spriteSheet) {
          image = await this.loadImage(c.spriteSheet);
        }

        const { tx, ty, ratio } = c;

        context.drawImage(
          image,
          c.sliceX,
          c.sliceY,
          c.sliceWidth * (ratio || 1),
          c.sliceHeight * (ratio || 1),
          x,
          y,
          c.sliceWidth * scale,
          c.sliceHeight * scale
        );
        x = j === terrainGrid[i].length - 1 ? 0 : x + c.sliceWidth * scale;
        y = j === terrainGrid[i].length - 1 ? y + c.sliceHeight * scale : y;
      }
    }

    return new Terrain(gameEngine, navGrid, colliderOffsets, canvas);

    //resolve(new Terrain(gameEngine, navGrid, colliderOffsets, canvas));

    // const image = new Image();
    // image.src = canvas.toDataURL();
    // image.onload = () => {
    //   resolve(
    //     new Terrain(gameEngine, image, navGrid, colliderOffsets, this.currentSpriteSheet!, terrainGrid, canvas)
    //   );
    // };
    //});
  }

  private async loadImage(imageUrl: string): Promise<HTMLImageElement> {
    return new Promise(resolve => {
      const spriteSheetImg = new Image();
      spriteSheetImg.src = imageUrl;
      spriteSheetImg.onload = () => {
        resolve(spriteSheetImg);
      };
    });
  }

  private async using(spriteSheet: string): Promise<TerrainBuilder> {
    if (this.spriteSheetSet.has(spriteSheet)) {
      console.warn('This builder is already using this sprite sheet!');
    }

    return new Promise(resolve => {
      this.spriteSheetSet.add(spriteSheet);

      const spriteSheetImg = new Image();
      spriteSheetImg.src = spriteSheet;
      spriteSheetImg.onload = () => {
        this.builderMap.set(spriteSheetImg, new Map<string, SpriteData[]>());
        this.currentSpriteSheet = spriteSheetImg;
        resolve(this);
      };
    });
  }
}
