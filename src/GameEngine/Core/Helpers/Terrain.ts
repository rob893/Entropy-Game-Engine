import { NavGrid } from "./NavGrid";
import { RectangleCollider } from "../../Components/RectangleCollider";
import { IWeightedGraphCell } from "../Interfaces/IWeightedGraphCell";

export class Terrain {
    
    public readonly terrainImage: HTMLImageElement;
    public readonly navGrid: NavGrid<IWeightedGraphCell>;
    public readonly terrainColliders: RectangleCollider[];


    public constructor(terrainImage: HTMLImageElement, navGrid: NavGrid<IWeightedGraphCell>, terrainColliders: RectangleCollider[]) {
        this.terrainImage = terrainImage;
        this.navGrid = navGrid;
        this.terrainColliders = terrainColliders;
    }
}