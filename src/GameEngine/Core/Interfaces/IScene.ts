import { GameObject } from "../GameObject";
import { IRenderableBackground } from "./IRenderableBackground";
import { ITerrainSpec } from "./ITerrainSpec";

export interface IScene {
    name: string;
    loadOrder: number;
    skybox: IRenderableBackground;
    terrainSpec: ITerrainSpec;
    startingGameObjects: GameObject[];
}