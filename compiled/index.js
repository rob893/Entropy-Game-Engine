import { GameEngine } from "./GameEngine/Core/GameEngine";
import { GameManagerObject } from "./Mario/GameObjects/GameManagerObject";
import { RenderingEngine } from "./GameEngine/Core/RenderingEngine";
import { Color } from "./GameEngine/Core/Enums/Color";
import { RectangleBackground } from "./GameEngine/Core/Helpers/RectangleBackground";
let gameCanvas = document.getElementById("game-canvas");
let gameEngine = GameEngine.buildGameEngine(gameCanvas);
RenderingEngine.instance.renderGizmos = true;
let background = new RectangleBackground(gameCanvas, Color.Black);
let gameManager = new GameManagerObject("GameManager");
let gameObjects = [];
gameEngine.initializeGame(gameObjects, background);
gameEngine.startGame();
//# sourceMappingURL=index.js.map