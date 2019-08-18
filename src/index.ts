import { GameEngine } from './GameEngine/Core/GameEngine';
import { scene1, scene2, scene3 } from './TestGame/Scenes';
import { Color } from './GameEngine/Core/Enums/Color';


const main = async (): Promise<void> => {
    const bodyElement = document.getElementById('body') as HTMLBodyElement;

    bodyElement.style.backgroundColor = Color.BlueGrey;

    const gameCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    const gameEngine = GameEngine.buildGameEngine(gameCanvas);

    //gameEngine.renderingEngine.renderGizmos = true;

    gameEngine.setScenes([scene1, scene2, scene3]);

    await gameEngine.loadScene(3);
};

main();