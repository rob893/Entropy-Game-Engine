import { GameEngine } from "./GameEngine/Core/GameEngine";
import { ImageBackground } from "./GameEngine/Core/ImageBackground";
import { GameManagerObject } from "./Mario/GameObjects/GameManagerObject";
import { Player } from "./Mario/GameObjects/Player";
import { Ball } from "./Mario/GameObjects/Ball";
import { Computer } from "./Mario/GameObjects/Computer";
import { GameObject } from "./GameEngine/Core/GameObject";
import Background from "./assets/images/background.png";
import { Trump } from "./Mario/GameObjects/Trump";
import { RenderingEngine } from "./GameEngine/Core/RenderingEngine";
import { Ground } from "./Mario/GameObjects/Ground";
import { Colors } from "./GameEngine/Core/Helpers/Colors";


let gameEngine: GameEngine = GameEngine.instance;

RenderingEngine.instance.renderGizmos = true;

let gameCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("game-canvas");

let background: ImageBackground = new ImageBackground(gameCanvas, Background);

let gameManager: GameManagerObject = new GameManagerObject("GameManager");

let player: Player = new Player("player");
let ball: Ball = new Ball("ball");
let computer: Computer = new Computer("computer");
let trump: Trump = new Trump("trump");
let ground = new Ground(350, 400, 700, 55, Colors.BROWN);
let ground2 = new Ground(400, 270, 100, 10, Colors.BROWN);

let gameObjects: GameObject[] = [gameManager, player, computer, ball, trump, ground, ground2];

gameEngine.initializeGame(gameCanvas, gameObjects, background);

gameEngine.startGame();