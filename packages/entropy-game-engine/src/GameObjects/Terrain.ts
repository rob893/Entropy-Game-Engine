import { NavGrid } from '../Core/Helpers/NavGrid';
import { RectangleCollider } from '../Components/RectangleCollider';
import { RenderableBackground } from '../Core/Interfaces/RenderableBackground';
import { GameObject } from './GameObject';
import { Vector2 } from '../Core/Helpers/Vector2';
import { Layer } from '../Core/Enums/Layer';
import { Component } from '../Components/Component';
import { PrefabSettings } from '../Core/Interfaces/PrefabSettings';
import { GameEngine } from '../Core/GameEngine';
import { WeightedGraphVisualizer } from '../Components/GraphVisualizer';

export class Terrain extends GameObject implements RenderableBackground {
  public readonly terrainImage: HTMLImageElement;
  public readonly navGrid: NavGrid;

  public constructor(
    gameEngine: GameEngine,
    terrainImage: HTMLImageElement,
    navGrid: NavGrid,
    colliderPositions: Vector2[]
  ) {
    super({ gameEngine });

    this.terrainImage = terrainImage;
    this.navGrid = navGrid;

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

  public renderBackground(context: CanvasRenderingContext2D): void {
    context.drawImage(this.terrainImage, 0, 0);
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
