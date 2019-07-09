/// <reference path="./../GameEngine/Core/RectangleBackground.ts" />
/// <reference path="./../GameEngine/Core/ImageBackground.ts" />
/// <reference path="./GameObjects/GameManagerObject.ts" />
/// <reference path="./GameObjects/Player.ts" />
/// <reference path="./GameObjects/Ball.ts" />
/// <reference path="./GameObjects/Computer.ts" />

let gameEngine: GameEngine = GameEngine.Instance;

let gameCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("game-canvas");

let background: ImageBackground = new ImageBackground(gameCanvas, './src/Mario/Resources/background.png');

let gameManager: GameManagerObject = new GameManagerObject("GameManager");

let player: Player = new Player("player");
let ball: Ball = new Ball("ball");
let computer: Computer = new Computer("computer");

let gameObjects: GameObject[] = [gameManager, player, computer, ball];

gameEngine.initializeGame(gameCanvas, gameObjects, background);

gameEngine.startGame();