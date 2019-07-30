import { NavGrid } from "./NavGrid";
import { RectangleCollider } from "../../Components/RectangleCollider";
import { IWeightedGraphCell } from "../Interfaces/IWeightedGraphCell";
import { IRenderableBackground } from "../Interfaces/IRenderableBackground";

export class Terrain implements IRenderableBackground {
    
    public readonly terrainImage: HTMLImageElement;
    public readonly navGrid: NavGrid<IWeightedGraphCell>;
    public readonly terrainColliders: RectangleCollider[];


    public constructor(terrainImage: HTMLImageElement, navGrid: NavGrid<IWeightedGraphCell>, terrainColliders: RectangleCollider[]) {
        this.terrainImage = terrainImage;
        this.navGrid = navGrid;
        this.terrainColliders = terrainColliders;
    }

    public renderBackground(context: CanvasRenderingContext2D): void {
        context.drawImage(this.terrainImage, 0, 0);
    }
}