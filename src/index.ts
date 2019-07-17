import { GameEngine } from "./GameEngine/Core/GameEngine";
import { ImageBackground } from "./GameEngine/Core/ImageBackground";
import { GameManagerObject } from "./Mario/GameObjects/GameManagerObject";
import { Player } from "./Mario/GameObjects/Player";
import { Ball } from "./Mario/GameObjects/Ball";
import { Computer } from "./Mario/GameObjects/Computer";
import { GameObject } from "./GameEngine/Core/GameObject";
import Background from "./assets/images/background.png";
import { Trump } from "./Mario/GameObjects/Trump";


let gameEngine: GameEngine = GameEngine.Instance;

let gameCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("game-canvas");

let background: ImageBackground = new ImageBackground(gameCanvas, Background);

let gameManager: GameManagerObject = new GameManagerObject("GameManager");

let player: Player = new Player("player");
let ball: Ball = new Ball("ball");
let computer: Computer = new Computer("computer");
let trump: Trump = new Trump("trump");

let gameObjects: GameObject[] = [gameManager, player, computer, ball, trump];

gameEngine.initializeGame(gameCanvas, gameObjects, background);

gameEngine.startGame();