import { Scene } from '../GameEngine/Core/Interfaces/Scene';
import { RenderableBackground } from '../GameEngine/Core/Interfaces/RenderableBackground';
import { GameObject } from '../GameEngine/Core/GameObject';
import { Scene1TerrainSpec } from './Terrains/Scene1TerrainSpec';
import { RectangleBackground } from '../GameEngine/Core/Helpers/RectangleBackground';
import { Color } from '../GameEngine/Core/Enums/Color';
import { GameManagerObject } from './GameObjects/GameManagerObject';
import { Trump } from './GameObjects/Trump';
import { Player } from './GameObjects/Player';
import { Player2 } from './GameObjects/Player2';
import { ImageBackground } from '../GameEngine/Core/Helpers/ImageBackground';
import Scene2Background from './Assets/Images/background.png';
import { PlayerRB } from './GameObjects/PlayerRB';
import { Borders } from './GameObjects/Borders';
import { TrumpRB } from './GameObjects/TrumpRB';
import { GameEngine } from '../GameEngine/Core/GameEngine';
import { Layer } from '../GameEngine/Core/Enums/Layer';
import { GameEngineAPIs } from '../GameEngine/Core/Interfaces/GameEngineAPIs';


export const scene1: Scene = {
    name: 'Scene1',
    loadOrder: 1,
    terrainSpec: new Scene1TerrainSpec(3),

    getSkybox(gameCanvas: HTMLCanvasElement): RectangleBackground {
        return new RectangleBackground(gameCanvas, Color.Black);
    },

    getStartingGameObjects(apis: GameEngineAPIs): GameObject[] {
        return [
            new GameManagerObject(apis, 'gameManager'),
            new Trump(apis, 'trump'),
            new Player2(apis, 'player', 400, 250)
        ];
    }
};

export const scene2: Scene = {
    name: 'Scene2',
    loadOrder: 2,
    terrainSpec: null,

    getSkybox(gameCanvas: HTMLCanvasElement): RenderableBackground {
        return new ImageBackground(gameCanvas, Scene2Background);
    },
    
    getStartingGameObjects(apis: GameEngineAPIs): GameObject[] {
        return [
            new GameManagerObject(apis, 'gameManager'),
            new Player(apis, 'player')
        ];
    }
};

export const scene3: Scene = {
    name: 'Scene3',
    loadOrder: 3,
    terrainSpec: null,

    getSkybox(gameCanvas: HTMLCanvasElement): RectangleBackground {
        return new RectangleBackground(gameCanvas, Color.Black);
    },
    
    getStartingGameObjects(apis: GameEngineAPIs): GameObject[] {
        return [
            new GameManagerObject(apis, 'gameManager'),
            new PlayerRB(apis, 'player'),
            new Borders(apis, 'borders', 0, 0, 0, 'borders', Layer.Terrain),
            //new TrumpRB('trump', 500, 670),
            //new TrumpRB('trump', 570, 670),
            //new TrumpRB('trump', 640, 670),
            //new TrumpRB('trump', 710, 670)
        ];
    }
};