class GameEngine {
    constructor() {
        this.gameObjects = [];
        this.gameInitialized = false;
        this.paused = false;
        this.gameInitialized = false;
        this.physicsEngine = Physics.Instance;
    }
    static get Instance() {
        return this.instance || (this.instance = new GameEngine());
    }
    initializeGame(gameCanvas, gameObjects, background) {
        this.background = background;
        this.setGameCanvas(gameCanvas);
        this.setGameObjects(gameObjects);
        this.gameInitialized = true;
    }
    startGame() {
        if (!this.gameInitialized) {
            throw new Error("The game is not initialized yet!");
        }
        Time.start();
        this.paused = false;
        for (let i = 0; i < gameObjects.length; i++) {
            gameObjects[i].start();
        }
        requestAnimationFrame(() => this.gameLoop());
    }
    instantiate(newGameObject) {
        this.gameObjects.push(newGameObject);
        newGameObject.start();
        return newGameObject;
    }
    getGameObjectById(id) {
        for (let i = 0; i < this.gameObjects.length; i++) {
            if (gameObjects[i].id === id) {
                return gameObjects[i];
            }
        }
        throw new Error("No GameObject with id of " + id + " exists!");
    }
    getGameCanvas() {
        return this.gameCanvas;
    }
    getGameCanvasContext() {
        return this.canvasContext;
    }
    printGameData() {
        console.log(this);
        console.log("Time since game start " + Time.TotalTime + "s");
        for (let i = 0; i < this.gameObjects.length; i++) {
            console.log(this.gameObjects[i]);
        }
    }
    togglePause() {
        this.paused = !this.paused;
    }
    setGameCanvas(gameCanvas) {
        this.gameCanvas = gameCanvas;
        this.canvasContext = this.gameCanvas.getContext("2d");
    }
    setGameObjects(gameObjects) {
        this.gameObjects = gameObjects;
    }
    update() {
        Time.updateTime();
        this.physicsEngine.updatePhysics();
        for (let i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].update();
        }
    }
    renderBackground() {
        this.background.render();
    }
    gameLoop() {
        if (!this.paused) {
            this.renderBackground();
            this.update();
        }
        requestAnimationFrame(() => this.gameLoop());
    }
}
class GameObject {
    constructor(id, x = 0, y = 0, width = 0, height = 0) {
        this.components = [];
        this.id = id;
        this.transform = new Transform(this, x, y, width, height);
    }
    start() {
        this.gameCanvas = GameEngine.Instance.getGameCanvas();
        this.canvasContext = gameCanvas.getContext("2d");
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].start();
        }
    }
    update() {
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].update();
        }
    }
    getTransform() {
        return this.transform;
    }
    getGameCanvas() {
        return this.gameCanvas;
    }
    getComponent(componentType) {
        componentType = componentType.toLowerCase();
        for (let i = 0; i < this.components.length; i++) {
            if (this.components[i].componentName.toLowerCase() === componentType) {
                return this.components[i];
            }
        }
        throw new Error(componentType + " not found on the GameObject with id of " + this.id + "!");
    }
    setComponents(components) {
        this.components = components;
    }
}
class ImageBackground {
    constructor(gameCanvas, imageSrc) {
        this.image = new Image(gameCanvas.width, gameCanvas.height);
        this.image.src = imageSrc;
        this.canvasContext = gameCanvas.getContext("2d");
        this.gameCanvas = gameCanvas;
    }
    render() {
        this.canvasContext.drawImage(this.image, 0, 0, this.gameCanvas.width, this.gameCanvas.height);
    }
}
class Physics {
    constructor() {
        this.rigidbodies = [];
        this.colliders = [];
        this.gravity = 1;
    }
    static get Instance() {
        return this.instance || (this.instance = new Physics());
    }
    updatePhysics() {
        for (let i = 0, l = this.rigidbodies.length; i < l; i++) {
            this.rigidbodies[i].addGravity(this.gravity);
        }
    }
    addRigidbody(rb) {
        this.rigidbodies.push(rb);
    }
    static raycast() { }
    static sphereCast() { }
    static overlapSphere() { return []; }
}
class RectangleBackground {
    constructor(gameCanvas, color) {
        this.color = color;
        this.canvasContext = gameCanvas.getContext("2d");
        this.gameCanvas = gameCanvas;
    }
    render() {
        this.canvasContext.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
        this.canvasContext.fillStyle = this.color;
        this.canvasContext.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
    }
}
class Time {
    static get DeltaTime() {
        return this.deltaTime;
    }
    static get TotalTime() {
        return (Date.now() - this.startTime) / 1000;
    }
    static start() {
        this.prevTime = Date.now();
        this.startTime = this.prevTime;
    }
    static updateTime() {
        this.deltaTime = (Date.now() - this.prevTime) / 1000;
        this.prevTime = Date.now();
    }
}
Time.deltaTime = 0;
Time.startTime = 0;
Time.prevTime = 0;
class Vector2 {
    constructor(x, y) {
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
    }
    static distance(point1, point2) {
        let distanceX = point1.x - point2.x;
        let distanceY = point1.y - point2.y;
        return Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));
    }
}
var Keys;
(function (Keys) {
    Keys[Keys["UP"] = 38] = "UP";
    Keys[Keys["DOWN"] = 40] = "DOWN";
    Keys[Keys["LEFT"] = 37] = "LEFT";
    Keys[Keys["RIGHT"] = 39] = "RIGHT";
})(Keys || (Keys = {}));
class LiteEvent {
    constructor() {
        this.handlers = [];
    }
    add(handler) {
        this.handlers.push(handler);
    }
    remove(handler) {
        this.handlers = this.handlers.filter(h => h !== handler);
    }
    trigger(data) {
        this.handlers.slice(0).forEach(h => h(data));
    }
    expose() {
        return this;
    }
}
class Component {
    constructor(componentName, gameObject) {
        this.gameObject = gameObject;
        this.componentName = componentName;
    }
    start() { }
    ;
    update() { }
    ;
}
class Animator extends Component {
    constructor(gameObject, spriteSheetURL, numberOfFrames, numberOfRows) {
        super("Animator", gameObject);
        this.frameWidth = 0;
        this.frameHeight = 0;
        this.numberOfFrames = 0;
        this.numberOfRows = 0;
        this.frameIndex = 0;
        this.framesPerAnimationFrame = 10;
        this.animationFrameCount = 0;
        this.spriteReady = false;
        this.spriteSheet = new Image();
        this.spriteSheet.src = spriteSheetURL;
        this.spriteSheet.onload = () => { this.spriteReady = true; };
        this.numberOfFrames = numberOfFrames;
        this.numberOfRows = numberOfRows;
    }
    start() {
        this.canvasContext = this.gameObject.getGameCanvas().getContext("2d");
        this.transform = this.gameObject.getTransform();
    }
    update() {
        this.drawSprite();
    }
    setAnimationSpeed(numberOfFramesPerAnimationFrame) {
        this.framesPerAnimationFrame = numberOfFramesPerAnimationFrame;
    }
    drawSprite() {
        if (!this.spriteReady) {
            return;
        }
        this.animationFrameCount++;
        if (this.animationFrameCount >= this.framesPerAnimationFrame) {
            this.frameIndex = (this.frameIndex + 1) % this.numberOfFrames;
            this.animationFrameCount = 0;
        }
        this.frameHeight = this.spriteSheet.height / this.numberOfRows;
        this.frameWidth = this.spriteSheet.width / this.numberOfFrames;
        this.canvasContext.drawImage(this.spriteSheet, this.frameIndex * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.transform.position.x, this.transform.position.y, this.transform.width, this.transform.height);
    }
}
class RectangleCollider extends Component {
    constructor(gameObject) {
        super("RectangleCollider", gameObject);
        this.onCollide = new LiteEvent();
        this.transform = gameObject.getTransform();
        let transform = this.transform;
        transform.onMoved.add(() => this.onTransformMoved());
        this.topLeft = new Vector2(transform.position.x, transform.position.y);
        this.topRight = new Vector2(transform.position.x + transform.width, transform.position.y);
        this.bottomLeft = new Vector2(transform.position.x, transform.position.y + transform.height);
        this.bottomRight = new Vector2(transform.position.x + transform.width, transform.position.y + transform.height);
    }
    detectCollision(other) {
        if (!(other.topLeft.x > this.topRight.x ||
            other.topRight.x < this.topLeft.x ||
            other.topLeft.y > this.bottomLeft.y ||
            other.bottomLeft.y < this.topLeft.y)) {
            this.onCollide.trigger(other);
            return true;
        }
        return false;
    }
    get onCollided() {
        return this.onCollide.expose();
    }
    onTransformMoved() {
        this.topLeft.x = this.transform.position.x;
        this.topLeft.y = this.transform.position.y;
        this.topRight.x = this.transform.position.x + this.transform.width;
        this.topRight.y = this.transform.position.y;
        this.bottomLeft.x = this.transform.position.x;
        this.bottomLeft.y = this.transform.position.y + this.transform.height;
        this.bottomRight.x = this.transform.position.x + this.transform.width;
        this.bottomRight.y = this.transform.position.y + this.transform.height;
    }
}
class RectangleRenderer extends Component {
    constructor(gameObject, color) {
        super("RectangleRenderer", gameObject);
        this.transform = gameObject.getTransform();
        this.color = color;
    }
    start() {
        this.gameCanvas = this.gameObject.getGameCanvas();
        this.canvasContext = this.gameCanvas.getContext("2d");
    }
    update() {
        this.render();
    }
    setColor(color) {
        this.color = color;
    }
    render() {
        this.canvasContext.fillStyle = this.color;
        this.canvasContext.fillRect(this.transform.position.x, this.transform.position.y, this.transform.width, this.transform.height);
    }
}
class Rigidbody extends Component {
    constructor(gameObject) {
        super("Rigidbody", gameObject);
        this.transform = gameObject.getTransform();
        Physics.Instance.addRigidbody(this);
    }
    addGravity(force) {
        this.transform.translate(0, 1, force);
    }
}
class Transform extends Component {
    constructor(gameObject, x, y, width, height) {
        super("Transform", gameObject);
        this.width = 0;
        this.height = 0;
        this.onMove = new LiteEvent();
        this.width = width;
        this.height = height;
        this.position = new Vector2(x, y);
    }
    translate(xVelocity, yVelocity, speed) {
        this.position.x += xVelocity * speed;
        this.position.y += yVelocity * speed;
        this.onMove.trigger();
    }
    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
        this.onMove.trigger();
    }
    get onMoved() {
        return this.onMove.expose();
    }
    getCenter() {
        return new Vector2(this.position.x + (this.width / 2), this.position.y + (this.height / 2));
    }
    getBottomCenter() {
        return new Vector2(this.position.x + (this.width / 2), this.position.y + this.height);
    }
}
class Motor extends Component {
    constructor(componentName, gameObject) {
        super(componentName, gameObject);
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.speed = 5;
        this.transform = gameObject.getTransform();
    }
    start() {
        this.gameCanvas = this.gameObject.getGameCanvas();
    }
    update() {
        this.move();
        this.handleOutOfBounds();
    }
}
class BallMotor extends Motor {
    constructor(gameObject) {
        super("BallMotor", gameObject);
        this.reset();
    }
    start() {
        super.start();
        this.collider = this.gameObject.getComponent("RectangleCollider");
        this.playerCollider = GameEngine.Instance.getGameObjectById("player").getComponent("RectangleCollider");
        this.computerCollider = GameEngine.Instance.getGameObjectById("computer").getComponent("RectangleCollider");
    }
    update() {
        super.update();
        this.handleCollisions();
    }
    whoIHit(other) {
        console.log("I hit " + other.gameObject.id);
    }
    handleOutOfBounds() {
        if (this.transform.position.y <= 0) {
            this.yVelocity = Math.abs(this.yVelocity);
        }
        else if (this.transform.position.y >= this.gameCanvas.height - this.transform.height) {
            this.yVelocity *= -1;
        }
        if (this.transform.position.x + this.transform.width <= 0) {
            this.reset();
        }
        else if (this.transform.position.x >= this.gameCanvas.width) {
            this.reset();
        }
    }
    move() {
        this.transform.translate(this.xVelocity, this.yVelocity, this.speed);
    }
    reset() {
        this.transform.setPosition(345, 195);
        this.xVelocity = Math.random() < 0.5 ? -1 : 1;
        this.yVelocity = Math.random() < 0.5 ? -1 : 1;
        this.speed = 3;
    }
    handleCollisions() {
        if (this.collider.detectCollision(this.playerCollider)) {
            this.xVelocity = 1;
            this.speed += 0.125;
        }
        else if (this.collider.detectCollision(this.computerCollider)) {
            this.xVelocity = -1;
            this.speed += 0.125;
        }
    }
}
class ComputerMotor extends Motor {
    constructor(gameObject) {
        super("ComputerMotor", gameObject);
        this.timer = 0;
        this.yVelocity = 1;
    }
    start() {
        super.start();
        this.ballTransform = GameEngine.Instance.getGameObjectById("ball").getTransform();
        this.quarterFieldX = this.gameCanvas.width / 4;
        this.midFieldY = this.gameCanvas.height / 2;
    }
    handleOutOfBounds() {
        if (this.transform.position.y <= 0) {
            this.yVelocity = 1;
        }
        else if (this.transform.position.y >= this.gameCanvas.height - this.transform.height) {
            this.yVelocity = -1;
        }
    }
    move() {
        if (this.ballTransform.position.x < this.quarterFieldX) {
            if (this.transform.position.y > this.midFieldY + 5) {
                this.yVelocity = -1;
            }
            else if (this.transform.position.y < this.midFieldY - 5) {
                this.yVelocity = 1;
            }
            else {
                this.yVelocity = 0;
            }
        }
        else {
            this.timer += Time.DeltaTime;
            if (this.timer > 0.15) {
                if (this.transform.getCenter().y < this.ballTransform.getCenter().y - 10) {
                    this.yVelocity = 1;
                }
                else if (this.transform.getCenter().y > this.ballTransform.getCenter().y + 10) {
                    this.yVelocity = -1;
                }
                else {
                    this.yVelocity = 0;
                }
                this.timer = 0;
            }
        }
        this.transform.translate(this.xVelocity, this.yVelocity, this.speed);
    }
}
class GameManager extends Component {
    constructor(componentName, gameObject) {
        super(componentName, gameObject);
        document.getElementById("print-button").addEventListener("click", () => this.printGameData());
        document.getElementById("pause-button").addEventListener("click", () => this.togglePause());
        document.getElementById("add-ball").addEventListener("click", () => this.testInstantiate());
    }
    start() {
        this.player = GameEngine.Instance.getGameObjectById("player");
        try {
            this.playerRenderer = this.player.getComponent("RectangleRenderer");
            document.getElementById("white-button").addEventListener("click", () => this.setPlayerColor("white"));
            document.getElementById("red-button").addEventListener("click", () => this.setPlayerColor("red"));
            document.getElementById("blue-button").addEventListener("click", () => this.setPlayerColor("blue"));
            document.getElementById("green-button").addEventListener("click", () => this.setPlayerColor("green"));
        }
        catch (_a) {
            console.log("The player does not have a rectangle renderer!");
        }
    }
    static get Instance() {
        if (this.instance === null || this.instance === undefined) {
            throw new Error("GameManager has not been created yet. Use the createInstance method first.");
        }
        return this.instance;
    }
    static createInstance(componentName, gameObject) {
        if (this.instance === null || this.instance === undefined) {
            this.instance = new GameManager(componentName, gameObject);
            return this.instance;
        }
        throw new Error("More than one GameManager cannot be created!");
    }
    togglePause() {
        GameEngine.Instance.togglePause();
    }
    printGameData() {
        GameEngine.Instance.printGameData();
    }
    testInstantiate() {
        GameEngine.Instance.instantiate(new Ball("ball2"));
    }
    setPlayerColor(color) {
        this.playerRenderer.setColor(color);
    }
}
class PlayerMotor extends Motor {
    constructor(gameObject) {
        super("PlayerMotor", gameObject);
        this.movingUp = false;
        this.movingDown = false;
        this.movingRight = false;
        this.movingLeft = false;
        document.addEventListener('keydown', () => this.onKeyDown(event));
        document.addEventListener('keyup', () => this.onKeyUp(event));
    }
    handleOutOfBounds() {
        if (this.transform.position.y <= 0) {
            this.transform.position.y = 0;
        }
        else if (this.transform.position.y + this.transform.height >= this.gameCanvas.height) {
            this.transform.position.y = this.gameCanvas.height - this.transform.height;
        }
        if (this.transform.position.x <= 0) {
            this.transform.position.x = 0;
        }
        else if (this.transform.position.x + this.transform.width >= this.gameCanvas.width) {
            this.transform.position.x = this.gameCanvas.width - this.transform.width;
        }
    }
    move() {
        this.xVelocity = 0;
        this.yVelocity = 0;
        if (this.movingUp) {
            this.yVelocity = -1;
        }
        else if (this.movingDown) {
            this.yVelocity = 1;
        }
        if (this.movingRight) {
            this.xVelocity = 1;
        }
        else if (this.movingLeft) {
            this.xVelocity = -1;
        }
        this.transform.translate(this.xVelocity, this.yVelocity, this.speed);
    }
    onKeyDown(event) {
        if (event.keyCode == Keys.UP) {
            this.movingUp = true;
            this.movingDown = false;
        }
        else if (event.keyCode == Keys.DOWN) {
            this.movingDown = true;
            this.movingUp = false;
        }
        if (event.keyCode == Keys.RIGHT) {
            this.movingRight = true;
            this.movingLeft = false;
        }
        else if (event.keyCode == Keys.LEFT) {
            this.movingRight = false;
            this.movingLeft = true;
        }
    }
    onKeyUp(event) {
        if (event.keyCode == Keys.UP) {
            this.movingUp = false;
        }
        else if (event.keyCode == Keys.DOWN) {
            this.movingDown = false;
        }
        if (event.keyCode == Keys.RIGHT) {
            this.movingRight = false;
        }
        else if (event.keyCode == Keys.LEFT) {
            this.movingLeft = false;
        }
    }
}
class Ball extends GameObject {
    constructor(id) {
        super(id, 345, 195, 10, 10);
        let ballComponents = [];
        ballComponents.push(new RectangleCollider(this));
        ballComponents.push(new BallMotor(this));
        ballComponents.push(new RectangleRenderer(this, "white"));
        this.setComponents(ballComponents);
    }
}
class Computer extends GameObject {
    constructor(id) {
        super(id, 688, 175, 10, 50);
        let computerComponents = [];
        computerComponents.push(new RectangleCollider(this));
        computerComponents.push(new ComputerMotor(this));
        computerComponents.push(new RectangleRenderer(this, "white"));
        this.setComponents(computerComponents);
    }
}
class GameManagerObject extends GameObject {
    constructor(id) {
        super(id, 0, 0, 0, 0);
        let gameManagerComponents = [];
        let gameManager = GameManager.createInstance(id, this);
        gameManagerComponents.push(gameManager);
        this.setComponents(gameManagerComponents);
    }
}
class Player extends GameObject {
    constructor(id) {
        super(id, 2, 175, 10, 50);
        let playerComponents = [];
        playerComponents.push(new RectangleCollider(this));
        playerComponents.push(new PlayerMotor(this));
        playerComponents.push(new Rigidbody(this));
        playerComponents.push(new Animator(this, "./src/Mario/Resources/mario.png", 4, 1));
        this.setComponents(playerComponents);
    }
}
let gameEngine = GameEngine.Instance;
let gameCanvas = document.getElementById("game-canvas");
let background = new ImageBackground(gameCanvas, './src/Mario/Resources/background.png');
let gameManager = new GameManagerObject("GameManager");
let player = new Player("player");
let ball = new Ball("ball");
let computer = new Computer("computer");
let gameObjects = [gameManager, player, computer, ball];
gameEngine.initializeGame(gameCanvas, gameObjects, background);
gameEngine.startGame();
//# sourceMappingURL=game.js.map