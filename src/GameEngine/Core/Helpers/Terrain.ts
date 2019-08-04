import { NavGrid } from './NavGrid';
import { RectangleCollider } from '../../Components/RectangleCollider';
import { WeightedGraphCell } from '../Interfaces/WeightedGraphCell';
import { RenderableBackground } from '../Interfaces/RenderableBackground';

export class Terrain implements RenderableBackground {
    
    public readonly terrainImage: HTMLImageElement;
    public readonly navGrid: NavGrid;
    public readonly terrainColliders: RectangleCollider[];


    public constructor(terrainImage: HTMLImageElement, navGrid: NavGrid, terrainColliders: RectangleCollider[]) {
        this.terrainImage = terrainImage;
        this.navGrid = navGrid;
        this.terrainColliders = terrainColliders;
    }

    public renderBackground(context: CanvasRenderingContext2D): void {
        context.drawImage(this.terrainImage, 0, 0);
    }
}