import { GameObject } from "../GameObject";
import { IRenderableBackground } from "./IRenderableBackground";
import { ITerrainSpec } from "./ITerrainSpec";

export interface IScene {
    name: string;
    loadOrder: number;
    terrainSpec: ITerrainSpec;
    getSkybox(gameCanvas: HTMLCanvasElement): IRenderableBackground;
    getStartingGameObjects(): GameObject[];
}