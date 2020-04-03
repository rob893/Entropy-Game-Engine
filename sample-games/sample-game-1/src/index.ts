import { GameEngine, Color } from '@rherber/entropy-game-engine';
import { scene1, scene3 } from './Scenes';

async function main(): Promise<void> {
    const bodyElement = document.getElementById('body') as HTMLBodyElement;

    bodyElement.style.backgroundColor = Color.BlueGrey;

    const gameCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    const gameEngine = new GameEngine(gameCanvas);

    gameEngine.developmentMode = true;

    gameEngine.setScenes([scene1, scene3]);

    await gameEngine.loadScene(1);
}

window.onload = () => {
    main();
};
