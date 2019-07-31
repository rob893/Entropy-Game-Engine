import { IScene } from "../../GameEngine/Core/Interfaces/IScene";
import { IRenderableBackground } from "../../GameEngine/Core/Interfaces/IRenderableBackground";
import { ITerrainSpec } from "../../GameEngine/Core/Interfaces/ITerrainSpec";
import { GameObject } from "../../GameEngine/Core/GameObject";
import { Scene1TerrainSpec } from "../Terrains/Scene1TerrainSpec";
import { RectangleBackground } from "../../GameEngine/Core/Helpers/RectangleBackground";
import { Color } from "../../GameEngine/Core/Enums/Color";
import { GameManagerObject } from "../GameObjects/GameManagerObject";
import { Trump } from "../GameObjects/Trump";

export class Scene1 implements IScene {
    
    public readonly name: string = 'Scene1';
    public readonly loadOrder: number = 1;
    public readonly terrainSpec: ITerrainSpec = new Scene1TerrainSpec(3);


    public getSkybox(gameCanvas: HTMLCanvasElement): IRenderableBackground {
        return new RectangleBackground(gameCanvas, Color.Black);
    }

    public getStartingGameObjects(): GameObject[] {
        return [
            new GameManagerObject("GameManager"),
            new Trump("trump")
        ];
    }
}