import { NavGrid } from '../core/helpers/NavGrid';
import { RectangleCollider } from '../components/RectangleCollider';
import { RenderableBackground } from '../core/interfaces/RenderableBackground';
import { GameObject } from './GameObject';
import { Vector2 } from '../core/helpers/Vector2';
import { Layer } from '../core/enums/Layer';
import { Component } from '../components/Component';
import { PrefabSettings } from '../core/interfaces/PrefabSettings';
import { GameEngine } from '../core/GameEngine';
import { WeightedGraphVisualizer } from '../components/GraphVisualizer';
import { Camera } from '../components/Camera';
import { TerrainCell } from '../core/interfaces/TerrainCell';

export class Terrain extends GameObject implements RenderableBackground {
  public readonly navGrid: NavGrid;
  public readonly backgroundCanvas: HTMLCanvasElement;

  public constructor(
    gameEngine: GameEngine,
    navGrid: NavGrid,
    colliderPositions: Vector2[],
    backgroundCanvas: HTMLCanvasElement
  ) {
    super({ gameEngine });

    this.navGrid = navGrid;
    this.backgroundCanvas = backgroundCanvas;

    const colliderRows = new Map<number, Map<number, [Vector2, number]>>();

    for (const position of colliderPositions) {
      const rows = colliderRows.get(position.y);
      if (rows === undefined) {
        colliderRows.set(position.y, new Map<number, [Vector2, number]>());

        const rowsAfterSet = colliderRows.get(position.y); //All this to get the strict null checker to be quiet...
        if (rowsAfterSet === undefined) {
          throw new Error('Something went horribly wrong.');
        }

        rowsAfterSet.set(position.x, [position, navGrid.cellSize]);
      } else {
        const touple = rows.get(position.x - navGrid.cellSize);
        if (touple !== undefined) {
          const newWidth = touple[1] + navGrid.cellSize;
          const offset = touple[0];
          rows.delete(position.x - navGrid.cellSize);
          rows.set(position.x, [offset, newWidth]);
        } else {
          rows.set(position.x, [position, navGrid.cellSize]);
        }
      }
    }

    for (const yValueMap of colliderRows.values()) {
      for (const xTuple of yValueMap.values()) {
        this.addComponent(
          new RectangleCollider(
            this,
            null,
            xTuple[1],
            navGrid.cellSize,
            xTuple[0].x + xTuple[1] / 2,
            xTuple[0].y + navGrid.cellSize
          )
        );
      }
    }

    // Uncomment this to have the navgrid drawn in development mode.
    //this.addComponent(new WeightedGraphVisualizer(this, navGrid));
  }

  public renderBackground(context: CanvasRenderingContext2D, camera?: Camera): void {
    if (camera) {
      // const {
      //   transform: {
      //     position: { x: cameraX, y: cameraY }
      //   }
      // } = camera;

      // let x = 0;
      // let y = 0;
      // for (let i = 0; i < this.terrainGrid.length; i++) {
      //   for (let j = 0; j < this.terrainGrid[i].length; j++) {
      //     const gridCell = this.terrainGrid[i][j];

      //     if (gridCell === null) {
      //       x = j === this.terrainGrid[i].length - 1 ? 0 : x + 16;
      //       y = j === this.terrainGrid[i].length - 1 ? y + 16 : y;
      //       continue;
      //     }

      //     const c = gridCell.spriteData;

      //     context.drawImage(
      //       this.spriteSheet,
      //       c.sliceX,
      //       c.sliceY,
      //       c.sliceWidth,
      //       c.sliceHeight,
      //       x,
      //       y,
      //       c.sliceWidth * 3,
      //       c.sliceHeight * 3
      //     );
      //     x = j === this.terrainGrid[i].length - 1 ? 0 : x + c.sliceWidth * 3;
      //     y = j === this.terrainGrid[i].length - 1 ? y + c.sliceHeight * 3 : y;
      //   }
      // }
      context.drawImage(this.backgroundCanvas, 0, 0, this.backgroundCanvas.width, this.backgroundCanvas.height);
    } else {
      //context.drawImage(this.terrainImage, 0, 0, context.canvas.width, context.canvas.height);
    }
  }

  protected buildInitialComponents(): Component[] {
    return [];
  }

  protected getPrefabSettings(): PrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      id: 'terrain',
      tag: 'terrain',
      layer: Layer.Terrain
    };
  }
}
