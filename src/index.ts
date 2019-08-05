import { GameEngine } from './GameEngine/Core/GameEngine';
import { Scene1 } from './TestGame/Scenes/Scene1';
import { Scene2 } from './TestGame/Scenes/Scene2';
import { Color } from './GameEngine/Core/Enums/Color';


const main = async (): Promise<void> => {
    const bodyElement = document.getElementById('body') as HTMLBodyElement;

    bodyElement.style.backgroundColor = Color.BlueGrey;

    const gameCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    const gameEngine = GameEngine.buildGameEngine(gameCanvas);

    gameEngine.renderingEngine.renderGizmos = true;

    gameEngine.setScenes([new Scene1(), new Scene2]);

    await gameEngine.loadScene(1);
};

main();