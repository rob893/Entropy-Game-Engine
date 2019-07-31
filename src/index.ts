import { GameEngine } from "./GameEngine/Core/GameEngine";
import { RenderingEngine } from "./GameEngine/Core/RenderingEngine";
import { Scene1 } from "./TestGame/Scenes/Scene1";


const main = async (): Promise<void> => {
    const gameCanvas = <HTMLCanvasElement>document.getElementById("game-canvas");
    const gameEngine = GameEngine.buildGameEngine(gameCanvas);

    RenderingEngine.instance.renderGizmos = true;

    gameEngine.setScenes([new Scene1()]);

    gameEngine.loadScene(1);
}

main();