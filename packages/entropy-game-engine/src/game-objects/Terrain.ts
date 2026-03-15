import type { Component } from '../components/Component';
import { RectangleCollider } from '../components/RectangleCollider';
import { Layer } from '../core/enums/Layer';
import type { GameEngine } from '../core/GameEngine';
import type { NavGrid } from '../core/helpers/NavGrid';
import type { Vector2 } from '../core/helpers/Vector2';
import type { IRenderableBackground } from '../core/types';
import type { IPrefabSettings } from '../core/types';
import { GameObject } from './GameObject';

export class Terrain extends GameObject implements IRenderableBackground {
  public readonly terrainImage: HTMLImageElement;

  public readonly navGrid: NavGrid;

  private readonly layerImages: HTMLImageElement[] | null;

  private readonly layerVisibility: boolean[];

  private readonly layerOpacity: number[];

  public constructor(
    gameEngine: GameEngine,
    terrainImage: HTMLImageElement,
    navGrid: NavGrid,
    colliderPositions: Vector2[],
    layerImages?: HTMLImageElement[],
    layerVisibility?: boolean[],
    layerOpacity?: number[]
  ) {
    super({ gameEngine });

    this.terrainImage = terrainImage;
    this.navGrid = navGrid;
    this.layerImages = layerImages ?? null;
    this.layerVisibility = layerVisibility ?? [];
    this.layerOpacity = layerOpacity ?? [];

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

  }

  public renderBackground(context: CanvasRenderingContext2D): void {
    if (this.layerImages !== null) {
      for (let i = 0; i < this.layerImages.length; i++) {
        if (!this.layerVisibility[i]) {
          continue;
        }

        const previousAlpha = context.globalAlpha;
        context.globalAlpha = this.layerOpacity[i] ?? 1;
        context.drawImage(this.layerImages[i], 0, 0);
        context.globalAlpha = previousAlpha;
      }

      return;
    }

    context.drawImage(this.terrainImage, 0, 0);
  }

  protected buildInitialComponents(): Component[] {
    return [];
  }

  protected getPrefabSettings(): IPrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      name: 'terrain',
      tag: 'terrain',
      layer: Layer.Terrain
    };
  }
}
