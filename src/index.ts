import { GameEngine } from "./GameEngine/Core/GameEngine";
import { Scene1 } from "./TestGame/Scenes/Scene1";
import { Scene2 } from "./TestGame/Scenes/Scene2";


const main = async (): Promise<void> => {
    const gameCanvas = <HTMLCanvasElement>document.getElementById("game-canvas");
    const gameEngine = GameEngine.buildGameEngine(gameCanvas);

    gameEngine.renderingEngine.renderGizmos = true;

    gameEngine.setScenes([new Scene1(), new Scene2]);

    gameEngine.loadScene(1);
}

main();