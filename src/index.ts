import { GameEngine } from "./GameEngine/Core/GameEngine";
import { ImageBackground } from "./GameEngine/Core/ImageBackground";
import { GameManagerObject } from "./Mario/GameObjects/GameManagerObject";
import { Player } from "./Mario/GameObjects/Player";
import { Ball } from "./Mario/GameObjects/Ball";
import { Computer } from "./Mario/GameObjects/Computer";
import { GameObject } from "./GameEngine/Core/GameObject";


let gameEngine: GameEngine = GameEngine.Instance;

let gameCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("game-canvas");

let background: ImageBackground = new ImageBackground(gameCanvas, './assets/background.png');

let gameManager: GameManagerObject = new GameManagerObject("GameManager");

let player: Player = new Player("player");
let ball: Ball = new Ball("ball");
let computer: Computer = new Computer("computer");

let gameObjects: GameObject[] = [gameManager, player, computer, ball];

gameEngine.initializeGame(gameCanvas, gameObjects, background);

gameEngine.startGame();