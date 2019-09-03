import { NavGrid } from './NavGrid';
import { RectangleCollider } from '../../Components/RectangleCollider';
import { RenderableBackground } from '../Interfaces/RenderableBackground';
import { GameObject } from '../GameObject';
import { Vector2 } from './Vector2';
import { Layer } from '../Enums/Layer';
import { Component } from '../../Components/Component';
import { PrefabSettings } from '../Interfaces/PrefabSettings';
import { GameEngine } from '../GameEngine';

export class Terrain extends GameObject implements RenderableBackground {
    
    public readonly terrainImage: HTMLImageElement;
    public readonly navGrid: NavGrid;


    public constructor(gameEngine: GameEngine, terrainImage: HTMLImageElement, navGrid: NavGrid, colliderPositions: Vector2[]) {
        super(gameEngine);
        
        this.terrainImage = terrainImage;
        this.navGrid = navGrid;

        const colliderRows = new Map<number, Map<number, [Vector2, number]>>();

        for (const position of colliderPositions) {
            if (!colliderRows.has(position.y)) {
                colliderRows.set(position.y, new Map<number, [Vector2, number]>());
                colliderRows.get(position.y).set(position.x, [position, navGrid.cellSize]);
            }
            else {
                if (colliderRows.get(position.y).has(position.x - navGrid.cellSize)) {
                    const newWidth = colliderRows.get(position.y).get(position.x - navGrid.cellSize)[1] + navGrid.cellSize;
                    const offset = colliderRows.get(position.y).get(position.x - navGrid.cellSize)[0];
                    colliderRows.get(position.y).delete(position.x - navGrid.cellSize);
                    colliderRows.get(position.y).set(position.x, [offset, newWidth]);
                }
                else {
                    colliderRows.get(position.y).set(position.x, [position, navGrid.cellSize]);
                }
            }
        }

        for (const yValueMap of colliderRows.values()) {
            for (const xTuple of yValueMap.values()) {
                this.addComponent(new RectangleCollider(this, null, xTuple[1], navGrid.cellSize, xTuple[0].x + (xTuple[1] / 2), xTuple[0].y + navGrid.cellSize));
            }
        }
    }

    public renderBackground(context: CanvasRenderingContext2D): void {
        context.drawImage(this.terrainImage, 0, 0);
    }

    protected getPrefabSettings(): PrefabSettings {
        return {
            x: 0,
            y: 0,
            rotation: 0,
            id: 'terrain',
            tag: 'terrain',
            layer: Layer.Terrain,
            components: []
        };
    }
}