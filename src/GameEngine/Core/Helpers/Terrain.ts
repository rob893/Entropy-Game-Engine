import { NavGrid } from './NavGrid';
import { RectangleCollider } from '../../Components/RectangleCollider';
import { RenderableBackground } from '../Interfaces/RenderableBackground';
import { GameObject } from '../GameObject';
import { Vector2 } from './Vector2';

export class Terrain extends GameObject implements RenderableBackground {
    
    public readonly terrainImage: HTMLImageElement;
    public readonly navGrid: NavGrid;


    public constructor(terrainImage: HTMLImageElement, navGrid: NavGrid, colliderPositions: Vector2[]) {
        super('terrain', 0, 0);
        
        this.terrainImage = terrainImage;
        this.navGrid = navGrid;

        for (const position of colliderPositions) {
            this.addComponent(new RectangleCollider(this, navGrid.cellSize, navGrid.cellSize, position.x + (navGrid.cellSize / 2), position.y + navGrid.cellSize));
        }
    }

    public renderBackground(context: CanvasRenderingContext2D): void {
        context.drawImage(this.terrainImage, 0, 0);
    }
}