import { IScene } from "../../GameEngine/Core/Interfaces/IScene";
import { IRenderableBackground } from "../../GameEngine/Core/Interfaces/IRenderableBackground";
import { ITerrainSpec } from "../../GameEngine/Core/Interfaces/ITerrainSpec";
import { GameObject } from "../../GameEngine/Core/GameObject";
import { GameManagerObject } from "../GameObjects/GameManagerObject";
import { Player } from "../GameObjects/Player";
import { ImageBackground } from "../../GameEngine/Core/Helpers/ImageBackground";
import Background from "../Assets/Images/background.png";

export class Scene2 implements IScene {
    
    public readonly name: string = 'Scene2';
    public readonly loadOrder: number = 2;
    public readonly terrainSpec: ITerrainSpec = null;


    public getSkybox(gameCanvas: HTMLCanvasElement): IRenderableBackground {
        return new ImageBackground(gameCanvas, Background);
    }

    public getStartingGameObjects(): GameObject[] {
        return [
            new GameManagerObject("GameManager"),
            new Player('player')
        ];
    }
}