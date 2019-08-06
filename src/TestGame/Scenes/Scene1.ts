import { Scene } from '../../GameEngine/Core/Interfaces/Scene';
import { RenderableBackground } from '../../GameEngine/Core/Interfaces/RenderableBackground';
import { TerrainSpec } from '../../GameEngine/Core/Interfaces/TerrainSpec';
import { GameObject } from '../../GameEngine/Core/GameObject';
import { Scene1TerrainSpec } from '../Terrains/Scene1TerrainSpec';
import { RectangleBackground } from '../../GameEngine/Core/Helpers/RectangleBackground';
import { Color } from '../../GameEngine/Core/Enums/Color';
import { GameManagerObject } from '../GameObjects/GameManagerObject';
import { Trump } from '../GameObjects/Trump';
import { Player } from '../GameObjects/Player';
import { Player2 } from '../GameObjects/Player2';

export class Scene1 implements Scene {
    
    public readonly name: string = 'Scene1';
    public readonly loadOrder: number = 1;
    public readonly terrainSpec: TerrainSpec = new Scene1TerrainSpec(3);


    public getSkybox(gameCanvas: HTMLCanvasElement): RenderableBackground {
        return new RectangleBackground(gameCanvas, Color.Black);
    }

    public getStartingGameObjects(): GameObject[] {
        return [
            new GameManagerObject('GameManager'),
            new Trump('trump'),
            new Player2('player')
        ];
    }
}