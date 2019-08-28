import { GameEngine } from './GameEngine/Core/GameEngine';
import { scene1, scene2, scene3 } from './TestGame/Scenes';
import { Color } from './GameEngine/Core/Enums/Color';


async function main(): Promise<void> {
    const bodyElement = document.getElementById('body') as HTMLBodyElement;

    bodyElement.style.backgroundColor = Color.BlueGrey;

    const gameCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    const gameEngine = new GameEngine(gameCanvas);

    gameEngine.setScenes([scene1, scene2, scene3]);

    await gameEngine.loadScene(3);
}

window.onload = () => {
    main();
};