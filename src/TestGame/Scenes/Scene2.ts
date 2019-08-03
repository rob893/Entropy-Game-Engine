import { Scene } from '../../GameEngine/Core/Interfaces/Scene';
import { RenderableBackground } from '../../GameEngine/Core/Interfaces/RenderableBackground';
import { TerrainSpec } from '../../GameEngine/Core/Interfaces/TerrainSpec';
import { GameObject } from '../../GameEngine/Core/GameObject';
import { GameManagerObject } from '../GameObjects/GameManagerObject';
import { Player } from '../GameObjects/Player';
import { ImageBackground } from '../../GameEngine/Core/Helpers/ImageBackground';
import Background from '../Assets/Images/background.png';

export class Scene2 implements Scene {
    
    public readonly name: string = 'Scene2';
    public readonly loadOrder: number = 2;
    public readonly terrainSpec: TerrainSpec = null;


    public getSkybox(gameCanvas: HTMLCanvasElement): RenderableBackground {
        return new ImageBackground(gameCanvas, Background);
    }

    public getStartingGameObjects(): GameObject[] {
        return [
            new GameManagerObject('GameManager'),
            new Player('player')
        ];
    }
}