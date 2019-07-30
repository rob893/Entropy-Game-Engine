import { IScene } from "../../GameEngine/Core/Interfaces/IScene";
import { IRenderableBackground } from "../../GameEngine/Core/Interfaces/IRenderableBackground";
import { ITerrainSpec } from "../../GameEngine/Core/Interfaces/ITerrainSpec";
import { GameObject } from "../../GameEngine/Core/GameObject";

export class Scene1 implements IScene {
    
    public name: string = 'Scene1';
    public loadOrder: number = 1;
    public skybox: IRenderableBackground;
    public terrainSpec: ITerrainSpec;
    public startingGameObjects: GameObject[];

    public constructor() {
        
    }
}