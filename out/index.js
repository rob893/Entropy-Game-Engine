import { GameEngine } from "./GameEngine/Core/GameEngine";
import { ImageBackground } from "./GameEngine/Core/ImageBackground";
import { GameManagerObject } from "./Mario/GameObjects/GameManagerObject";
import { Player } from "./Mario/GameObjects/Player";
import { Ball } from "./Mario/GameObjects/Ball";
import { Computer } from "./Mario/GameObjects/Computer";
import Background from "./assets/background.png";
let gameEngine = GameEngine.Instance;
let gameCanvas = document.getElementById("game-canvas");
let background = new ImageBackground(gameCanvas, Background);
let gameManager = new GameManagerObject("GameManager");
let player = new Player("player");
let ball = new Ball("ball");
let computer = new Computer("computer");
let gameObjects = [gameManager, player, computer, ball];
gameEngine.initializeGame(gameCanvas, gameObjects, background);
gameEngine.startGame();
//# sourceMappingURL=index.js.map