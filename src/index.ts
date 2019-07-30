import { GameEngine } from "./GameEngine/Core/GameEngine";
import { ImageBackground } from "./GameEngine/Core/Helpers/ImageBackground";
import { GameManagerObject } from "./Mario/GameObjects/GameManagerObject";
import { Player } from "./Mario/GameObjects/Player";
import { Ball } from "./Mario/GameObjects/Ball";
import { Computer } from "./Mario/GameObjects/Computer";
import { GameObject } from "./GameEngine/Core/GameObject";
import Background from "./assets/images/background.png";
import { Trump } from "./Mario/GameObjects/Trump";
import { RenderingEngine } from "./GameEngine/Core/RenderingEngine";
import { Ground } from "./Mario/GameObjects/Ground";
import { Color } from "./GameEngine/Core/Enums/Color";
import { RectangleBackground } from "./GameEngine/Core/Helpers/RectangleBackground";
import { TerrainSpec } from "./GameEngine/Core/Helpers/TerrainSpec";

let gameCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("game-canvas");

let gameEngine: GameEngine = GameEngine.buildGameEngine(gameCanvas);

RenderingEngine.instance.renderGizmos = true;

let background = new RectangleBackground(gameCanvas, Color.Black); //new ImageBackground(gameCanvas, Background);

let gameManager: GameManagerObject = new GameManagerObject("GameManager");

//let player: Player = new Player("player");
//let ball: Ball = new Ball("ball");
//let computer: Computer = new Computer("computer");
//let trump: Trump = new Trump("trump");
//let ground = new Ground(350, 400, 700, 55, Color.Brown);
//let ground2 = new Ground(400, 270, 100, 10, Color.Brown);

let gameObjects: GameObject[] = [];//[gameManager, player, computer, ball, trump, ground, ground2];

gameEngine.initializeGame(gameObjects, background, new TerrainSpec(3)).then(() => {
    gameEngine.startGame();
});