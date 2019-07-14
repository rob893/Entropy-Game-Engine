/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/GameEngine/Components/Animator.ts":
/*!***********************************************!*\
  !*** ./src/GameEngine/Components/Animator.ts ***!
  \***********************************************/
/*! exports provided: Animator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Animator", function() { return Animator; });
/* harmony import */ var _Component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Component */ "./src/GameEngine/Components/Component.ts");

class Animator extends _Component__WEBPACK_IMPORTED_MODULE_0__["Component"] {
    constructor(gameObject, spriteSheetURL, numberOfFrames, numberOfRows) {
        super(gameObject);
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


/***/ }),

/***/ "./src/GameEngine/Components/Component.ts":
/*!************************************************!*\
  !*** ./src/GameEngine/Components/Component.ts ***!
  \************************************************/
/*! exports provided: Component */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Component", function() { return Component; });
class Component {
    constructor(gameObject) {
        this.gameObject = gameObject;
    }
    start() { }
    ;
    update() { }
    ;
}


/***/ }),

/***/ "./src/GameEngine/Components/RectangleCollider.ts":
/*!********************************************************!*\
  !*** ./src/GameEngine/Components/RectangleCollider.ts ***!
  \********************************************************/
/*! exports provided: RectangleCollider */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RectangleCollider", function() { return RectangleCollider; });
/* harmony import */ var _Core_Vector2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Core/Vector2 */ "./src/GameEngine/Core/Vector2.ts");
/* harmony import */ var _Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Component */ "./src/GameEngine/Components/Component.ts");
/* harmony import */ var _Core_Helpers_LiteEvent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Core/Helpers/LiteEvent */ "./src/GameEngine/Core/Helpers/LiteEvent.ts");



class RectangleCollider extends _Component__WEBPACK_IMPORTED_MODULE_1__["Component"] {
    constructor(gameObject) {
        super(gameObject);
        this.onCollide = new _Core_Helpers_LiteEvent__WEBPACK_IMPORTED_MODULE_2__["LiteEvent"]();
        this.transform = gameObject.getTransform();
        let transform = this.transform;
        transform.onMoved.add(() => this.onTransformMoved());
        this.topLeft = new _Core_Vector2__WEBPACK_IMPORTED_MODULE_0__["Vector2"](transform.position.x, transform.position.y);
        this.topRight = new _Core_Vector2__WEBPACK_IMPORTED_MODULE_0__["Vector2"](transform.position.x + transform.width, transform.position.y);
        this.bottomLeft = new _Core_Vector2__WEBPACK_IMPORTED_MODULE_0__["Vector2"](transform.position.x, transform.position.y + transform.height);
        this.bottomRight = new _Core_Vector2__WEBPACK_IMPORTED_MODULE_0__["Vector2"](transform.position.x + transform.width, transform.position.y + transform.height);
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


/***/ }),

/***/ "./src/GameEngine/Components/RectangleRenderer.ts":
/*!********************************************************!*\
  !*** ./src/GameEngine/Components/RectangleRenderer.ts ***!
  \********************************************************/
/*! exports provided: RectangleRenderer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RectangleRenderer", function() { return RectangleRenderer; });
/* harmony import */ var _Component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Component */ "./src/GameEngine/Components/Component.ts");

class RectangleRenderer extends _Component__WEBPACK_IMPORTED_MODULE_0__["Component"] {
    constructor(gameObject, color) {
        super(gameObject);
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


/***/ }),

/***/ "./src/GameEngine/Components/Rigidbody.ts":
/*!************************************************!*\
  !*** ./src/GameEngine/Components/Rigidbody.ts ***!
  \************************************************/
/*! exports provided: Rigidbody */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Rigidbody", function() { return Rigidbody; });
/* harmony import */ var _Component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Component */ "./src/GameEngine/Components/Component.ts");
/* harmony import */ var _Core_Vector2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Core/Vector2 */ "./src/GameEngine/Core/Vector2.ts");
/* harmony import */ var _Core_Physics__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Core/Physics */ "./src/GameEngine/Core/Physics.ts");



class Rigidbody extends _Component__WEBPACK_IMPORTED_MODULE_0__["Component"] {
    constructor(gameObject, mass = 1) {
        super(gameObject);
        this.transform = gameObject.getTransform();
        this.mass = mass;
        this.velocity = new _Core_Vector2__WEBPACK_IMPORTED_MODULE_1__["Vector2"](0, 0);
        this.acceleration = new _Core_Vector2__WEBPACK_IMPORTED_MODULE_1__["Vector2"](0, 0);
        _Core_Physics__WEBPACK_IMPORTED_MODULE_2__["Physics"].Instance.addRigidbody(this);
    }
    update() {
    }
    addForce(force) {
    }
    addGravity(force) {
    }
    updateVelocity() {
    }
}


/***/ }),

/***/ "./src/GameEngine/Components/Transform.ts":
/*!************************************************!*\
  !*** ./src/GameEngine/Components/Transform.ts ***!
  \************************************************/
/*! exports provided: Transform */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Transform", function() { return Transform; });
/* harmony import */ var _Component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Component */ "./src/GameEngine/Components/Component.ts");
/* harmony import */ var _Core_Vector2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Core/Vector2 */ "./src/GameEngine/Core/Vector2.ts");
/* harmony import */ var _Core_Helpers_LiteEvent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Core/Helpers/LiteEvent */ "./src/GameEngine/Core/Helpers/LiteEvent.ts");



class Transform extends _Component__WEBPACK_IMPORTED_MODULE_0__["Component"] {
    constructor(gameObject, x, y, width, height) {
        super(gameObject);
        this.width = 0;
        this.height = 0;
        this.onMove = new _Core_Helpers_LiteEvent__WEBPACK_IMPORTED_MODULE_2__["LiteEvent"]();
        this.width = width;
        this.height = height;
        this.position = new _Core_Vector2__WEBPACK_IMPORTED_MODULE_1__["Vector2"](x, y);
        this.rotation = 0;
    }
    get onMoved() {
        return this.onMove.expose();
    }
    get center() {
        return new _Core_Vector2__WEBPACK_IMPORTED_MODULE_1__["Vector2"](this.position.x + (this.width / 2), this.position.y + (this.height / 2));
    }
    get bottomCenter() {
        return new _Core_Vector2__WEBPACK_IMPORTED_MODULE_1__["Vector2"](this.position.x + (this.width / 2), this.position.y + this.height);
    }
    translate(translation) {
        this.position.x += translation.x;
        this.position.y += (-1 * translation.y);
        this.onMove.trigger();
    }
    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
        this.onMove.trigger();
    }
}


/***/ }),

/***/ "./src/GameEngine/Core/GameEngine.ts":
/*!*******************************************!*\
  !*** ./src/GameEngine/Core/GameEngine.ts ***!
  \*******************************************/
/*! exports provided: GameEngine */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameEngine", function() { return GameEngine; });
/* harmony import */ var _Physics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Physics */ "./src/GameEngine/Core/Physics.ts");
/* harmony import */ var _Time__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Time */ "./src/GameEngine/Core/Time.ts");


class GameEngine {
    constructor() {
        this.gameObjects = [];
        this.gameObjectMap = new Map();
        this.gameInitialized = false;
        this.paused = false;
        this.gameInitialized = false;
        this.physicsEngine = _Physics__WEBPACK_IMPORTED_MODULE_0__["Physics"].Instance;
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
        _Time__WEBPACK_IMPORTED_MODULE_1__["Time"].start();
        this.paused = false;
        for (let i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].start();
        }
        requestAnimationFrame(() => this.gameLoop());
    }
    instantiate(newGameObject) {
        this.gameObjects.push(newGameObject);
        newGameObject.start();
        return newGameObject;
    }
    getGameObjectById(id) {
        if (!this.gameObjectMap.has(id)) {
            throw new Error("No GameObject with id of " + id + " exists!");
        }
        return this.gameObjectMap.get(id);
    }
    getGameCanvas() {
        return this.gameCanvas;
    }
    getGameCanvasContext() {
        return this.canvasContext;
    }
    printGameData() {
        console.log(this);
        console.log("Time since game start " + _Time__WEBPACK_IMPORTED_MODULE_1__["Time"].TotalTime + "s");
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
        for (let gameObject of gameObjects) {
            if (this.gameObjectMap.has(gameObject.id)) {
                throw new Error("Duplicate game object of " + gameObject.id + "!");
            }
            this.gameObjectMap.set(gameObject.id, gameObject);
        }
    }
    update() {
        _Time__WEBPACK_IMPORTED_MODULE_1__["Time"].updateTime();
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


/***/ }),

/***/ "./src/GameEngine/Core/GameObject.ts":
/*!*******************************************!*\
  !*** ./src/GameEngine/Core/GameObject.ts ***!
  \*******************************************/
/*! exports provided: GameObject */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameObject", function() { return GameObject; });
/* harmony import */ var _Components_Transform__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Components/Transform */ "./src/GameEngine/Components/Transform.ts");
/* harmony import */ var _GameEngine__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./GameEngine */ "./src/GameEngine/Core/GameEngine.ts");


class GameObject {
    constructor(id, x = 0, y = 0, width = 0, height = 0) {
        this.components = [];
        this.componentMap = new Map();
        this.id = id;
        this.transform = new _Components_Transform__WEBPACK_IMPORTED_MODULE_0__["Transform"](this, x, y, width, height);
    }
    start() {
        this.gameCanvas = _GameEngine__WEBPACK_IMPORTED_MODULE_1__["GameEngine"].Instance.getGameCanvas();
        this.canvasContext = this.gameCanvas.getContext("2d");
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
    getComponent(component) {
        let componentType = component.name;
        if (!this.componentMap.has(componentType)) {
            throw new Error(componentType + " not found on the GameObject with id of " + this.id + "!");
        }
        return this.componentMap.get(componentType);
    }
    addComponent(newComponent) {
        if (this.componentMap.has(newComponent.constructor.name)) {
            throw new Error("There is already a component of type " + newComponent.constructor.name + " on this object!");
        }
        this.components.push(newComponent);
        this.componentMap.set(newComponent.constructor.name, newComponent);
        newComponent.start();
        return newComponent;
    }
    setComponents(components) {
        this.components = components;
        for (let component of components) {
            if (this.componentMap.has(component.constructor.name)) {
                throw new Error("There is already a component of type " + component.constructor.name + " on this object!");
            }
            this.componentMap.set(component.constructor.name, component);
        }
    }
}


/***/ }),

/***/ "./src/GameEngine/Core/Helpers/Keys.ts":
/*!*********************************************!*\
  !*** ./src/GameEngine/Core/Helpers/Keys.ts ***!
  \*********************************************/
/*! exports provided: Keys */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Keys", function() { return Keys; });
var Keys;
(function (Keys) {
    Keys[Keys["UP"] = 38] = "UP";
    Keys[Keys["DOWN"] = 40] = "DOWN";
    Keys[Keys["LEFT"] = 37] = "LEFT";
    Keys[Keys["RIGHT"] = 39] = "RIGHT";
    Keys[Keys["W"] = 87] = "W";
    Keys[Keys["A"] = 65] = "A";
    Keys[Keys["S"] = 83] = "S";
    Keys[Keys["D"] = 68] = "D";
    Keys[Keys["SPACE"] = 32] = "SPACE";
})(Keys || (Keys = {}));


/***/ }),

/***/ "./src/GameEngine/Core/Helpers/LiteEvent.ts":
/*!**************************************************!*\
  !*** ./src/GameEngine/Core/Helpers/LiteEvent.ts ***!
  \**************************************************/
/*! exports provided: LiteEvent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LiteEvent", function() { return LiteEvent; });
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


/***/ }),

/***/ "./src/GameEngine/Core/ImageBackground.ts":
/*!************************************************!*\
  !*** ./src/GameEngine/Core/ImageBackground.ts ***!
  \************************************************/
/*! exports provided: ImageBackground */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImageBackground", function() { return ImageBackground; });
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


/***/ }),

/***/ "./src/GameEngine/Core/Physics.ts":
/*!****************************************!*\
  !*** ./src/GameEngine/Core/Physics.ts ***!
  \****************************************/
/*! exports provided: Physics */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Physics", function() { return Physics; });
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


/***/ }),

/***/ "./src/GameEngine/Core/Time.ts":
/*!*************************************!*\
  !*** ./src/GameEngine/Core/Time.ts ***!
  \*************************************/
/*! exports provided: Time */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Time", function() { return Time; });
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


/***/ }),

/***/ "./src/GameEngine/Core/Vector2.ts":
/*!****************************************!*\
  !*** ./src/GameEngine/Core/Vector2.ts ***!
  \****************************************/
/*! exports provided: Vector2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Vector2", function() { return Vector2; });
class Vector2 {
    constructor(x, y) {
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
    }
    get sqrMagnitude() {
        return (this.x * this.x) + (this.y * this.y);
    }
    get magnitude() {
        return Math.sqrt(this.sqrMagnitude);
    }
    get normalized() {
        if (this.magnitude === 0) {
            return new Vector2(1, 0);
        }
        return this.divide(new Vector2(this.magnitude, this.magnitude));
    }
    add(rightOperand) {
        let newX = this.x + rightOperand.x;
        let newY = this.y + rightOperand.y;
        return new Vector2(newX, newY);
    }
    subtract(rightOperand) {
        let newX = this.x - rightOperand.x;
        let newY = this.y - rightOperand.y;
        return new Vector2(newX, newY);
    }
    multiply(rightOperand) {
        let newX = this.x * rightOperand.x;
        let newY = this.y * rightOperand.y;
        return new Vector2(newX, newY);
    }
    divide(rightOperand) {
        let newX = this.x / rightOperand.x;
        let newY = this.y / rightOperand.y;
        return new Vector2(newX, newY);
    }
    equals(rightOperand) {
        let equalX = this.x === rightOperand.x;
        let equalY = this.y === rightOperand.y;
        return equalX && equalY;
    }
    multiplyScalar(rightOperand) {
        let newX = this.x * rightOperand;
        let newY = this.y * rightOperand;
        return new Vector2(newX, newY);
    }
    static get up() {
        return new Vector2(0, 1);
    }
    static get down() {
        return new Vector2(0, -1);
    }
    static get left() {
        return new Vector2(-1, 0);
    }
    static get right() {
        return new Vector2(1, 0);
    }
    static get zero() {
        return new Vector2(0, 0);
    }
    static get one() {
        return new Vector2(1, 1);
    }
    static distance(point1, point2) {
        let distanceX = point1.x - point2.x;
        let distanceY = point1.y - point2.y;
        return Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));
    }
    static angle(from, to) {
        let cos0 = Vector2.dot(from, to) / (from.magnitude * to.magnitude);
        return Math.acos(cos0);
    }
    static dot(point1, point2) {
        return (point1.x * point2.x) + (point1.y * point2.y);
    }
}


/***/ }),

/***/ "./src/Mario/Components/BallMotor.ts":
/*!*******************************************!*\
  !*** ./src/Mario/Components/BallMotor.ts ***!
  \*******************************************/
/*! exports provided: BallMotor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BallMotor", function() { return BallMotor; });
/* harmony import */ var _Motor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Motor */ "./src/Mario/Components/Motor.ts");
/* harmony import */ var _GameEngine_Components_RectangleCollider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../GameEngine/Components/RectangleCollider */ "./src/GameEngine/Components/RectangleCollider.ts");
/* harmony import */ var _GameEngine_Core_GameEngine__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../GameEngine/Core/GameEngine */ "./src/GameEngine/Core/GameEngine.ts");
/* harmony import */ var _GameEngine_Core_Vector2__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../GameEngine/Core/Vector2 */ "./src/GameEngine/Core/Vector2.ts");




class BallMotor extends _Motor__WEBPACK_IMPORTED_MODULE_0__["Motor"] {
    constructor(gameObject) {
        super(gameObject);
        this.reset();
    }
    start() {
        super.start();
        this.collider = this.gameObject.getComponent(_GameEngine_Components_RectangleCollider__WEBPACK_IMPORTED_MODULE_1__["RectangleCollider"]);
        this.playerCollider = _GameEngine_Core_GameEngine__WEBPACK_IMPORTED_MODULE_2__["GameEngine"].Instance.getGameObjectById("player").getComponent(_GameEngine_Components_RectangleCollider__WEBPACK_IMPORTED_MODULE_1__["RectangleCollider"]);
        this.computerCollider = _GameEngine_Core_GameEngine__WEBPACK_IMPORTED_MODULE_2__["GameEngine"].Instance.getGameObjectById("computer").getComponent(_GameEngine_Components_RectangleCollider__WEBPACK_IMPORTED_MODULE_1__["RectangleCollider"]);
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
            this.yVelocity *= -1;
        }
        else if (this.transform.position.y >= this.gameCanvas.height - this.transform.height) {
            this.yVelocity = Math.abs(this.yVelocity);
        }
        if (this.transform.position.x + this.transform.width <= 0) {
            this.reset();
        }
        else if (this.transform.position.x >= this.gameCanvas.width) {
            this.reset();
        }
    }
    move() {
        this.transform.translate(new _GameEngine_Core_Vector2__WEBPACK_IMPORTED_MODULE_3__["Vector2"](this.xVelocity, this.yVelocity).multiplyScalar(this.speed));
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


/***/ }),

/***/ "./src/Mario/Components/ComputerMotor.ts":
/*!***********************************************!*\
  !*** ./src/Mario/Components/ComputerMotor.ts ***!
  \***********************************************/
/*! exports provided: ComputerMotor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ComputerMotor", function() { return ComputerMotor; });
/* harmony import */ var _Motor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Motor */ "./src/Mario/Components/Motor.ts");
/* harmony import */ var _GameEngine_Core_GameEngine__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../GameEngine/Core/GameEngine */ "./src/GameEngine/Core/GameEngine.ts");
/* harmony import */ var _GameEngine_Core_Time__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../GameEngine/Core/Time */ "./src/GameEngine/Core/Time.ts");
/* harmony import */ var _GameEngine_Core_Vector2__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../GameEngine/Core/Vector2 */ "./src/GameEngine/Core/Vector2.ts");




class ComputerMotor extends _Motor__WEBPACK_IMPORTED_MODULE_0__["Motor"] {
    constructor(gameObject) {
        super(gameObject);
        this.timer = 0;
        this.yVelocity = 1;
    }
    start() {
        super.start();
        this.ballTransform = _GameEngine_Core_GameEngine__WEBPACK_IMPORTED_MODULE_1__["GameEngine"].Instance.getGameObjectById("ball").getTransform();
        this.quarterFieldX = this.gameCanvas.width / 4;
        this.midFieldY = this.gameCanvas.height / 2;
    }
    handleOutOfBounds() {
        if (this.transform.position.y <= 0) {
            this.yVelocity = -1;
        }
        else if (this.transform.position.y >= this.gameCanvas.height - this.transform.height) {
            this.yVelocity = 1;
        }
    }
    move() {
        if (this.ballTransform.position.x < this.quarterFieldX) {
            if (this.transform.position.y > this.midFieldY + 5) {
                this.yVelocity = 1;
            }
            else if (this.transform.position.y < this.midFieldY - 5) {
                this.yVelocity = -1;
            }
            else {
                this.yVelocity = 0;
            }
        }
        else {
            this.timer += _GameEngine_Core_Time__WEBPACK_IMPORTED_MODULE_2__["Time"].DeltaTime;
            if (this.timer > 0.15) {
                if (this.transform.center.y < this.ballTransform.center.y - 10) {
                    this.yVelocity = -1;
                }
                else if (this.transform.center.y > this.ballTransform.center.y + 10) {
                    this.yVelocity = 1;
                }
                else {
                    this.yVelocity = 0;
                }
                this.timer = 0;
            }
        }
        this.transform.translate(new _GameEngine_Core_Vector2__WEBPACK_IMPORTED_MODULE_3__["Vector2"](this.xVelocity, this.yVelocity).multiplyScalar(this.speed));
    }
}


/***/ }),

/***/ "./src/Mario/Components/GameManager.ts":
/*!*********************************************!*\
  !*** ./src/Mario/Components/GameManager.ts ***!
  \*********************************************/
/*! exports provided: GameManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameManager", function() { return GameManager; });
/* harmony import */ var _GameEngine_Components_Component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../GameEngine/Components/Component */ "./src/GameEngine/Components/Component.ts");
/* harmony import */ var _GameEngine_Core_GameEngine__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../GameEngine/Core/GameEngine */ "./src/GameEngine/Core/GameEngine.ts");
/* harmony import */ var _GameObjects_Ball__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../GameObjects/Ball */ "./src/Mario/GameObjects/Ball.ts");



class GameManager extends _GameEngine_Components_Component__WEBPACK_IMPORTED_MODULE_0__["Component"] {
    constructor(gameObject) {
        super(gameObject);
        document.getElementById("print-button").addEventListener("click", () => this.printGameData());
        document.getElementById("pause-button").addEventListener("click", () => this.togglePause());
        document.getElementById("add-ball").addEventListener("click", () => this.testInstantiate());
    }
    start() {
        this.player = _GameEngine_Core_GameEngine__WEBPACK_IMPORTED_MODULE_1__["GameEngine"].Instance.getGameObjectById("player");
    }
    static get Instance() {
        if (this.instance === null || this.instance === undefined) {
            throw new Error("GameManager has not been created yet. Use the createInstance method first.");
        }
        return this.instance;
    }
    static createInstance(gameObject) {
        if (this.instance === null || this.instance === undefined) {
            this.instance = new GameManager(gameObject);
            return this.instance;
        }
        throw new Error("More than one GameManager cannot be created!");
    }
    togglePause() {
        _GameEngine_Core_GameEngine__WEBPACK_IMPORTED_MODULE_1__["GameEngine"].Instance.togglePause();
    }
    printGameData() {
        _GameEngine_Core_GameEngine__WEBPACK_IMPORTED_MODULE_1__["GameEngine"].Instance.printGameData();
    }
    testInstantiate() {
        _GameEngine_Core_GameEngine__WEBPACK_IMPORTED_MODULE_1__["GameEngine"].Instance.instantiate(new _GameObjects_Ball__WEBPACK_IMPORTED_MODULE_2__["Ball"]("ball2"));
    }
}


/***/ }),

/***/ "./src/Mario/Components/Motor.ts":
/*!***************************************!*\
  !*** ./src/Mario/Components/Motor.ts ***!
  \***************************************/
/*! exports provided: Motor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Motor", function() { return Motor; });
/* harmony import */ var _GameEngine_Components_Component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../GameEngine/Components/Component */ "./src/GameEngine/Components/Component.ts");

class Motor extends _GameEngine_Components_Component__WEBPACK_IMPORTED_MODULE_0__["Component"] {
    constructor(gameObject) {
        super(gameObject);
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


/***/ }),

/***/ "./src/Mario/Components/PlayerMotor.ts":
/*!*********************************************!*\
  !*** ./src/Mario/Components/PlayerMotor.ts ***!
  \*********************************************/
/*! exports provided: PlayerMotor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PlayerMotor", function() { return PlayerMotor; });
/* harmony import */ var _Motor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Motor */ "./src/Mario/Components/Motor.ts");
/* harmony import */ var _GameEngine_Core_Vector2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../GameEngine/Core/Vector2 */ "./src/GameEngine/Core/Vector2.ts");
/* harmony import */ var _GameEngine_Core_Helpers_Keys__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../GameEngine/Core/Helpers/Keys */ "./src/GameEngine/Core/Helpers/Keys.ts");



class PlayerMotor extends _Motor__WEBPACK_IMPORTED_MODULE_0__["Motor"] {
    constructor(gameObject) {
        super(gameObject);
        this.movingUp = false;
        this.movingDown = false;
        this.movingRight = false;
        this.movingLeft = false;
        document.addEventListener('keydown', () => this.onKeyDown(event));
        document.addEventListener('keyup', () => this.onKeyUp(event));
    }
    get isMoving() {
        return this.xVelocity !== 0 || this.yVelocity !== 0;
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
        if (this.movingUp) {
            this.yVelocity = 1;
        }
        else if (this.movingDown) {
            this.yVelocity = -1;
        }
        else {
            this.yVelocity = 0;
        }
        if (this.movingRight) {
            this.xVelocity = 1;
        }
        else if (this.movingLeft) {
            this.xVelocity = -1;
        }
        else {
            this.xVelocity = 0;
        }
        if (this.isMoving) {
            this.transform.translate(new _GameEngine_Core_Vector2__WEBPACK_IMPORTED_MODULE_1__["Vector2"](this.xVelocity, this.yVelocity).multiplyScalar(this.speed));
        }
    }
    jump() {
    }
    onKeyDown(event) {
        if (event.keyCode == _GameEngine_Core_Helpers_Keys__WEBPACK_IMPORTED_MODULE_2__["Keys"].UP || event.keyCode == _GameEngine_Core_Helpers_Keys__WEBPACK_IMPORTED_MODULE_2__["Keys"].W) {
            this.movingUp = true;
            this.movingDown = false;
        }
        else if (event.keyCode == _GameEngine_Core_Helpers_Keys__WEBPACK_IMPORTED_MODULE_2__["Keys"].DOWN || event.keyCode == _GameEngine_Core_Helpers_Keys__WEBPACK_IMPORTED_MODULE_2__["Keys"].S) {
            this.movingDown = true;
            this.movingUp = false;
        }
        if (event.keyCode == _GameEngine_Core_Helpers_Keys__WEBPACK_IMPORTED_MODULE_2__["Keys"].RIGHT || event.keyCode == _GameEngine_Core_Helpers_Keys__WEBPACK_IMPORTED_MODULE_2__["Keys"].D) {
            this.movingRight = true;
            this.movingLeft = false;
        }
        else if (event.keyCode == _GameEngine_Core_Helpers_Keys__WEBPACK_IMPORTED_MODULE_2__["Keys"].LEFT || event.keyCode == _GameEngine_Core_Helpers_Keys__WEBPACK_IMPORTED_MODULE_2__["Keys"].A) {
            this.movingRight = false;
            this.movingLeft = true;
        }
    }
    onKeyUp(event) {
        if (event.keyCode == _GameEngine_Core_Helpers_Keys__WEBPACK_IMPORTED_MODULE_2__["Keys"].UP || event.keyCode == _GameEngine_Core_Helpers_Keys__WEBPACK_IMPORTED_MODULE_2__["Keys"].W) {
            this.movingUp = false;
        }
        else if (event.keyCode == _GameEngine_Core_Helpers_Keys__WEBPACK_IMPORTED_MODULE_2__["Keys"].DOWN || event.keyCode == _GameEngine_Core_Helpers_Keys__WEBPACK_IMPORTED_MODULE_2__["Keys"].S) {
            this.movingDown = false;
        }
        if (event.keyCode == _GameEngine_Core_Helpers_Keys__WEBPACK_IMPORTED_MODULE_2__["Keys"].RIGHT || event.keyCode == _GameEngine_Core_Helpers_Keys__WEBPACK_IMPORTED_MODULE_2__["Keys"].D) {
            this.movingRight = false;
        }
        else if (event.keyCode == _GameEngine_Core_Helpers_Keys__WEBPACK_IMPORTED_MODULE_2__["Keys"].LEFT || event.keyCode == _GameEngine_Core_Helpers_Keys__WEBPACK_IMPORTED_MODULE_2__["Keys"].A) {
            this.movingLeft = false;
        }
    }
}


/***/ }),

/***/ "./src/Mario/GameObjects/Ball.ts":
/*!***************************************!*\
  !*** ./src/Mario/GameObjects/Ball.ts ***!
  \***************************************/
/*! exports provided: Ball */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Ball", function() { return Ball; });
/* harmony import */ var _GameEngine_Core_GameObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../GameEngine/Core/GameObject */ "./src/GameEngine/Core/GameObject.ts");
/* harmony import */ var _GameEngine_Components_RectangleCollider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../GameEngine/Components/RectangleCollider */ "./src/GameEngine/Components/RectangleCollider.ts");
/* harmony import */ var _Components_BallMotor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Components/BallMotor */ "./src/Mario/Components/BallMotor.ts");
/* harmony import */ var _GameEngine_Components_RectangleRenderer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../GameEngine/Components/RectangleRenderer */ "./src/GameEngine/Components/RectangleRenderer.ts");




class Ball extends _GameEngine_Core_GameObject__WEBPACK_IMPORTED_MODULE_0__["GameObject"] {
    constructor(id) {
        super(id, 345, 195, 10, 10);
        let ballComponents = [];
        ballComponents.push(new _GameEngine_Components_RectangleCollider__WEBPACK_IMPORTED_MODULE_1__["RectangleCollider"](this));
        ballComponents.push(new _Components_BallMotor__WEBPACK_IMPORTED_MODULE_2__["BallMotor"](this));
        ballComponents.push(new _GameEngine_Components_RectangleRenderer__WEBPACK_IMPORTED_MODULE_3__["RectangleRenderer"](this, "white"));
        this.setComponents(ballComponents);
    }
}


/***/ }),

/***/ "./src/Mario/GameObjects/Computer.ts":
/*!*******************************************!*\
  !*** ./src/Mario/GameObjects/Computer.ts ***!
  \*******************************************/
/*! exports provided: Computer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Computer", function() { return Computer; });
/* harmony import */ var _GameEngine_Core_GameObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../GameEngine/Core/GameObject */ "./src/GameEngine/Core/GameObject.ts");
/* harmony import */ var _GameEngine_Components_RectangleCollider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../GameEngine/Components/RectangleCollider */ "./src/GameEngine/Components/RectangleCollider.ts");
/* harmony import */ var _Components_ComputerMotor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Components/ComputerMotor */ "./src/Mario/Components/ComputerMotor.ts");
/* harmony import */ var _GameEngine_Components_RectangleRenderer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../GameEngine/Components/RectangleRenderer */ "./src/GameEngine/Components/RectangleRenderer.ts");




class Computer extends _GameEngine_Core_GameObject__WEBPACK_IMPORTED_MODULE_0__["GameObject"] {
    constructor(id) {
        super(id, 688, 175, 10, 50);
        let computerComponents = [];
        computerComponents.push(new _GameEngine_Components_RectangleCollider__WEBPACK_IMPORTED_MODULE_1__["RectangleCollider"](this));
        computerComponents.push(new _Components_ComputerMotor__WEBPACK_IMPORTED_MODULE_2__["ComputerMotor"](this));
        computerComponents.push(new _GameEngine_Components_RectangleRenderer__WEBPACK_IMPORTED_MODULE_3__["RectangleRenderer"](this, "white"));
        this.setComponents(computerComponents);
    }
}


/***/ }),

/***/ "./src/Mario/GameObjects/GameManagerObject.ts":
/*!****************************************************!*\
  !*** ./src/Mario/GameObjects/GameManagerObject.ts ***!
  \****************************************************/
/*! exports provided: GameManagerObject */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameManagerObject", function() { return GameManagerObject; });
/* harmony import */ var _GameEngine_Core_GameObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../GameEngine/Core/GameObject */ "./src/GameEngine/Core/GameObject.ts");
/* harmony import */ var _Components_GameManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Components/GameManager */ "./src/Mario/Components/GameManager.ts");


class GameManagerObject extends _GameEngine_Core_GameObject__WEBPACK_IMPORTED_MODULE_0__["GameObject"] {
    constructor(id) {
        super(id, 0, 0, 0, 0);
        let gameManagerComponents = [];
        let gameManager = _Components_GameManager__WEBPACK_IMPORTED_MODULE_1__["GameManager"].createInstance(this);
        gameManagerComponents.push(gameManager);
        this.setComponents(gameManagerComponents);
    }
}


/***/ }),

/***/ "./src/Mario/GameObjects/Player.ts":
/*!*****************************************!*\
  !*** ./src/Mario/GameObjects/Player.ts ***!
  \*****************************************/
/*! exports provided: Player */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Player", function() { return Player; });
/* harmony import */ var _GameEngine_Core_GameObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../GameEngine/Core/GameObject */ "./src/GameEngine/Core/GameObject.ts");
/* harmony import */ var _GameEngine_Components_RectangleCollider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../GameEngine/Components/RectangleCollider */ "./src/GameEngine/Components/RectangleCollider.ts");
/* harmony import */ var _Components_PlayerMotor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Components/PlayerMotor */ "./src/Mario/Components/PlayerMotor.ts");
/* harmony import */ var _GameEngine_Components_Rigidbody__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../GameEngine/Components/Rigidbody */ "./src/GameEngine/Components/Rigidbody.ts");
/* harmony import */ var _GameEngine_Components_Animator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../GameEngine/Components/Animator */ "./src/GameEngine/Components/Animator.ts");
/* harmony import */ var _assets_mario_png__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../assets/mario.png */ "./src/assets/mario.png");
/* harmony import */ var _assets_mario_png__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_assets_mario_png__WEBPACK_IMPORTED_MODULE_5__);






class Player extends _GameEngine_Core_GameObject__WEBPACK_IMPORTED_MODULE_0__["GameObject"] {
    constructor(id) {
        super(id, 2, 175, 10, 50);
        let playerComponents = [];
        playerComponents.push(new _GameEngine_Components_RectangleCollider__WEBPACK_IMPORTED_MODULE_1__["RectangleCollider"](this));
        playerComponents.push(new _Components_PlayerMotor__WEBPACK_IMPORTED_MODULE_2__["PlayerMotor"](this));
        playerComponents.push(new _GameEngine_Components_Rigidbody__WEBPACK_IMPORTED_MODULE_3__["Rigidbody"](this));
        playerComponents.push(new _GameEngine_Components_Animator__WEBPACK_IMPORTED_MODULE_4__["Animator"](this, _assets_mario_png__WEBPACK_IMPORTED_MODULE_5___default.a, 4, 1));
        this.setComponents(playerComponents);
    }
}


/***/ }),

/***/ "./src/assets/background.png":
/*!***********************************!*\
  !*** ./src/assets/background.png ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "27f0d2999953e5a8c430d7ae4c132a11.png";

/***/ }),

/***/ "./src/assets/mario.png":
/*!******************************!*\
  !*** ./src/assets/mario.png ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "4746324abbc3f8287894e9a64188e32e.png";

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _GameEngine_Core_GameEngine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GameEngine/Core/GameEngine */ "./src/GameEngine/Core/GameEngine.ts");
/* harmony import */ var _GameEngine_Core_ImageBackground__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./GameEngine/Core/ImageBackground */ "./src/GameEngine/Core/ImageBackground.ts");
/* harmony import */ var _Mario_GameObjects_GameManagerObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Mario/GameObjects/GameManagerObject */ "./src/Mario/GameObjects/GameManagerObject.ts");
/* harmony import */ var _Mario_GameObjects_Player__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Mario/GameObjects/Player */ "./src/Mario/GameObjects/Player.ts");
/* harmony import */ var _Mario_GameObjects_Ball__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Mario/GameObjects/Ball */ "./src/Mario/GameObjects/Ball.ts");
/* harmony import */ var _Mario_GameObjects_Computer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Mario/GameObjects/Computer */ "./src/Mario/GameObjects/Computer.ts");
/* harmony import */ var _assets_background_png__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./assets/background.png */ "./src/assets/background.png");
/* harmony import */ var _assets_background_png__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_assets_background_png__WEBPACK_IMPORTED_MODULE_6__);







let gameEngine = _GameEngine_Core_GameEngine__WEBPACK_IMPORTED_MODULE_0__["GameEngine"].Instance;
let gameCanvas = document.getElementById("game-canvas");
let background = new _GameEngine_Core_ImageBackground__WEBPACK_IMPORTED_MODULE_1__["ImageBackground"](gameCanvas, _assets_background_png__WEBPACK_IMPORTED_MODULE_6___default.a);
let gameManager = new _Mario_GameObjects_GameManagerObject__WEBPACK_IMPORTED_MODULE_2__["GameManagerObject"]("GameManager");
let player = new _Mario_GameObjects_Player__WEBPACK_IMPORTED_MODULE_3__["Player"]("player");
let ball = new _Mario_GameObjects_Ball__WEBPACK_IMPORTED_MODULE_4__["Ball"]("ball");
let computer = new _Mario_GameObjects_Computer__WEBPACK_IMPORTED_MODULE_5__["Computer"]("computer");
let gameObjects = [gameManager, player, computer, ball];
gameEngine.initializeGame(gameCanvas, gameObjects, background);
gameEngine.startGame();


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dhbWVFbmdpbmUvQ29tcG9uZW50cy9BbmltYXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR2FtZUVuZ2luZS9Db21wb25lbnRzL0NvbXBvbmVudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR2FtZUVuZ2luZS9Db21wb25lbnRzL1JlY3RhbmdsZUNvbGxpZGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9HYW1lRW5naW5lL0NvbXBvbmVudHMvUmVjdGFuZ2xlUmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dhbWVFbmdpbmUvQ29tcG9uZW50cy9SaWdpZGJvZHkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dhbWVFbmdpbmUvQ29tcG9uZW50cy9UcmFuc2Zvcm0udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dhbWVFbmdpbmUvQ29yZS9HYW1lRW5naW5lLnRzIiwid2VicGFjazovLy8uL3NyYy9HYW1lRW5naW5lL0NvcmUvR2FtZU9iamVjdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR2FtZUVuZ2luZS9Db3JlL0hlbHBlcnMvS2V5cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR2FtZUVuZ2luZS9Db3JlL0hlbHBlcnMvTGl0ZUV2ZW50LnRzIiwid2VicGFjazovLy8uL3NyYy9HYW1lRW5naW5lL0NvcmUvSW1hZ2VCYWNrZ3JvdW5kLnRzIiwid2VicGFjazovLy8uL3NyYy9HYW1lRW5naW5lL0NvcmUvUGh5c2ljcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR2FtZUVuZ2luZS9Db3JlL1RpbWUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dhbWVFbmdpbmUvQ29yZS9WZWN0b3IyLnRzIiwid2VicGFjazovLy8uL3NyYy9NYXJpby9Db21wb25lbnRzL0JhbGxNb3Rvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTWFyaW8vQ29tcG9uZW50cy9Db21wdXRlck1vdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9NYXJpby9Db21wb25lbnRzL0dhbWVNYW5hZ2VyLnRzIiwid2VicGFjazovLy8uL3NyYy9NYXJpby9Db21wb25lbnRzL01vdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9NYXJpby9Db21wb25lbnRzL1BsYXllck1vdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9NYXJpby9HYW1lT2JqZWN0cy9CYWxsLnRzIiwid2VicGFjazovLy8uL3NyYy9NYXJpby9HYW1lT2JqZWN0cy9Db21wdXRlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTWFyaW8vR2FtZU9iamVjdHMvR2FtZU1hbmFnZXJPYmplY3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL01hcmlvL0dhbWVPYmplY3RzL1BsYXllci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYXNzZXRzL2JhY2tncm91bmQucG5nIiwid2VicGFjazovLy8uL3NyYy9hc3NldHMvbWFyaW8ucG5nIiwid2VicGFjazovLy8uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7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ZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCJpbXBvcnQgeyBUcmFuc2Zvcm0gfSBmcm9tIFwiLi9UcmFuc2Zvcm1cIjtcclxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vQ29tcG9uZW50XCI7XHJcbmltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi4vQ29yZS9HYW1lT2JqZWN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQW5pbWF0b3IgZXh0ZW5kcyBDb21wb25lbnQge1xyXG5cclxuICAgIHByaXZhdGUgZnJhbWVXaWR0aDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgZnJhbWVIZWlnaHQ6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIG51bWJlck9mRnJhbWVzOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBudW1iZXJPZlJvd3M6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIGZyYW1lSW5kZXg6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIGZyYW1lc1BlckFuaW1hdGlvbkZyYW1lOiBudW1iZXIgPSAxMDtcclxuICAgIHByaXZhdGUgYW5pbWF0aW9uRnJhbWVDb3VudDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgc3ByaXRlU2hlZXQ6IEhUTUxJbWFnZUVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIGNhbnZhc0NvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICAgIHByaXZhdGUgdHJhbnNmb3JtOiBUcmFuc2Zvcm07XHJcbiAgICBwcml2YXRlIHNwcml0ZVJlYWR5OiBib29sZWFuO1xyXG5cclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoZ2FtZU9iamVjdDogR2FtZU9iamVjdCwgc3ByaXRlU2hlZXRVUkw6IHN0cmluZywgbnVtYmVyT2ZGcmFtZXM6IG51bWJlciwgbnVtYmVyT2ZSb3dzOiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlcihnYW1lT2JqZWN0KTtcclxuICAgICAgICB0aGlzLnNwcml0ZVJlYWR5ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zcHJpdGVTaGVldCA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgIHRoaXMuc3ByaXRlU2hlZXQuc3JjID0gc3ByaXRlU2hlZXRVUkw7XHJcbiAgICAgICAgdGhpcy5zcHJpdGVTaGVldC5vbmxvYWQgPSAoKSA9PiB7IHRoaXMuc3ByaXRlUmVhZHkgPSB0cnVlOyB9O1xyXG4gICAgICAgIHRoaXMubnVtYmVyT2ZGcmFtZXMgPSBudW1iZXJPZkZyYW1lcztcclxuICAgICAgICB0aGlzLm51bWJlck9mUm93cyA9IG51bWJlck9mUm93cztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jYW52YXNDb250ZXh0ID0gdGhpcy5nYW1lT2JqZWN0LmdldEdhbWVDYW52YXMoKS5nZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0gPSB0aGlzLmdhbWVPYmplY3QuZ2V0VHJhbnNmb3JtKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRyYXdTcHJpdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0QW5pbWF0aW9uU3BlZWQobnVtYmVyT2ZGcmFtZXNQZXJBbmltYXRpb25GcmFtZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5mcmFtZXNQZXJBbmltYXRpb25GcmFtZSA9IG51bWJlck9mRnJhbWVzUGVyQW5pbWF0aW9uRnJhbWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkcmF3U3ByaXRlKCk6IHZvaWQge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKCF0aGlzLnNwcml0ZVJlYWR5KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWVDb3VudCsrO1xyXG5cclxuICAgICAgICBpZih0aGlzLmFuaW1hdGlvbkZyYW1lQ291bnQgPj0gdGhpcy5mcmFtZXNQZXJBbmltYXRpb25GcmFtZSkge1xyXG4gICAgICAgICAgICB0aGlzLmZyYW1lSW5kZXggPSAodGhpcy5mcmFtZUluZGV4ICsgMSkgJSB0aGlzLm51bWJlck9mRnJhbWVzO1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lQ291bnQgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5mcmFtZUhlaWdodCA9IHRoaXMuc3ByaXRlU2hlZXQuaGVpZ2h0IC8gdGhpcy5udW1iZXJPZlJvd3M7XHJcbiAgICAgICAgdGhpcy5mcmFtZVdpZHRoID0gdGhpcy5zcHJpdGVTaGVldC53aWR0aCAvIHRoaXMubnVtYmVyT2ZGcmFtZXM7XHJcblxyXG4gICAgICAgIHRoaXMuY2FudmFzQ29udGV4dC5kcmF3SW1hZ2UodGhpcy5zcHJpdGVTaGVldCxcclxuICAgICAgICAgICAgdGhpcy5mcmFtZUluZGV4ICogdGhpcy5mcmFtZVdpZHRoLCAwLCAgIC8vIFN0YXJ0IG9mIHNsaWNlXHJcbiAgICAgICAgICAgIHRoaXMuZnJhbWVXaWR0aCwgdGhpcy5mcmFtZUhlaWdodCwgLy8gU2l6ZSBvZiBzbGljZVxyXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybS5wb3NpdGlvbi54LCB0aGlzLnRyYW5zZm9ybS5wb3NpdGlvbi55LCB0aGlzLnRyYW5zZm9ybS53aWR0aCwgdGhpcy50cmFuc2Zvcm0uaGVpZ2h0KTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi4vQ29yZS9HYW1lT2JqZWN0XCI7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ29tcG9uZW50IHtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgZ2FtZU9iamVjdDogR2FtZU9iamVjdDtcclxuXHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGdhbWVPYmplY3Q6IEdhbWVPYmplY3QpIHtcclxuICAgICAgICB0aGlzLmdhbWVPYmplY3QgPSBnYW1lT2JqZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGFydCgpOiB2b2lkIHt9O1xyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoKTogdm9pZCB7fTtcclxufSIsImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vQ29yZS9WZWN0b3IyXCI7XHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL0NvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBUcmFuc2Zvcm0gfSBmcm9tIFwiLi9UcmFuc2Zvcm1cIjtcclxuaW1wb3J0IHsgTGl0ZUV2ZW50IH0gZnJvbSBcIi4uL0NvcmUvSGVscGVycy9MaXRlRXZlbnRcIjtcclxuaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuLi9Db3JlL0dhbWVPYmplY3RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSZWN0YW5nbGVDb2xsaWRlciBleHRlbmRzIENvbXBvbmVudCB7XHJcblxyXG4gICAgcHVibGljIHRvcExlZnQ6IFZlY3RvcjI7XHJcbiAgICBwdWJsaWMgdG9wUmlnaHQ6IFZlY3RvcjI7XHJcbiAgICBwdWJsaWMgYm90dG9tTGVmdDogVmVjdG9yMjtcclxuICAgIHB1YmxpYyBib3R0b21SaWdodDogVmVjdG9yMjtcclxuICAgIHB1YmxpYyByZWFkb25seSB0cmFuc2Zvcm06IFRyYW5zZm9ybTtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IG9uQ29sbGlkZSA9IG5ldyBMaXRlRXZlbnQ8UmVjdGFuZ2xlQ29sbGlkZXI+KCk7XHJcblxyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihnYW1lT2JqZWN0OiBHYW1lT2JqZWN0KSB7XHJcbiAgICAgICAgc3VwZXIoZ2FtZU9iamVjdCk7XHJcblxyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtID0gZ2FtZU9iamVjdC5nZXRUcmFuc2Zvcm0oKTtcclxuICAgICAgICBsZXQgdHJhbnNmb3JtOiBUcmFuc2Zvcm0gPSB0aGlzLnRyYW5zZm9ybTtcclxuXHJcbiAgICAgICAgdHJhbnNmb3JtLm9uTW92ZWQuYWRkKCgpID0+IHRoaXMub25UcmFuc2Zvcm1Nb3ZlZCgpKTtcclxuXHJcbiAgICAgICAgdGhpcy50b3BMZWZ0ID0gbmV3IFZlY3RvcjIodHJhbnNmb3JtLnBvc2l0aW9uLngsIHRyYW5zZm9ybS5wb3NpdGlvbi55KTtcclxuICAgICAgICB0aGlzLnRvcFJpZ2h0ID0gbmV3IFZlY3RvcjIodHJhbnNmb3JtLnBvc2l0aW9uLnggKyB0cmFuc2Zvcm0ud2lkdGgsIHRyYW5zZm9ybS5wb3NpdGlvbi55KTtcclxuICAgICAgICB0aGlzLmJvdHRvbUxlZnQgPSBuZXcgVmVjdG9yMih0cmFuc2Zvcm0ucG9zaXRpb24ueCwgdHJhbnNmb3JtLnBvc2l0aW9uLnkgKyB0cmFuc2Zvcm0uaGVpZ2h0KTtcclxuICAgICAgICB0aGlzLmJvdHRvbVJpZ2h0ID0gbmV3IFZlY3RvcjIodHJhbnNmb3JtLnBvc2l0aW9uLnggKyB0cmFuc2Zvcm0ud2lkdGgsIHRyYW5zZm9ybS5wb3NpdGlvbi55ICsgdHJhbnNmb3JtLmhlaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRldGVjdENvbGxpc2lvbihvdGhlcjogUmVjdGFuZ2xlQ29sbGlkZXIpOiBib29sZWFuIHtcclxuICAgICAgICBcclxuICAgICAgICBpZighKG90aGVyLnRvcExlZnQueCA+IHRoaXMudG9wUmlnaHQueCB8fFxyXG4gICAgICAgICAgICBvdGhlci50b3BSaWdodC54IDwgdGhpcy50b3BMZWZ0LnggfHxcclxuICAgICAgICAgICAgb3RoZXIudG9wTGVmdC55ID4gdGhpcy5ib3R0b21MZWZ0LnkgfHxcclxuICAgICAgICAgICAgb3RoZXIuYm90dG9tTGVmdC55IDwgdGhpcy50b3BMZWZ0LnkpKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25Db2xsaWRlLnRyaWdnZXIob3RoZXIpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBvbkNvbGxpZGVkKCkgeyBcclxuICAgICAgICByZXR1cm4gdGhpcy5vbkNvbGxpZGUuZXhwb3NlKCk7IFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvblRyYW5zZm9ybU1vdmVkKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMudG9wTGVmdC54ID0gdGhpcy50cmFuc2Zvcm0ucG9zaXRpb24ueDtcclxuICAgICAgICB0aGlzLnRvcExlZnQueSA9IHRoaXMudHJhbnNmb3JtLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdGhpcy50b3BSaWdodC54ID0gdGhpcy50cmFuc2Zvcm0ucG9zaXRpb24ueCArIHRoaXMudHJhbnNmb3JtLndpZHRoO1xyXG4gICAgICAgIHRoaXMudG9wUmlnaHQueSA9IHRoaXMudHJhbnNmb3JtLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdGhpcy5ib3R0b21MZWZ0LnggPSB0aGlzLnRyYW5zZm9ybS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHRoaXMuYm90dG9tTGVmdC55ID0gdGhpcy50cmFuc2Zvcm0ucG9zaXRpb24ueSArIHRoaXMudHJhbnNmb3JtLmhlaWdodDtcclxuICAgICAgICB0aGlzLmJvdHRvbVJpZ2h0LnggPSB0aGlzLnRyYW5zZm9ybS5wb3NpdGlvbi54ICsgdGhpcy50cmFuc2Zvcm0ud2lkdGg7XHJcbiAgICAgICAgdGhpcy5ib3R0b21SaWdodC55ID0gdGhpcy50cmFuc2Zvcm0ucG9zaXRpb24ueSArIHRoaXMudHJhbnNmb3JtLmhlaWdodDtcclxuICAgIH1cclxufSIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL0NvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBUcmFuc2Zvcm0gfSBmcm9tIFwiLi9UcmFuc2Zvcm1cIjtcclxuaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuLi9Db3JlL0dhbWVPYmplY3RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSZWN0YW5nbGVSZW5kZXJlciBleHRlbmRzIENvbXBvbmVudCB7XHJcblxyXG4gICAgcHJpdmF0ZSB0cmFuc2Zvcm06IFRyYW5zZm9ybTtcclxuICAgIHByaXZhdGUgZ2FtZUNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBwcml2YXRlIGNhbnZhc0NvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICAgIHByaXZhdGUgY29sb3I6IHN0cmluZztcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoZ2FtZU9iamVjdDogR2FtZU9iamVjdCwgY29sb3I6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKGdhbWVPYmplY3QpO1xyXG5cclxuICAgICAgICB0aGlzLnRyYW5zZm9ybSA9IGdhbWVPYmplY3QuZ2V0VHJhbnNmb3JtKCk7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXJ0KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcyA9IHRoaXMuZ2FtZU9iamVjdC5nZXRHYW1lQ2FudmFzKCk7XHJcbiAgICAgICAgdGhpcy5jYW52YXNDb250ZXh0ID0gdGhpcy5nYW1lQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldENvbG9yKGNvbG9yOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW5kZXIoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jYW52YXNDb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XHJcbiAgICAgICAgdGhpcy5jYW52YXNDb250ZXh0LmZpbGxSZWN0KHRoaXMudHJhbnNmb3JtLnBvc2l0aW9uLngsIHRoaXMudHJhbnNmb3JtLnBvc2l0aW9uLnksIHRoaXMudHJhbnNmb3JtLndpZHRoLCB0aGlzLnRyYW5zZm9ybS5oZWlnaHQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vQ29tcG9uZW50XCI7XHJcbmltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vQ29yZS9WZWN0b3IyXCI7XHJcbmltcG9ydCB7IFRyYW5zZm9ybSB9IGZyb20gXCIuL1RyYW5zZm9ybVwiO1xyXG5pbXBvcnQgeyBHYW1lT2JqZWN0IH0gZnJvbSBcIi4uL0NvcmUvR2FtZU9iamVjdFwiO1xyXG5pbXBvcnQgeyBQaHlzaWNzIH0gZnJvbSBcIi4uL0NvcmUvUGh5c2ljc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJpZ2lkYm9keSBleHRlbmRzIENvbXBvbmVudCB7XHJcblxyXG4gICAgLy8gSW4ga2dcclxuICAgIHByaXZhdGUgbWFzczogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSB2ZWxvY2l0eTogVmVjdG9yMjtcclxuICAgIHByaXZhdGUgYWNjZWxlcmF0aW9uOiBWZWN0b3IyO1xyXG4gICAgXHJcbiAgICBwcml2YXRlIHRyYW5zZm9ybTogVHJhbnNmb3JtO1xyXG5cclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoZ2FtZU9iamVjdDogR2FtZU9iamVjdCwgbWFzczogbnVtYmVyID0gMSkge1xyXG4gICAgICAgIHN1cGVyKGdhbWVPYmplY3QpO1xyXG5cclxuICAgICAgICB0aGlzLnRyYW5zZm9ybSA9IGdhbWVPYmplY3QuZ2V0VHJhbnNmb3JtKCk7XHJcbiAgICAgICAgdGhpcy5tYXNzID0gbWFzcztcclxuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gbmV3IFZlY3RvcjIoMCwgMCk7XHJcbiAgICAgICAgdGhpcy5hY2NlbGVyYXRpb24gPSBuZXcgVmVjdG9yMigwLCAwKTtcclxuICAgICAgICBQaHlzaWNzLkluc3RhbmNlLmFkZFJpZ2lkYm9keSh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKCk6IHZvaWQge1xyXG4gICAgICAgIC8vdGhpcy5hY2NlbGVyYXRpb24ueCA9IFxyXG4gICAgICAgIC8vdGhpcy50cmFuc2Zvcm0udHJhbnNsYXRlKHRoaXMudmVsb2NpdHkueCwgdGhpcy52ZWxvY2l0eS55KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkRm9yY2UoZm9yY2U6IFZlY3RvcjIpOiB2b2lkIHtcclxuICAgICAgICAvL3RoaXMuYWNjZWxlcmF0aW9uLnggPSBmb3JjZSAqIE1hdGguc2luKHRoaXMudHJhbnNmb3JtLnJvdGF0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkR3Jhdml0eShmb3JjZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgLy90aGlzLnRyYW5zZm9ybS50cmFuc2xhdGUoMCwgMSwgZm9yY2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlVmVsb2NpdHkoKTogdm9pZCB7XHJcblxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vQ29tcG9uZW50XCI7XHJcbmltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vQ29yZS9WZWN0b3IyXCI7XHJcbmltcG9ydCB7IExpdGVFdmVudCB9IGZyb20gXCIuLi9Db3JlL0hlbHBlcnMvTGl0ZUV2ZW50XCI7XHJcbmltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi4vQ29yZS9HYW1lT2JqZWN0XCI7XHJcbmltcG9ydCB7IElMaXRlRXZlbnQgfSBmcm9tIFwiLi4vQ29yZS9JbnRlcmZhY2VzL0lMaXRlRXZlbnRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm0gZXh0ZW5kcyBDb21wb25lbnQge1xyXG5cclxuICAgIHB1YmxpYyB3aWR0aDogbnVtYmVyID0gMDtcclxuICAgIHB1YmxpYyBoZWlnaHQ6IG51bWJlciA9IDA7XHJcbiAgICAvL1Bvc2l0aW9uIGlzIHRoZSB0b3AgbGVmdCBvZiB0aGUgYWdlbnQgd2l0aCB3aWR0aCBncm93aW5nIHJpZ2h0IGFuZCBoZWlnaHQgZ3Jvd2luZyBkb3duLlxyXG4gICAgcHVibGljIHJlYWRvbmx5IHBvc2l0aW9uOiBWZWN0b3IyO1xyXG4gICAgLy9Sb3RhdGlvbiBpbiByYWRpYW5zXHJcbiAgICBwdWJsaWMgcm90YXRpb246IG51bWJlcjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IG9uTW92ZSA9IG5ldyBMaXRlRXZlbnQ8dm9pZD4oKTtcclxuXHJcbiAgICBcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihnYW1lT2JqZWN0OiBHYW1lT2JqZWN0LCB4OiBudW1iZXIsIHk6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlcihnYW1lT2JqZWN0KTtcclxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBWZWN0b3IyKHgsIHkpO1xyXG4gICAgICAgIHRoaXMucm90YXRpb24gPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgb25Nb3ZlZCgpOiBJTGl0ZUV2ZW50PHZvaWQ+IHsgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMub25Nb3ZlLmV4cG9zZSgpOyBcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGNlbnRlcigpOiBWZWN0b3IyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcy5wb3NpdGlvbi54ICsgKHRoaXMud2lkdGggLyAyKSwgdGhpcy5wb3NpdGlvbi55ICsgKHRoaXMuaGVpZ2h0IC8gMikpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgYm90dG9tQ2VudGVyKCk6IFZlY3RvcjIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMih0aGlzLnBvc2l0aW9uLnggKyAodGhpcy53aWR0aCAvIDIpLCB0aGlzLnBvc2l0aW9uLnkgKyB0aGlzLmhlaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRyYW5zbGF0ZSh0cmFuc2xhdGlvbjogVmVjdG9yMik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24ueCArPSB0cmFuc2xhdGlvbi54O1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24ueSArPSAoLTEgKiB0cmFuc2xhdGlvbi55KTsgLy9UaGlzIGlzIHRvIG1ha2UgYSBtb3JlIHBvc2l0aXZlIHkgdmFsdWUgZ28gdXAgaW5zdGVhZCBvZiBkb3duLlxyXG4gICAgICAgIHRoaXMub25Nb3ZlLnRyaWdnZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0UG9zaXRpb24oeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uLnggPSB4O1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24ueSA9IHk7XHJcbiAgICAgICAgdGhpcy5vbk1vdmUudHJpZ2dlcigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUGh5c2ljcyB9IGZyb20gXCIuL1BoeXNpY3NcIjtcclxuaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuL0dhbWVPYmplY3RcIjtcclxuaW1wb3J0IHsgVGltZSB9IGZyb20gXCIuL1RpbWVcIjtcclxuaW1wb3J0IHsgSUJhY2tncm91bmQgfSBmcm9tIFwiLi9JbnRlcmZhY2VzL0lCYWNrZ3JvdW5kXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgR2FtZUVuZ2luZSB7XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IEdhbWVFbmdpbmU7XHJcblxyXG4gICAgcHJpdmF0ZSBnYW1lQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIHByaXZhdGUgY2FudmFzQ29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gICAgcHJpdmF0ZSBiYWNrZ3JvdW5kOiBJQmFja2dyb3VuZDtcclxuICAgIHByaXZhdGUgcGh5c2ljc0VuZ2luZTogUGh5c2ljcztcclxuICAgIHByaXZhdGUgZ2FtZU9iamVjdHM6IEdhbWVPYmplY3RbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBnYW1lT2JqZWN0TWFwOiBNYXA8c3RyaW5nLCBHYW1lT2JqZWN0PiA9IG5ldyBNYXA8c3RyaW5nLCBHYW1lT2JqZWN0PigpO1xyXG4gICAgcHJpdmF0ZSBnYW1lSW5pdGlhbGl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgcGF1c2VkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG5cclxuICAgIHByaXZhdGUgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lSW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnBoeXNpY3NFbmdpbmUgPSBQaHlzaWNzLkluc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IEluc3RhbmNlKCk6IEdhbWVFbmdpbmUge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlIHx8ICh0aGlzLmluc3RhbmNlID0gbmV3IEdhbWVFbmdpbmUoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGluaXRpYWxpemVHYW1lKGdhbWVDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBnYW1lT2JqZWN0czogR2FtZU9iamVjdFtdLCBiYWNrZ3JvdW5kOiBJQmFja2dyb3VuZCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYmFja2dyb3VuZCA9IGJhY2tncm91bmQ7XHJcbiAgICAgICAgdGhpcy5zZXRHYW1lQ2FudmFzKGdhbWVDYW52YXMpO1xyXG4gICAgICAgIHRoaXMuc2V0R2FtZU9iamVjdHMoZ2FtZU9iamVjdHMpO1xyXG4gICAgICAgICBcclxuICAgICAgICB0aGlzLmdhbWVJbml0aWFsaXplZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXJ0R2FtZSgpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgaWYoIXRoaXMuZ2FtZUluaXRpYWxpemVkKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBnYW1lIGlzIG5vdCBpbml0aWFsaXplZCB5ZXQhXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgVGltZS5zdGFydCgpO1xyXG4gICAgICAgIHRoaXMucGF1c2VkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGZvcihsZXQgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMuZ2FtZU9iamVjdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5nYW1lT2JqZWN0c1tpXS5zdGFydCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuZ2FtZUxvb3AoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGluc3RhbnRpYXRlKG5ld0dhbWVPYmplY3Q6IEdhbWVPYmplY3QpOiBHYW1lT2JqZWN0IHtcclxuICAgICAgICB0aGlzLmdhbWVPYmplY3RzLnB1c2gobmV3R2FtZU9iamVjdCk7XHJcbiAgICAgICAgbmV3R2FtZU9iamVjdC5zdGFydCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBuZXdHYW1lT2JqZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRHYW1lT2JqZWN0QnlJZChpZDogc3RyaW5nKTogR2FtZU9iamVjdCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmdhbWVPYmplY3RNYXAuaGFzKGlkKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBHYW1lT2JqZWN0IHdpdGggaWQgb2YgXCIgKyBpZCArIFwiIGV4aXN0cyFcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5nYW1lT2JqZWN0TWFwLmdldChpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEdhbWVDYW52YXMoKTogSFRNTENhbnZhc0VsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdhbWVDYW52YXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEdhbWVDYW52YXNDb250ZXh0KCk6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FudmFzQ29udGV4dDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcHJpbnRHYW1lRGF0YSgpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlRpbWUgc2luY2UgZ2FtZSBzdGFydCBcIiArIFRpbWUuVG90YWxUaW1lICsgXCJzXCIpO1xyXG5cclxuICAgICAgICBmb3IobGV0IGk6IG51bWJlciA9IDA7IGkgPCB0aGlzLmdhbWVPYmplY3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZ2FtZU9iamVjdHNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9nZ2xlUGF1c2UoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5wYXVzZWQgPSAhdGhpcy5wYXVzZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRHYW1lQ2FudmFzKGdhbWVDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5nYW1lQ2FudmFzID0gZ2FtZUNhbnZhcztcclxuICAgICAgICB0aGlzLmNhbnZhc0NvbnRleHQgPSB0aGlzLmdhbWVDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0R2FtZU9iamVjdHMoZ2FtZU9iamVjdHM6IEdhbWVPYmplY3RbXSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2FtZU9iamVjdHMgPSBnYW1lT2JqZWN0cztcclxuXHJcbiAgICAgICAgZm9yIChsZXQgZ2FtZU9iamVjdCBvZiBnYW1lT2JqZWN0cykge1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuZ2FtZU9iamVjdE1hcC5oYXMoZ2FtZU9iamVjdC5pZCkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkR1cGxpY2F0ZSBnYW1lIG9iamVjdCBvZiBcIiArIGdhbWVPYmplY3QuaWQgKyBcIiFcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZU9iamVjdE1hcC5zZXQoZ2FtZU9iamVjdC5pZCwgZ2FtZU9iamVjdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlKCk6IHZvaWQge1xyXG4gICAgICAgIFRpbWUudXBkYXRlVGltZSgpO1xyXG4gICAgICAgIHRoaXMucGh5c2ljc0VuZ2luZS51cGRhdGVQaHlzaWNzKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5nYW1lT2JqZWN0cy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZU9iamVjdHNbaV0udXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVuZGVyQmFja2dyb3VuZCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmJhY2tncm91bmQucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnYW1lTG9vcCgpOiB2b2lkIHtcclxuICAgICAgICBpZighdGhpcy5wYXVzZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJCYWNrZ3JvdW5kKCk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgXHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuZ2FtZUxvb3AoKSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBUcmFuc2Zvcm0gfSBmcm9tIFwiLi4vQ29tcG9uZW50cy9UcmFuc2Zvcm1cIjtcclxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4uL0NvbXBvbmVudHMvQ29tcG9uZW50XCI7XHJcbmltcG9ydCB7IEdhbWVFbmdpbmUgfSBmcm9tIFwiLi9HYW1lRW5naW5lXCI7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgR2FtZU9iamVjdCB7XHJcbiAgICBcclxuICAgIHB1YmxpYyByZWFkb25seSBpZDogc3RyaW5nO1xyXG5cclxuICAgIHByb3RlY3RlZCB0cmFuc2Zvcm06IFRyYW5zZm9ybTtcclxuICAgIHByb3RlY3RlZCBnYW1lQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIHByb3RlY3RlZCBjYW52YXNDb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgICBwcm90ZWN0ZWQgY29tcG9uZW50czogQ29tcG9uZW50W10gPSBbXTtcclxuICAgIHByb3RlY3RlZCBjb21wb25lbnRNYXA6IE1hcDxzdHJpbmcsIENvbXBvbmVudD4gPSBuZXcgTWFwPHN0cmluZywgQ29tcG9uZW50PigpO1xyXG4gICAgXHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIHg6IG51bWJlciA9IDAsIHk6IG51bWJlciA9IDAsIHdpZHRoOiBudW1iZXIgPSAwLCBoZWlnaHQ6IG51bWJlciA9IDApIHtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0gPSBuZXcgVHJhbnNmb3JtKHRoaXMsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGFydCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMgPSBHYW1lRW5naW5lLkluc3RhbmNlLmdldEdhbWVDYW52YXMoKTtcclxuICAgICAgICB0aGlzLmNhbnZhc0NvbnRleHQgPSB0aGlzLmdhbWVDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cclxuICAgICAgICBmb3IobGV0IGk6IG51bWJlciA9IDA7IGkgPCB0aGlzLmNvbXBvbmVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzW2ldLnN0YXJ0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgZm9yKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5jb21wb25lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50c1tpXS51cGRhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFRyYW5zZm9ybSgpOiBUcmFuc2Zvcm0ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0R2FtZUNhbnZhcygpOiBIVE1MQ2FudmFzRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2FtZUNhbnZhcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q29tcG9uZW50PFQgZXh0ZW5kcyBDb21wb25lbnQ+KGNvbXBvbmVudDogbmV3ICguLi5hcmdzOiBhbnlbXSkgPT4gVCk6IFQge1xyXG4gICAgICAgIGxldCBjb21wb25lbnRUeXBlID0gY29tcG9uZW50Lm5hbWU7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5jb21wb25lbnRNYXAuaGFzKGNvbXBvbmVudFR5cGUpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihjb21wb25lbnRUeXBlICsgXCIgbm90IGZvdW5kIG9uIHRoZSBHYW1lT2JqZWN0IHdpdGggaWQgb2YgXCIgKyB0aGlzLmlkICsgXCIhXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIDxUPnRoaXMuY29tcG9uZW50TWFwLmdldChjb21wb25lbnRUeXBlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQ29tcG9uZW50PFQgZXh0ZW5kcyBDb21wb25lbnQ+KG5ld0NvbXBvbmVudDogQ29tcG9uZW50KTogVCB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29tcG9uZW50TWFwLmhhcyhuZXdDb21wb25lbnQuY29uc3RydWN0b3IubmFtZSkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlcmUgaXMgYWxyZWFkeSBhIGNvbXBvbmVudCBvZiB0eXBlIFwiICsgbmV3Q29tcG9uZW50LmNvbnN0cnVjdG9yLm5hbWUgKyBcIiBvbiB0aGlzIG9iamVjdCFcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNvbXBvbmVudHMucHVzaChuZXdDb21wb25lbnQpO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50TWFwLnNldChuZXdDb21wb25lbnQuY29uc3RydWN0b3IubmFtZSwgbmV3Q29tcG9uZW50KTtcclxuICAgICAgICBuZXdDb21wb25lbnQuc3RhcnQoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIDxUPm5ld0NvbXBvbmVudDtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgc2V0Q29tcG9uZW50cyhjb21wb25lbnRzOiBDb21wb25lbnRbXSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50cyA9IGNvbXBvbmVudHM7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGNvbXBvbmVudCBvZiBjb21wb25lbnRzKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbXBvbmVudE1hcC5oYXMoY29tcG9uZW50LmNvbnN0cnVjdG9yLm5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGVyZSBpcyBhbHJlYWR5IGEgY29tcG9uZW50IG9mIHR5cGUgXCIgKyBjb21wb25lbnQuY29uc3RydWN0b3IubmFtZSArIFwiIG9uIHRoaXMgb2JqZWN0IVwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRNYXAuc2V0KGNvbXBvbmVudC5jb25zdHJ1Y3Rvci5uYW1lLCBjb21wb25lbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImV4cG9ydCBlbnVtIEtleXMge1xyXG4gICAgVVAgPSAzOCxcclxuICAgIERPV04gPSA0MCxcclxuICAgIExFRlQgPSAzNyxcclxuICAgIFJJR0hUID0gMzksXHJcbiAgICBXID0gODcsXHJcbiAgICBBID0gNjUsXHJcbiAgICBTID0gODMsXHJcbiAgICBEID0gNjgsXHJcbiAgICBTUEFDRSA9IDMyXHJcbn0iLCJpbXBvcnQgeyBJTGl0ZUV2ZW50IH0gZnJvbSBcIi4uL0ludGVyZmFjZXMvSUxpdGVFdmVudFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExpdGVFdmVudDxUPiBpbXBsZW1lbnRzIElMaXRlRXZlbnQ8VD4ge1xyXG5cclxuICAgIHByaXZhdGUgaGFuZGxlcnM6IHsgKGRhdGE/OiBUKTogdm9pZDsgfVtdID0gW107XHJcblxyXG5cclxuICAgIHB1YmxpYyBhZGQoaGFuZGxlcjogeyAoZGF0YT86IFQpOiB2b2lkIH0pIDogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmUoaGFuZGxlcjogeyAoZGF0YT86IFQpOiB2b2lkIH0pIDogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycyA9IHRoaXMuaGFuZGxlcnMuZmlsdGVyKGggPT4gaCAhPT0gaGFuZGxlcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRyaWdnZXIoZGF0YT86IFQpIHtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNsaWNlKDApLmZvckVhY2goaCA9PiBoKGRhdGEpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZXhwb3NlKCkgOiBJTGl0ZUV2ZW50PFQ+IHtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufSIsImltcG9ydCB7IElCYWNrZ3JvdW5kIH0gZnJvbSBcIi4vSW50ZXJmYWNlcy9JQmFja2dyb3VuZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEltYWdlQmFja2dyb3VuZCBpbXBsZW1lbnRzIElCYWNrZ3JvdW5kIHtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBnYW1lQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIHByaXZhdGUgY2FudmFzQ29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gICAgcHJpdmF0ZSBpbWFnZTogSFRNTEltYWdlRWxlbWVudDtcclxuXHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGdhbWVDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBpbWFnZVNyYzogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5pbWFnZSA9IG5ldyBJbWFnZShnYW1lQ2FudmFzLndpZHRoLCBnYW1lQ2FudmFzLmhlaWdodCk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5zcmMgPSBpbWFnZVNyYztcclxuICAgICAgICB0aGlzLmNhbnZhc0NvbnRleHQgPSBnYW1lQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMgPSBnYW1lQ2FudmFzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgcmVuZGVyKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY2FudmFzQ29udGV4dC5kcmF3SW1hZ2UodGhpcy5pbWFnZSwgMCwgMCwgdGhpcy5nYW1lQ2FudmFzLndpZHRoLCB0aGlzLmdhbWVDYW52YXMuaGVpZ2h0KTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJpZ2lkYm9keSB9IGZyb20gXCIuLi9Db21wb25lbnRzL1JpZ2lkYm9keVwiO1xyXG5pbXBvcnQgeyBSZWN0YW5nbGVDb2xsaWRlciB9IGZyb20gXCIuLi9Db21wb25lbnRzL1JlY3RhbmdsZUNvbGxpZGVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUGh5c2ljcyB7XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IFBoeXNpY3M7XHJcblxyXG4gICAgcHVibGljIGdyYXZpdHk6IG51bWJlcjtcclxuXHJcbiAgICBwcml2YXRlIHJpZ2lkYm9kaWVzOiBSaWdpZGJvZHlbXTtcclxuICAgIHByaXZhdGUgY29sbGlkZXJzOiBSZWN0YW5nbGVDb2xsaWRlcltdO1xyXG5cclxuXHJcbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMucmlnaWRib2RpZXMgPSBbXTtcclxuICAgICAgICB0aGlzLmNvbGxpZGVycyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZ3Jhdml0eSA9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgSW5zdGFuY2UoKTogUGh5c2ljcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UgfHwgKHRoaXMuaW5zdGFuY2UgPSBuZXcgUGh5c2ljcygpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlUGh5c2ljcygpOiB2b2lkIHtcclxuICAgICAgICBmb3IobGV0IGk6IG51bWJlciA9IDAsIGw6IG51bWJlciA9IHRoaXMucmlnaWRib2RpZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmlnaWRib2RpZXNbaV0uYWRkR3Jhdml0eSh0aGlzLmdyYXZpdHkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkUmlnaWRib2R5KHJiOiBSaWdpZGJvZHkpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnJpZ2lkYm9kaWVzLnB1c2gocmIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcmF5Y2FzdCgpIHt9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBzcGhlcmVDYXN0KCkge31cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIG92ZXJsYXBTcGhlcmUoKTogUmVjdGFuZ2xlQ29sbGlkZXJbXSB7IHJldHVybiBbXSB9XHJcbn0iLCJleHBvcnQgYWJzdHJhY3QgY2xhc3MgVGltZSB7XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZGVsdGFUaW1lOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgc3RhcnRUaW1lOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcHJldlRpbWU6IG51bWJlciA9IDA7XHJcblxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IERlbHRhVGltZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRlbHRhVGltZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBUb3RhbFRpbWUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gKERhdGUubm93KCkgLSB0aGlzLnN0YXJ0VGltZSkgLyAxMDAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgc3RhcnQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5wcmV2VGltZSA9IERhdGUubm93KCk7XHJcbiAgICAgICAgdGhpcy5zdGFydFRpbWUgPSB0aGlzLnByZXZUaW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgdXBkYXRlVGltZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRlbHRhVGltZSA9IChEYXRlLm5vdygpIC0gdGhpcy5wcmV2VGltZSkgLyAxMDAwO1xyXG4gICAgICAgIHRoaXMucHJldlRpbWUgPSBEYXRlLm5vdygpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIFZlY3RvcjIge1xyXG4gICAgXHJcbiAgICBwdWJsaWMgeDogbnVtYmVyID0gMDtcclxuICAgIHB1YmxpYyB5OiBudW1iZXIgPSAwO1xyXG5cclxuICAgIFxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc3FyTWFnbml0dWRlKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLnggKiB0aGlzLngpICsgKHRoaXMueSAqIHRoaXMueSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBtYWduaXR1ZGUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMuc3FyTWFnbml0dWRlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG5vcm1hbGl6ZWQoKTogVmVjdG9yMiB7XHJcbiAgICAgICAgaWYgKHRoaXMubWFnbml0dWRlID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigxLCAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRpdmlkZShuZXcgVmVjdG9yMih0aGlzLm1hZ25pdHVkZSwgdGhpcy5tYWduaXR1ZGUpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkKHJpZ2h0T3BlcmFuZDogVmVjdG9yMik6IFZlY3RvcjIge1xyXG4gICAgICAgIGxldCBuZXdYID0gdGhpcy54ICsgcmlnaHRPcGVyYW5kLng7XHJcbiAgICAgICAgbGV0IG5ld1kgPSB0aGlzLnkgKyByaWdodE9wZXJhbmQueTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKG5ld1gsIG5ld1kpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdWJ0cmFjdChyaWdodE9wZXJhbmQ6IFZlY3RvcjIpOiBWZWN0b3IyIHtcclxuICAgICAgICBsZXQgbmV3WCA9IHRoaXMueCAtIHJpZ2h0T3BlcmFuZC54O1xyXG4gICAgICAgIGxldCBuZXdZID0gdGhpcy55IC0gcmlnaHRPcGVyYW5kLnk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMihuZXdYLCBuZXdZKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbXVsdGlwbHkocmlnaHRPcGVyYW5kOiBWZWN0b3IyKTogVmVjdG9yMiB7XHJcbiAgICAgICAgbGV0IG5ld1ggPSB0aGlzLnggKiByaWdodE9wZXJhbmQueDtcclxuICAgICAgICBsZXQgbmV3WSA9IHRoaXMueSAqIHJpZ2h0T3BlcmFuZC55O1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIobmV3WCwgbmV3WSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpdmlkZShyaWdodE9wZXJhbmQ6IFZlY3RvcjIpOiBWZWN0b3IyIHtcclxuICAgICAgICBsZXQgbmV3WCA9IHRoaXMueCAvIHJpZ2h0T3BlcmFuZC54O1xyXG4gICAgICAgIGxldCBuZXdZID0gdGhpcy55IC8gcmlnaHRPcGVyYW5kLnk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMihuZXdYLCBuZXdZKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZXF1YWxzKHJpZ2h0T3BlcmFuZDogVmVjdG9yMik6IGJvb2xlYW4ge1xyXG4gICAgICAgIGxldCBlcXVhbFggPSB0aGlzLnggPT09IHJpZ2h0T3BlcmFuZC54O1xyXG4gICAgICAgIGxldCBlcXVhbFkgPSB0aGlzLnkgPT09IHJpZ2h0T3BlcmFuZC55O1xyXG5cclxuICAgICAgICByZXR1cm4gZXF1YWxYICYmIGVxdWFsWTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbXVsdGlwbHlTY2FsYXIocmlnaHRPcGVyYW5kOiBudW1iZXIpOiBWZWN0b3IyIHtcclxuICAgICAgICBsZXQgbmV3WCA9IHRoaXMueCAqIHJpZ2h0T3BlcmFuZDtcclxuICAgICAgICBsZXQgbmV3WSA9IHRoaXMueSAqIHJpZ2h0T3BlcmFuZDtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKG5ld1gsIG5ld1kpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IHVwKCk6IFZlY3RvcjIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigwLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBkb3duKCk6IFZlY3RvcjIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigwLCAtMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgbGVmdCgpOiBWZWN0b3IyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoLTEsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IHJpZ2h0KCk6IFZlY3RvcjIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigxLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCB6ZXJvKCk6IFZlY3RvcjIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBvbmUoKTogVmVjdG9yMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKDEsIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZGlzdGFuY2UocG9pbnQxOiBWZWN0b3IyLCBwb2ludDI6IFZlY3RvcjIpOiBudW1iZXIge1xyXG4gICAgICAgIGxldCBkaXN0YW5jZVg6IG51bWJlciA9IHBvaW50MS54IC0gcG9pbnQyLng7XHJcbiAgICAgICAgbGV0IGRpc3RhbmNlWTogbnVtYmVyID0gcG9pbnQxLnkgLSBwb2ludDIueTtcclxuXHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCgoZGlzdGFuY2VYICogZGlzdGFuY2VYKSArIChkaXN0YW5jZVkgKiBkaXN0YW5jZVkpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGFuZ2xlKGZyb206IFZlY3RvcjIsIHRvOiBWZWN0b3IyKTogbnVtYmVyIHtcclxuICAgICAgICBsZXQgY29zMCA9IFZlY3RvcjIuZG90KGZyb20sIHRvKSAvIChmcm9tLm1hZ25pdHVkZSAqIHRvLm1hZ25pdHVkZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBNYXRoLmFjb3MoY29zMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkb3QocG9pbnQxOiBWZWN0b3IyLCBwb2ludDI6IFZlY3RvcjIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiAocG9pbnQxLnggKiBwb2ludDIueCkgKyAocG9pbnQxLnkgKiBwb2ludDIueSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBNb3RvciB9IGZyb20gXCIuL01vdG9yXCI7XHJcbmltcG9ydCB7IFJlY3RhbmdsZUNvbGxpZGVyIH0gZnJvbSBcIi4uLy4uL0dhbWVFbmdpbmUvQ29tcG9uZW50cy9SZWN0YW5nbGVDb2xsaWRlclwiO1xyXG5pbXBvcnQgeyBHYW1lT2JqZWN0IH0gZnJvbSBcIi4uLy4uL0dhbWVFbmdpbmUvQ29yZS9HYW1lT2JqZWN0XCI7XHJcbmltcG9ydCB7IEdhbWVFbmdpbmUgfSBmcm9tIFwiLi4vLi4vR2FtZUVuZ2luZS9Db3JlL0dhbWVFbmdpbmVcIjtcclxuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi8uLi9HYW1lRW5naW5lL0NvcmUvVmVjdG9yMlwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJhbGxNb3RvciBleHRlbmRzIE1vdG9yIHtcclxuXHJcbiAgICBwcml2YXRlIHBsYXllckNvbGxpZGVyOiBSZWN0YW5nbGVDb2xsaWRlcjtcclxuICAgIHByaXZhdGUgY29tcHV0ZXJDb2xsaWRlcjogUmVjdGFuZ2xlQ29sbGlkZXI7XHJcbiAgICBwcml2YXRlIGNvbGxpZGVyOiBSZWN0YW5nbGVDb2xsaWRlcjtcclxuXHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGdhbWVPYmplY3Q6IEdhbWVPYmplY3QpIHtcclxuICAgICAgICBzdXBlcihnYW1lT2JqZWN0KTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXNldCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGFydCgpOiB2b2lkIHtcclxuICAgICAgICBzdXBlci5zdGFydCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuY29sbGlkZXIgPSB0aGlzLmdhbWVPYmplY3QuZ2V0Q29tcG9uZW50PFJlY3RhbmdsZUNvbGxpZGVyPihSZWN0YW5nbGVDb2xsaWRlcik7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJDb2xsaWRlciA9IEdhbWVFbmdpbmUuSW5zdGFuY2UuZ2V0R2FtZU9iamVjdEJ5SWQoXCJwbGF5ZXJcIikuZ2V0Q29tcG9uZW50PFJlY3RhbmdsZUNvbGxpZGVyPihSZWN0YW5nbGVDb2xsaWRlcik7XHJcbiAgICAgICAgdGhpcy5jb21wdXRlckNvbGxpZGVyID0gR2FtZUVuZ2luZS5JbnN0YW5jZS5nZXRHYW1lT2JqZWN0QnlJZChcImNvbXB1dGVyXCIpLmdldENvbXBvbmVudDxSZWN0YW5nbGVDb2xsaWRlcj4oUmVjdGFuZ2xlQ29sbGlkZXIpO1xyXG5cclxuICAgICAgICAvL3RoaXMuY29sbGlkZXIub25Db2xsaWRlZC5hZGQoKG90aGVyOiBSZWN0YW5nbGVDb2xsaWRlcikgPT4gdGhpcy53aG9JSGl0KG90aGVyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgICAgICBzdXBlci51cGRhdGUoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmhhbmRsZUNvbGxpc2lvbnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHdob0lIaXQob3RoZXI6IFJlY3RhbmdsZUNvbGxpZGVyKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJJIGhpdCBcIiArIG90aGVyLmdhbWVPYmplY3QuaWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBoYW5kbGVPdXRPZkJvdW5kcygpOiB2b2lkIHtcclxuICAgICAgICBpZih0aGlzLnRyYW5zZm9ybS5wb3NpdGlvbi55IDw9IDApIHtcclxuICAgICAgICAgICAgdGhpcy55VmVsb2NpdHkgKj0gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodGhpcy50cmFuc2Zvcm0ucG9zaXRpb24ueSA+PSB0aGlzLmdhbWVDYW52YXMuaGVpZ2h0IC0gdGhpcy50cmFuc2Zvcm0uaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHRoaXMueVZlbG9jaXR5ID0gTWF0aC5hYnModGhpcy55VmVsb2NpdHkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy50cmFuc2Zvcm0ucG9zaXRpb24ueCArIHRoaXMudHJhbnNmb3JtLndpZHRoIDw9IDApIHtcclxuICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRoaXMudHJhbnNmb3JtLnBvc2l0aW9uLnggPj0gdGhpcy5nYW1lQ2FudmFzLndpZHRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG1vdmUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0udHJhbnNsYXRlKG5ldyBWZWN0b3IyKHRoaXMueFZlbG9jaXR5LCB0aGlzLnlWZWxvY2l0eSkubXVsdGlwbHlTY2FsYXIodGhpcy5zcGVlZCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVzZXQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0uc2V0UG9zaXRpb24oMzQ1LCAxOTUpO1xyXG4gICAgICAgIHRoaXMueFZlbG9jaXR5ID0gTWF0aC5yYW5kb20oKSA8IDAuNSA/IC0xIDogMTtcclxuICAgICAgICB0aGlzLnlWZWxvY2l0eSA9IE1hdGgucmFuZG9tKCkgPCAwLjUgPyAtMSA6IDE7XHJcbiAgICAgICAgdGhpcy5zcGVlZCA9IDM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBoYW5kbGVDb2xsaXNpb25zKCk6IHZvaWQge1xyXG4gICAgICAgIGlmKHRoaXMuY29sbGlkZXIuZGV0ZWN0Q29sbGlzaW9uKHRoaXMucGxheWVyQ29sbGlkZXIpKSB7XHJcbiAgICAgICAgICAgIHRoaXMueFZlbG9jaXR5ID0gMTtcclxuICAgICAgICAgICAgdGhpcy5zcGVlZCArPSAwLjEyNTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0aGlzLmNvbGxpZGVyLmRldGVjdENvbGxpc2lvbih0aGlzLmNvbXB1dGVyQ29sbGlkZXIpKSB7XHJcbiAgICAgICAgICAgIHRoaXMueFZlbG9jaXR5ID0gLTE7XHJcbiAgICAgICAgICAgIHRoaXMuc3BlZWQgKz0gMC4xMjU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgTW90b3IgfSBmcm9tIFwiLi9Nb3RvclwiO1xyXG5pbXBvcnQgeyBUcmFuc2Zvcm0gfSBmcm9tIFwiLi4vLi4vR2FtZUVuZ2luZS9Db21wb25lbnRzL1RyYW5zZm9ybVwiO1xyXG5pbXBvcnQgeyBHYW1lT2JqZWN0IH0gZnJvbSBcIi4uLy4uL0dhbWVFbmdpbmUvQ29yZS9HYW1lT2JqZWN0XCI7XHJcbmltcG9ydCB7IEdhbWVFbmdpbmUgfSBmcm9tIFwiLi4vLi4vR2FtZUVuZ2luZS9Db3JlL0dhbWVFbmdpbmVcIjtcclxuaW1wb3J0IHsgVGltZSB9IGZyb20gXCIuLi8uLi9HYW1lRW5naW5lL0NvcmUvVGltZVwiO1xyXG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4uLy4uL0dhbWVFbmdpbmUvQ29yZS9WZWN0b3IyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29tcHV0ZXJNb3RvciBleHRlbmRzIE1vdG9yIHtcclxuXHJcbiAgICBwcml2YXRlIGJhbGxUcmFuc2Zvcm06IFRyYW5zZm9ybTtcclxuICAgIHByaXZhdGUgdGltZXI6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIHF1YXJ0ZXJGaWVsZFg6IG51bWJlcjtcclxuICAgIHByaXZhdGUgbWlkRmllbGRZOiBudW1iZXI7XHJcblxyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihnYW1lT2JqZWN0OiBHYW1lT2JqZWN0KSB7XHJcbiAgICAgICAgc3VwZXIoZ2FtZU9iamVjdCk7XHJcblxyXG4gICAgICAgIHRoaXMueVZlbG9jaXR5ID0gMTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnQoKTogdm9pZCB7XHJcbiAgICAgICAgc3VwZXIuc3RhcnQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5iYWxsVHJhbnNmb3JtID0gR2FtZUVuZ2luZS5JbnN0YW5jZS5nZXRHYW1lT2JqZWN0QnlJZChcImJhbGxcIikuZ2V0VHJhbnNmb3JtKCk7XHJcbiAgICAgICAgdGhpcy5xdWFydGVyRmllbGRYID0gdGhpcy5nYW1lQ2FudmFzLndpZHRoIC8gNDtcclxuICAgICAgICB0aGlzLm1pZEZpZWxkWSA9IHRoaXMuZ2FtZUNhbnZhcy5oZWlnaHQgLyAyO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBoYW5kbGVPdXRPZkJvdW5kcygpOiB2b2lkIHtcclxuICAgICAgICBpZih0aGlzLnRyYW5zZm9ybS5wb3NpdGlvbi55IDw9IDApIHtcclxuICAgICAgICAgICAgdGhpcy55VmVsb2NpdHkgPSAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0aGlzLnRyYW5zZm9ybS5wb3NpdGlvbi55ID49IHRoaXMuZ2FtZUNhbnZhcy5oZWlnaHQgLSB0aGlzLnRyYW5zZm9ybS5oZWlnaHQpIHtcclxuICAgICAgICAgICAgdGhpcy55VmVsb2NpdHkgPSAxO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgbW92ZSgpOiB2b2lkIHtcclxuICAgICAgICBpZih0aGlzLmJhbGxUcmFuc2Zvcm0ucG9zaXRpb24ueCA8IHRoaXMucXVhcnRlckZpZWxkWCkge1xyXG4gICAgICAgICAgICBpZih0aGlzLnRyYW5zZm9ybS5wb3NpdGlvbi55ID4gdGhpcy5taWRGaWVsZFkgKyA1KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnlWZWxvY2l0eSA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih0aGlzLnRyYW5zZm9ybS5wb3NpdGlvbi55IDwgdGhpcy5taWRGaWVsZFkgLSA1KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnlWZWxvY2l0eSA9IC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy55VmVsb2NpdHkgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnRpbWVyICs9IFRpbWUuRGVsdGFUaW1lO1xyXG5cclxuICAgICAgICAgICAgaWYodGhpcy50aW1lciA+IDAuMTUpIHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMudHJhbnNmb3JtLmNlbnRlci55IDwgdGhpcy5iYWxsVHJhbnNmb3JtLmNlbnRlci55IC0gMTApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnlWZWxvY2l0eSA9IC0xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy50cmFuc2Zvcm0uY2VudGVyLnkgPiB0aGlzLmJhbGxUcmFuc2Zvcm0uY2VudGVyLnkgKyAxMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy55VmVsb2NpdHkgPSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy55VmVsb2NpdHkgPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVyID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0udHJhbnNsYXRlKG5ldyBWZWN0b3IyKHRoaXMueFZlbG9jaXR5LCB0aGlzLnlWZWxvY2l0eSkubXVsdGlwbHlTY2FsYXIodGhpcy5zcGVlZCkpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4uLy4uL0dhbWVFbmdpbmUvQ29tcG9uZW50cy9Db21wb25lbnRcIjtcclxuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4uL0dhbWVPYmplY3RzL1BsYXllclwiO1xyXG5pbXBvcnQgeyBSZWN0YW5nbGVSZW5kZXJlciB9IGZyb20gXCIuLi8uLi9HYW1lRW5naW5lL0NvbXBvbmVudHMvUmVjdGFuZ2xlUmVuZGVyZXJcIjtcclxuaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuLi8uLi9HYW1lRW5naW5lL0NvcmUvR2FtZU9iamVjdFwiO1xyXG5pbXBvcnQgeyBHYW1lRW5naW5lIH0gZnJvbSBcIi4uLy4uL0dhbWVFbmdpbmUvQ29yZS9HYW1lRW5naW5lXCI7XHJcbmltcG9ydCB7IEJhbGwgfSBmcm9tIFwiLi4vR2FtZU9iamVjdHMvQmFsbFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWVNYW5hZ2VyIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogR2FtZU1hbmFnZXI7XHJcblxyXG4gICAgcHJpdmF0ZSBwbGF5ZXI6IFBsYXllcjtcclxuICAgIHByaXZhdGUgcGxheWVyUmVuZGVyZXI6IFJlY3RhbmdsZVJlbmRlcmVyO1xyXG5cclxuXHJcbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKGdhbWVPYmplY3Q6IEdhbWVPYmplY3QpIHtcclxuICAgICAgICBzdXBlcihnYW1lT2JqZWN0KTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmludC1idXR0b25cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMucHJpbnRHYW1lRGF0YSgpKTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhdXNlLWJ1dHRvblwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy50b2dnbGVQYXVzZSgpKTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFkZC1iYWxsXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnRlc3RJbnN0YW50aWF0ZSgpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBHYW1lRW5naW5lLkluc3RhbmNlLmdldEdhbWVPYmplY3RCeUlkKFwicGxheWVyXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IEluc3RhbmNlKCk6IEdhbWVNYW5hZ2VyIHtcclxuICAgICAgICBpZih0aGlzLmluc3RhbmNlID09PSBudWxsIHx8IHRoaXMuaW5zdGFuY2UgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lTWFuYWdlciBoYXMgbm90IGJlZW4gY3JlYXRlZCB5ZXQuIFVzZSB0aGUgY3JlYXRlSW5zdGFuY2UgbWV0aG9kIGZpcnN0LlwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlSW5zdGFuY2UoZ2FtZU9iamVjdDogR2FtZU9iamVjdCk6IEdhbWVNYW5hZ2VyIHtcclxuICAgICAgICBpZih0aGlzLmluc3RhbmNlID09PSBudWxsIHx8IHRoaXMuaW5zdGFuY2UgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlID0gbmV3IEdhbWVNYW5hZ2VyKGdhbWVPYmplY3QpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTW9yZSB0aGFuIG9uZSBHYW1lTWFuYWdlciBjYW5ub3QgYmUgY3JlYXRlZCFcIik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB0b2dnbGVQYXVzZSgpOiB2b2lkIHtcclxuICAgICAgICBHYW1lRW5naW5lLkluc3RhbmNlLnRvZ2dsZVBhdXNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwcmludEdhbWVEYXRhKCk6IHZvaWQge1xyXG4gICAgICAgIEdhbWVFbmdpbmUuSW5zdGFuY2UucHJpbnRHYW1lRGF0YSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdGVzdEluc3RhbnRpYXRlKCk6IHZvaWQge1xyXG4gICAgICAgIEdhbWVFbmdpbmUuSW5zdGFuY2UuaW5zdGFudGlhdGUobmV3IEJhbGwoXCJiYWxsMlwiKSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi4vLi4vR2FtZUVuZ2luZS9Db21wb25lbnRzL0NvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBUcmFuc2Zvcm0gfSBmcm9tIFwiLi4vLi4vR2FtZUVuZ2luZS9Db21wb25lbnRzL1RyYW5zZm9ybVwiO1xyXG5pbXBvcnQgeyBHYW1lT2JqZWN0IH0gZnJvbSBcIi4uLy4uL0dhbWVFbmdpbmUvQ29yZS9HYW1lT2JqZWN0XCI7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTW90b3IgZXh0ZW5kcyBDb21wb25lbnQge1xyXG5cclxuICAgIHByb3RlY3RlZCB0cmFuc2Zvcm06IFRyYW5zZm9ybTtcclxuICAgIHByb3RlY3RlZCBnYW1lQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIHByb3RlY3RlZCB4VmVsb2NpdHk6IG51bWJlciA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgeVZlbG9jaXR5OiBudW1iZXIgPSAwO1xyXG4gICAgcHJvdGVjdGVkIHNwZWVkOiBudW1iZXIgPSA1XHJcblxyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihnYW1lT2JqZWN0OiBHYW1lT2JqZWN0KSB7XHJcbiAgICAgICAgc3VwZXIoZ2FtZU9iamVjdCk7XHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0gPSBnYW1lT2JqZWN0LmdldFRyYW5zZm9ybSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGFydCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMgPSB0aGlzLmdhbWVPYmplY3QuZ2V0R2FtZUNhbnZhcygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5tb3ZlKCk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVPdXRPZkJvdW5kcygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBhYnN0cmFjdCBtb3ZlKCk6IHZvaWQ7XHJcblxyXG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IGhhbmRsZU91dE9mQm91bmRzKCk6IHZvaWQ7XHJcbn0iLCJpbXBvcnQgeyBNb3RvciB9IGZyb20gXCIuL01vdG9yXCI7XHJcbmltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi4vLi4vR2FtZUVuZ2luZS9Db3JlL0dhbWVPYmplY3RcIjtcclxuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi8uLi9HYW1lRW5naW5lL0NvcmUvVmVjdG9yMlwiO1xyXG5pbXBvcnQgeyBLZXlzIH0gZnJvbSBcIi4uLy4uL0dhbWVFbmdpbmUvQ29yZS9IZWxwZXJzL0tleXNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQbGF5ZXJNb3RvciBleHRlbmRzIE1vdG9yIHtcclxuXHJcbiAgICBwcml2YXRlIG1vdmluZ1VwOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIG1vdmluZ0Rvd246IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgbW92aW5nUmlnaHQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgbW92aW5nTGVmdDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoZ2FtZU9iamVjdDogR2FtZU9iamVjdCkge1xyXG4gICAgICAgIHN1cGVyKGdhbWVPYmplY3QpO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKCkgPT4gdGhpcy5vbktleURvd24oPEtleWJvYXJkRXZlbnQ+ZXZlbnQpKTtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsICgpID0+IHRoaXMub25LZXlVcCg8S2V5Ym9hcmRFdmVudD5ldmVudCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgaXNNb3ZpbmcoKTogYm9vbGVhbiB7IFxyXG4gICAgICAgIHJldHVybiB0aGlzLnhWZWxvY2l0eSAhPT0gMCB8fCB0aGlzLnlWZWxvY2l0eSAhPT0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgaGFuZGxlT3V0T2ZCb3VuZHMoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMudHJhbnNmb3JtLnBvc2l0aW9uLnkgPD0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybS5wb3NpdGlvbi55ID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy50cmFuc2Zvcm0ucG9zaXRpb24ueSArIHRoaXMudHJhbnNmb3JtLmhlaWdodCA+PSB0aGlzLmdhbWVDYW52YXMuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtLnBvc2l0aW9uLnkgPSB0aGlzLmdhbWVDYW52YXMuaGVpZ2h0IC0gdGhpcy50cmFuc2Zvcm0uaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMudHJhbnNmb3JtLnBvc2l0aW9uLnggPD0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybS5wb3NpdGlvbi54ID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy50cmFuc2Zvcm0ucG9zaXRpb24ueCArIHRoaXMudHJhbnNmb3JtLndpZHRoID49IHRoaXMuZ2FtZUNhbnZhcy53aWR0aCkge1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybS5wb3NpdGlvbi54ID0gdGhpcy5nYW1lQ2FudmFzLndpZHRoIC0gdGhpcy50cmFuc2Zvcm0ud2lkdGg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBtb3ZlKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLm1vdmluZ1VwKSB7XHJcbiAgICAgICAgICAgIHRoaXMueVZlbG9jaXR5ID0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5tb3ZpbmdEb3duKSB7XHJcbiAgICAgICAgICAgIHRoaXMueVZlbG9jaXR5ID0gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnlWZWxvY2l0eSA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5tb3ZpbmdSaWdodCkge1xyXG4gICAgICAgICAgICB0aGlzLnhWZWxvY2l0eSA9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMubW92aW5nTGVmdCkge1xyXG4gICAgICAgICAgICB0aGlzLnhWZWxvY2l0eSA9IC0xO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54VmVsb2NpdHkgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZiAodGhpcy5pc01vdmluZykge1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybS50cmFuc2xhdGUobmV3IFZlY3RvcjIodGhpcy54VmVsb2NpdHksIHRoaXMueVZlbG9jaXR5KS5tdWx0aXBseVNjYWxhcih0aGlzLnNwZWVkKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUganVtcCgpOiB2b2lkIHtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uS2V5RG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xyXG4gICAgICAgIGlmIChldmVudC5rZXlDb2RlID09IEtleXMuVVAgfHwgZXZlbnQua2V5Q29kZSA9PSBLZXlzLlcpIHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZpbmdVcCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMubW92aW5nRG93biA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChldmVudC5rZXlDb2RlID09IEtleXMuRE9XTiB8fCBldmVudC5rZXlDb2RlID09IEtleXMuUykge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmluZ0Rvd24gPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmluZ1VwID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PSBLZXlzLlJJR0hUIHx8IGV2ZW50LmtleUNvZGUgPT0gS2V5cy5EKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW92aW5nUmlnaHQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmluZ0xlZnQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZXZlbnQua2V5Q29kZSA9PSBLZXlzLkxFRlQgfHwgZXZlbnQua2V5Q29kZSA9PSBLZXlzLkEpIHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZpbmdSaWdodCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmluZ0xlZnQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uS2V5VXAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcclxuICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PSBLZXlzLlVQIHx8IGV2ZW50LmtleUNvZGUgPT0gS2V5cy5XKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW92aW5nVXAgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZXZlbnQua2V5Q29kZSA9PSBLZXlzLkRPV04gfHwgZXZlbnQua2V5Q29kZSA9PSBLZXlzLlMpIHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZpbmdEb3duID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PSBLZXlzLlJJR0hUIHx8IGV2ZW50LmtleUNvZGUgPT0gS2V5cy5EKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW92aW5nUmlnaHQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZXZlbnQua2V5Q29kZSA9PSBLZXlzLkxFRlQgfHwgZXZlbnQua2V5Q29kZSA9PSBLZXlzLkEpIHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZpbmdMZWZ0ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuLi8uLi9HYW1lRW5naW5lL0NvcmUvR2FtZU9iamVjdFwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi4vLi4vR2FtZUVuZ2luZS9Db21wb25lbnRzL0NvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBSZWN0YW5nbGVDb2xsaWRlciB9IGZyb20gXCIuLi8uLi9HYW1lRW5naW5lL0NvbXBvbmVudHMvUmVjdGFuZ2xlQ29sbGlkZXJcIjtcclxuaW1wb3J0IHsgQmFsbE1vdG9yIH0gZnJvbSBcIi4uL0NvbXBvbmVudHMvQmFsbE1vdG9yXCI7XHJcbmltcG9ydCB7IFJlY3RhbmdsZVJlbmRlcmVyIH0gZnJvbSBcIi4uLy4uL0dhbWVFbmdpbmUvQ29tcG9uZW50cy9SZWN0YW5nbGVSZW5kZXJlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJhbGwgZXh0ZW5kcyBHYW1lT2JqZWN0IHtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoaWQ6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKGlkLCAzNDUsIDE5NSwgMTAsIDEwKTtcclxuXHJcbiAgICAgICAgbGV0IGJhbGxDb21wb25lbnRzOiBDb21wb25lbnRbXSA9IFtdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGJhbGxDb21wb25lbnRzLnB1c2gobmV3IFJlY3RhbmdsZUNvbGxpZGVyKHRoaXMpKTtcclxuICAgICAgICBiYWxsQ29tcG9uZW50cy5wdXNoKG5ldyBCYWxsTW90b3IodGhpcykpO1xyXG4gICAgICAgIGJhbGxDb21wb25lbnRzLnB1c2gobmV3IFJlY3RhbmdsZVJlbmRlcmVyKHRoaXMsIFwid2hpdGVcIikpO1xyXG5cclxuICAgICAgICB0aGlzLnNldENvbXBvbmVudHMoYmFsbENvbXBvbmVudHMpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuLi8uLi9HYW1lRW5naW5lL0NvcmUvR2FtZU9iamVjdFwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi4vLi4vR2FtZUVuZ2luZS9Db21wb25lbnRzL0NvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBSZWN0YW5nbGVDb2xsaWRlciB9IGZyb20gXCIuLi8uLi9HYW1lRW5naW5lL0NvbXBvbmVudHMvUmVjdGFuZ2xlQ29sbGlkZXJcIjtcclxuaW1wb3J0IHsgQ29tcHV0ZXJNb3RvciB9IGZyb20gXCIuLi9Db21wb25lbnRzL0NvbXB1dGVyTW90b3JcIjtcclxuaW1wb3J0IHsgUmVjdGFuZ2xlUmVuZGVyZXIgfSBmcm9tIFwiLi4vLi4vR2FtZUVuZ2luZS9Db21wb25lbnRzL1JlY3RhbmdsZVJlbmRlcmVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29tcHV0ZXIgZXh0ZW5kcyBHYW1lT2JqZWN0IHtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoaWQ6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKGlkLCA2ODgsIDE3NSwgMTAsIDUwKTtcclxuXHJcbiAgICAgICAgbGV0IGNvbXB1dGVyQ29tcG9uZW50czogQ29tcG9uZW50W10gPSBbXTtcclxuICAgICAgICBcclxuICAgICAgICBjb21wdXRlckNvbXBvbmVudHMucHVzaChuZXcgUmVjdGFuZ2xlQ29sbGlkZXIodGhpcykpO1xyXG4gICAgICAgIGNvbXB1dGVyQ29tcG9uZW50cy5wdXNoKG5ldyBDb21wdXRlck1vdG9yKHRoaXMpKTtcclxuICAgICAgICBjb21wdXRlckNvbXBvbmVudHMucHVzaChuZXcgUmVjdGFuZ2xlUmVuZGVyZXIodGhpcywgXCJ3aGl0ZVwiKSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0Q29tcG9uZW50cyhjb21wdXRlckNvbXBvbmVudHMpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4uLy4uL0dhbWVFbmdpbmUvQ29tcG9uZW50cy9Db21wb25lbnRcIjtcclxuaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuLi8uLi9HYW1lRW5naW5lL0NvcmUvR2FtZU9iamVjdFwiO1xyXG5pbXBvcnQgeyBHYW1lTWFuYWdlciB9IGZyb20gXCIuLi9Db21wb25lbnRzL0dhbWVNYW5hZ2VyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgR2FtZU1hbmFnZXJPYmplY3QgZXh0ZW5kcyBHYW1lT2JqZWN0IHtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoaWQ6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKGlkLCAwLCAwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgbGV0IGdhbWVNYW5hZ2VyQ29tcG9uZW50czogQ29tcG9uZW50W10gPSBbXTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgZ2FtZU1hbmFnZXIgPSBHYW1lTWFuYWdlci5jcmVhdGVJbnN0YW5jZSh0aGlzKTtcclxuICAgICAgICBnYW1lTWFuYWdlckNvbXBvbmVudHMucHVzaChnYW1lTWFuYWdlcik7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0Q29tcG9uZW50cyhnYW1lTWFuYWdlckNvbXBvbmVudHMpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuLi8uLi9HYW1lRW5naW5lL0NvcmUvR2FtZU9iamVjdFwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi4vLi4vR2FtZUVuZ2luZS9Db21wb25lbnRzL0NvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBSZWN0YW5nbGVDb2xsaWRlciB9IGZyb20gXCIuLi8uLi9HYW1lRW5naW5lL0NvbXBvbmVudHMvUmVjdGFuZ2xlQ29sbGlkZXJcIjtcclxuaW1wb3J0IHsgUGxheWVyTW90b3IgfSBmcm9tIFwiLi4vQ29tcG9uZW50cy9QbGF5ZXJNb3RvclwiO1xyXG5pbXBvcnQgeyBSaWdpZGJvZHkgfSBmcm9tIFwiLi4vLi4vR2FtZUVuZ2luZS9Db21wb25lbnRzL1JpZ2lkYm9keVwiO1xyXG5pbXBvcnQgeyBBbmltYXRvciB9IGZyb20gXCIuLi8uLi9HYW1lRW5naW5lL0NvbXBvbmVudHMvQW5pbWF0b3JcIjtcclxuaW1wb3J0IE1hcmlvU3ByaXRlIGZyb20gXCIuLi8uLi9hc3NldHMvbWFyaW8ucG5nXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUGxheWVyIGV4dGVuZHMgR2FtZU9iamVjdCB7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihpZCwgMiwgMTc1LCAxMCwgNTApO1xyXG5cclxuICAgICAgICBsZXQgcGxheWVyQ29tcG9uZW50czogQ29tcG9uZW50W10gPSBbXTtcclxuICAgICAgICBcclxuICAgICAgICBwbGF5ZXJDb21wb25lbnRzLnB1c2gobmV3IFJlY3RhbmdsZUNvbGxpZGVyKHRoaXMpKTtcclxuICAgICAgICBwbGF5ZXJDb21wb25lbnRzLnB1c2gobmV3IFBsYXllck1vdG9yKHRoaXMpKTtcclxuICAgICAgICBwbGF5ZXJDb21wb25lbnRzLnB1c2gobmV3IFJpZ2lkYm9keSh0aGlzKSk7XHJcbiAgICAgICAgcGxheWVyQ29tcG9uZW50cy5wdXNoKG5ldyBBbmltYXRvcih0aGlzLCBNYXJpb1Nwcml0ZSwgNCwgMSkpOyAvL0Zyb20gd2hlcmUgdGhlIG91dCBmaWxlIGlzXHJcblxyXG4gICAgICAgIHRoaXMuc2V0Q29tcG9uZW50cyhwbGF5ZXJDb21wb25lbnRzKTtcclxuICAgIH1cclxufSIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcIjI3ZjBkMjk5OTk1M2U1YThjNDMwZDdhZTRjMTMyYTExLnBuZ1wiOyIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcIjQ3NDYzMjRhYmJjM2Y4Mjg3ODk0ZTlhNjQxODhlMzJlLnBuZ1wiOyIsImltcG9ydCB7IEdhbWVFbmdpbmUgfSBmcm9tIFwiLi9HYW1lRW5naW5lL0NvcmUvR2FtZUVuZ2luZVwiO1xyXG5pbXBvcnQgeyBJbWFnZUJhY2tncm91bmQgfSBmcm9tIFwiLi9HYW1lRW5naW5lL0NvcmUvSW1hZ2VCYWNrZ3JvdW5kXCI7XHJcbmltcG9ydCB7IEdhbWVNYW5hZ2VyT2JqZWN0IH0gZnJvbSBcIi4vTWFyaW8vR2FtZU9iamVjdHMvR2FtZU1hbmFnZXJPYmplY3RcIjtcclxuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4vTWFyaW8vR2FtZU9iamVjdHMvUGxheWVyXCI7XHJcbmltcG9ydCB7IEJhbGwgfSBmcm9tIFwiLi9NYXJpby9HYW1lT2JqZWN0cy9CYWxsXCI7XHJcbmltcG9ydCB7IENvbXB1dGVyIH0gZnJvbSBcIi4vTWFyaW8vR2FtZU9iamVjdHMvQ29tcHV0ZXJcIjtcclxuaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuL0dhbWVFbmdpbmUvQ29yZS9HYW1lT2JqZWN0XCI7XHJcbmltcG9ydCBCYWNrZ3JvdW5kIGZyb20gXCIuL2Fzc2V0cy9iYWNrZ3JvdW5kLnBuZ1wiO1xyXG5cclxuXHJcbmxldCBnYW1lRW5naW5lOiBHYW1lRW5naW5lID0gR2FtZUVuZ2luZS5JbnN0YW5jZTtcclxuXHJcbmxldCBnYW1lQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtY2FudmFzXCIpO1xyXG5cclxubGV0IGJhY2tncm91bmQ6IEltYWdlQmFja2dyb3VuZCA9IG5ldyBJbWFnZUJhY2tncm91bmQoZ2FtZUNhbnZhcywgQmFja2dyb3VuZCk7XHJcblxyXG5sZXQgZ2FtZU1hbmFnZXI6IEdhbWVNYW5hZ2VyT2JqZWN0ID0gbmV3IEdhbWVNYW5hZ2VyT2JqZWN0KFwiR2FtZU1hbmFnZXJcIik7XHJcblxyXG5sZXQgcGxheWVyOiBQbGF5ZXIgPSBuZXcgUGxheWVyKFwicGxheWVyXCIpO1xyXG5sZXQgYmFsbDogQmFsbCA9IG5ldyBCYWxsKFwiYmFsbFwiKTtcclxubGV0IGNvbXB1dGVyOiBDb21wdXRlciA9IG5ldyBDb21wdXRlcihcImNvbXB1dGVyXCIpO1xyXG5cclxubGV0IGdhbWVPYmplY3RzOiBHYW1lT2JqZWN0W10gPSBbZ2FtZU1hbmFnZXIsIHBsYXllciwgY29tcHV0ZXIsIGJhbGxdO1xyXG5cclxuZ2FtZUVuZ2luZS5pbml0aWFsaXplR2FtZShnYW1lQ2FudmFzLCBnYW1lT2JqZWN0cywgYmFja2dyb3VuZCk7XHJcblxyXG5nYW1lRW5naW5lLnN0YXJ0R2FtZSgpOyJdLCJzb3VyY2VSb290IjoiIn0=