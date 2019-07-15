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
    constructor(gameObject, initialAnimation) {
        super(gameObject);
        this.animation = initialAnimation;
    }
    start() {
        this.canvasContext = this.gameObject.getGameCanvas().getContext("2d");
        this.transform = this.gameObject.getTransform();
    }
    update() {
        this.drawSprite();
    }
    setAnimation(animation) {
        this.animation = animation;
    }
    drawSprite() {
        if (!this.animation.animationReady) {
            return;
        }
        this.canvasContext.drawImage(this.animation.currentFrame, this.transform.position.x, this.transform.position.y, this.transform.width, this.transform.height);
        this.animation.updateAnimation();
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
/* harmony import */ var _Core_Physics__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Core/Physics */ "./src/GameEngine/Core/Physics.ts");




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
        _Core_Physics__WEBPACK_IMPORTED_MODULE_3__["Physics"].Instance.addCollider(this);
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
/* harmony import */ var _Core_Time__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Core/Time */ "./src/GameEngine/Core/Time.ts");




class Rigidbody extends _Component__WEBPACK_IMPORTED_MODULE_0__["Component"] {
    constructor(gameObject, mass = 70) {
        super(gameObject);
        this.isKinomatic = false;
        this.transform = gameObject.getTransform();
        this.mass = mass;
        this.velocity = new _Core_Vector2__WEBPACK_IMPORTED_MODULE_1__["Vector2"](0, 0);
        this.acceleration = new _Core_Vector2__WEBPACK_IMPORTED_MODULE_1__["Vector2"](0, 0);
        this.force = _Core_Vector2__WEBPACK_IMPORTED_MODULE_1__["Vector2"].zero;
        _Core_Physics__WEBPACK_IMPORTED_MODULE_2__["Physics"].Instance.addRigidbody(this);
    }
    update() {
        if (this.isKinomatic) {
            return;
        }
        this.addGravity(665);
        this.velocity.add(this.force.divideScalar(this.mass));
        this.transform.translate(this.velocity);
    }
    addForce(force) {
        this.force.add(force);
    }
    addGravity(newtonsDown) {
        this.addForce(_Core_Vector2__WEBPACK_IMPORTED_MODULE_1__["Vector2"].down.multiplyScalar(newtonsDown).multiplyScalar(_Core_Time__WEBPACK_IMPORTED_MODULE_3__["Time"].DeltaTime));
    }
    resetForce() {
        this.force.zero();
        this.velocity.zero();
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

/***/ "./src/GameEngine/Core/Animation.ts":
/*!******************************************!*\
  !*** ./src/GameEngine/Core/Animation.ts ***!
  \******************************************/
/*! exports provided: Animation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Animation", function() { return Animation; });
/* harmony import */ var _Time__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Time */ "./src/GameEngine/Core/Time.ts");

class Animation {
    constructor(spriteSheetUrl, numFrames, numRows, delay = 0) {
        this.loop = true;
        this.animationReady = false;
        this.frames = [];
        this.frameIndex = 0;
        this.delay = 0;
        this.timer = 0;
        this.delay = delay;
        let spriteSheet = new Image();
        spriteSheet.src = spriteSheetUrl;
        spriteSheet.onload = () => {
            let spriteWidth = spriteSheet.width / numFrames;
            let spriteHeight = spriteSheet.height / numRows;
            for (let i = 0; i < numRows; i++) {
                for (let j = 0; j < numFrames; j++) {
                    this.animationReady = false;
                    let canvas = document.createElement('canvas');
                    canvas.width = spriteWidth;
                    canvas.height = spriteHeight;
                    let context = canvas.getContext('2d');
                    context.drawImage(spriteSheet, j * spriteWidth, i * spriteHeight, spriteWidth, spriteHeight, 0, 0, canvas.width, canvas.height);
                    let frame = new Image();
                    frame.src = canvas.toDataURL();
                    frame.onload = () => {
                        this.frames.push(frame);
                        this.animationReady = true;
                    };
                }
            }
        };
    }
    get currentFrame() {
        return this.frames[this.frameIndex];
    }
    updateAnimation() {
        if (!this.loop && this.frameIndex === this.frames.length - 1) {
            return;
        }
        this.timer += _Time__WEBPACK_IMPORTED_MODULE_0__["Time"].DeltaTime;
        if (this.timer < this.delay) {
            return;
        }
        this.timer = 0;
        this.frameIndex = (this.frameIndex + 1) % this.frames.length;
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
        this.gameObjectNumMap = new Map();
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
        if (this.gameObjectMap.has(newGameObject.id)) {
            let originalId = newGameObject.id;
            newGameObject.id += " Clone(" + this.gameObjectNumMap.get(originalId) + ")";
            this.gameObjectNumMap.set(originalId, this.gameObjectNumMap.get(originalId) + 1);
        }
        else {
            this.gameObjectNumMap.set(newGameObject.id, 1);
        }
        this.gameObjectMap.set(newGameObject.id, newGameObject);
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
                let originalId = gameObject.id;
                gameObject.id += " Clone(" + this.gameObjectNumMap.get(originalId) + ")";
                this.gameObjectNumMap.set(originalId, this.gameObjectNumMap.get(originalId) + 1);
            }
            else {
                this.gameObjectNumMap.set(gameObject.id, 1);
            }
            this.gameObjectMap.set(gameObject.id, gameObject);
        }
    }
    update() {
        if (this.paused) {
            return;
        }
        _Time__WEBPACK_IMPORTED_MODULE_1__["Time"].updateTime();
        this.renderBackground();
        for (let i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].update();
        }
    }
    renderBackground() {
        this.background.render();
    }
    gameLoop() {
        this.update();
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

/***/ "./src/GameEngine/Core/Geometry.ts":
/*!*****************************************!*\
  !*** ./src/GameEngine/Core/Geometry.ts ***!
  \*****************************************/
/*! exports provided: Geometry */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Geometry", function() { return Geometry; });
class Geometry {
    static onSegment(p, q, r) {
        if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
            q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)) {
            return true;
        }
        return false;
    }
    static orientation(p, q, r) {
        let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
        if (val === 0) {
            return 0;
        }
        return (val > 0) ? 1 : 2;
    }
    static doIntersect(p1, q1, p2, q2) {
        let o1 = this.orientation(p1, q1, p2);
        let o2 = this.orientation(p1, q1, q2);
        let o3 = this.orientation(p2, q2, p1);
        let o4 = this.orientation(p2, q2, q1);
        if (o1 !== o2 && o3 !== o4) {
            return true;
        }
        if (o1 === 0 && this.onSegment(p1, p2, q1)) {
            return true;
        }
        if (o2 === 0 && this.onSegment(p1, q2, q1)) {
            return true;
        }
        if (o3 === 0 && this.onSegment(p2, p1, q2)) {
            return true;
        }
        if (o4 === 0 && this.onSegment(p2, q1, q2)) {
            return true;
        }
        return false;
    }
    static doIntersectRectangle(p1, p2, tl, tr, bl, br) {
        if (this.doIntersect(p1, p2, tl, tr) ||
            this.doIntersect(p1, p2, tl, bl) ||
            this.doIntersect(p1, p2, bl, br) ||
            this.doIntersect(p1, p2, tr, br)) {
            return true;
        }
        return false;
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
/* harmony import */ var _Vector2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Vector2 */ "./src/GameEngine/Core/Vector2.ts");
/* harmony import */ var _Geometry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Geometry */ "./src/GameEngine/Core/Geometry.ts");


class Physics {
    constructor() {
        this.rigidbodies = [];
        this.colliders = [];
        this.gravity = 1;
    }
    static get Instance() {
        return this.instance || (this.instance = new Physics());
    }
    addRigidbody(rb) {
        this.rigidbodies.push(rb);
    }
    addCollider(collider) {
        this.colliders.push(collider);
    }
    static raycast(origin, direction, distance) {
        let result = null;
        let hitColliders = Physics.raycastAll(origin, direction, distance);
        let closestColliderDistance = -10;
        for (let collider of hitColliders) {
            let colliderDistance = _Vector2__WEBPACK_IMPORTED_MODULE_0__["Vector2"].distance(origin, collider.transform.position);
            if (colliderDistance > closestColliderDistance) {
                result = collider;
                closestColliderDistance = colliderDistance;
            }
        }
        return result;
    }
    static raycastAll(origin, direction, distance) {
        let results = [];
        let terminalPoint = _Vector2__WEBPACK_IMPORTED_MODULE_0__["Vector2"].add(origin, direction.multiplyScalar(distance));
        for (let collider of Physics.Instance.colliders) {
            if (_Geometry__WEBPACK_IMPORTED_MODULE_1__["Geometry"].doIntersectRectangle(origin, terminalPoint, collider.topLeft, collider.topRight, collider.bottomLeft, collider.bottomRight)) {
                results.push(collider);
            }
        }
        return results;
    }
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
        return this.divide(new Vector2(this.magnitude, this.magnitude));
    }
    add(rightOperand) {
        this.x += rightOperand.x;
        this.y += rightOperand.y;
        return this;
    }
    subtract(rightOperand) {
        this.x -= rightOperand.x;
        this.y -= rightOperand.y;
        return this;
    }
    multiply(rightOperand) {
        this.x *= rightOperand.x;
        this.y *= rightOperand.y;
        return this;
    }
    divide(rightOperand) {
        this.x /= rightOperand.x;
        this.y /= rightOperand.y;
        return this;
    }
    equals(rightOperand) {
        let equalX = this.x === rightOperand.x;
        let equalY = this.y === rightOperand.y;
        return equalX && equalY;
    }
    multiplyScalar(rightOperand) {
        this.x *= rightOperand;
        this.y *= rightOperand;
        return this;
    }
    divideScalar(rightOperand) {
        this.x /= rightOperand;
        this.y /= rightOperand;
        return this;
    }
    zero() {
        this.x = 0;
        this.y = 0;
        return this;
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
    static add(leftOperand, rightOperand) {
        return new Vector2(leftOperand.x + rightOperand.x, leftOperand.y + rightOperand.y);
    }
    static distance(point1, point2) {
        let distanceX = point1.x - point2.x;
        let distanceY = point1.y - point2.y;
        return Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));
    }
    static angleInRadians(from, to) {
        let cos0 = Vector2.dot(from, to) / (from.magnitude * to.magnitude);
        return Math.acos(cos0);
    }
    static angleInDegrees(from, to) {
        return this.angleInRadians(from, to) * 180 / Math.PI;
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
        this.ready = true;
        this.reset();
    }
    start() {
        super.start();
        this.collider = this.gameObject.getComponent(_GameEngine_Components_RectangleCollider__WEBPACK_IMPORTED_MODULE_1__["RectangleCollider"]);
        this.playerCollider = _GameEngine_Core_GameEngine__WEBPACK_IMPORTED_MODULE_2__["GameEngine"].Instance.getGameObjectById("player").getComponent(_GameEngine_Components_RectangleCollider__WEBPACK_IMPORTED_MODULE_1__["RectangleCollider"]);
        this.computerCollider = _GameEngine_Core_GameEngine__WEBPACK_IMPORTED_MODULE_2__["GameEngine"].Instance.getGameObjectById("computer").getComponent(_GameEngine_Components_RectangleCollider__WEBPACK_IMPORTED_MODULE_1__["RectangleCollider"]);
        this.collider.onCollided.add((other) => this.handleCollision(other));
    }
    update() {
        super.update();
        this.detectCollisions();
    }
    handleCollision(other) {
        if (this.ready) {
            this.ready = false;
            this.xVelocity *= -1;
            this.speed += 0.125;
            setTimeout(() => {
                this.ready = true;
            }, 250);
        }
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
    detectCollisions() {
        this.collider.detectCollision(this.playerCollider);
        this.collider.detectCollision(this.computerCollider);
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
/* harmony import */ var _GameEngine_Components_Rigidbody__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../GameEngine/Components/Rigidbody */ "./src/GameEngine/Components/Rigidbody.ts");
/* harmony import */ var _assets_mario_png__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../assets/mario.png */ "./src/assets/mario.png");
/* harmony import */ var _assets_mario_png__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_assets_mario_png__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _assets_marioLeft_png__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../assets/marioLeft.png */ "./src/assets/marioLeft.png");
/* harmony import */ var _assets_marioLeft_png__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_assets_marioLeft_png__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _GameEngine_Components_Animator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../GameEngine/Components/Animator */ "./src/GameEngine/Components/Animator.ts");
/* harmony import */ var _GameEngine_Core_Animation__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../GameEngine/Core/Animation */ "./src/GameEngine/Core/Animation.ts");
/* harmony import */ var _GameEngine_Core_Physics__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../GameEngine/Core/Physics */ "./src/GameEngine/Core/Physics.ts");









class PlayerMotor extends _Motor__WEBPACK_IMPORTED_MODULE_0__["Motor"] {
    constructor(gameObject) {
        super(gameObject);
        this.movingRight = false;
        this.movingLeft = false;
        this.jumping = false;
        document.addEventListener('keydown', () => this.onKeyDown(event));
        document.addEventListener('keyup', () => this.onKeyUp(event));
        document.addEventListener('click', () => this.onClick(event));
        this.moveRightAnimation = new _GameEngine_Core_Animation__WEBPACK_IMPORTED_MODULE_7__["Animation"](_assets_mario_png__WEBPACK_IMPORTED_MODULE_4___default.a, 4, 1, 0.1);
        this.moveLeftAnimation = new _GameEngine_Core_Animation__WEBPACK_IMPORTED_MODULE_7__["Animation"](_assets_marioLeft_png__WEBPACK_IMPORTED_MODULE_5___default.a, 4, 1, 0.1);
    }
    start() {
        super.start();
        this.rigidBody = this.gameObject.getComponent(_GameEngine_Components_Rigidbody__WEBPACK_IMPORTED_MODULE_3__["Rigidbody"]);
        this.animator = this.gameObject.getComponent(_GameEngine_Components_Animator__WEBPACK_IMPORTED_MODULE_6__["Animator"]);
    }
    get isMoving() {
        return this.xVelocity !== 0 || this.yVelocity !== 0;
    }
    handleOutOfBounds() {
        if (this.transform.position.y <= 0) {
            this.transform.position.y = 1;
        }
        else if (this.transform.position.y + this.transform.height >= this.gameCanvas.height - 55) {
            this.rigidBody.isKinomatic = true;
            this.jumping = false;
            this.transform.position.y = (this.gameCanvas.height - this.transform.height) - 56;
        }
        if (this.transform.position.x <= 0) {
            this.transform.position.x = 1;
        }
        else if (this.transform.position.x + this.transform.width >= this.gameCanvas.width) {
            this.transform.position.x = (this.gameCanvas.width - this.transform.width) - 1;
        }
    }
    move() {
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
        if (this.jumping) {
            return;
        }
        this.jumping = true;
        this.rigidBody.isKinomatic = false;
        this.rigidBody.resetForce();
        this.rigidBody.addForce(_GameEngine_Core_Vector2__WEBPACK_IMPORTED_MODULE_1__["Vector2"].up.multiplyScalar(400));
    }
    onClick(event) {
        let hit = _GameEngine_Core_Physics__WEBPACK_IMPORTED_MODULE_8__["Physics"].raycast(new _GameEngine_Core_Vector2__WEBPACK_IMPORTED_MODULE_1__["Vector2"](this.transform.position.x, this.transform.position.y - 1), _GameEngine_Core_Vector2__WEBPACK_IMPORTED_MODULE_1__["Vector2"].right, 5000);
    }
    onKeyDown(event) {
        if (event.keyCode == _GameEngine_Core_Helpers_Keys__WEBPACK_IMPORTED_MODULE_2__["Keys"].RIGHT || event.keyCode == _GameEngine_Core_Helpers_Keys__WEBPACK_IMPORTED_MODULE_2__["Keys"].D) {
            this.movingRight = true;
            this.movingLeft = false;
            this.animator.setAnimation(this.moveRightAnimation);
        }
        else if (event.keyCode == _GameEngine_Core_Helpers_Keys__WEBPACK_IMPORTED_MODULE_2__["Keys"].LEFT || event.keyCode == _GameEngine_Core_Helpers_Keys__WEBPACK_IMPORTED_MODULE_2__["Keys"].A) {
            this.movingRight = false;
            this.movingLeft = true;
            this.animator.setAnimation(this.moveLeftAnimation);
        }
        if (event.keyCode == _GameEngine_Core_Helpers_Keys__WEBPACK_IMPORTED_MODULE_2__["Keys"].SPACE) {
            this.jump();
        }
    }
    onKeyUp(event) {
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
/* harmony import */ var _GameEngine_Core_Animation__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../GameEngine/Core/Animation */ "./src/GameEngine/Core/Animation.ts");







class Player extends _GameEngine_Core_GameObject__WEBPACK_IMPORTED_MODULE_0__["GameObject"] {
    constructor(id) {
        super(id, 2, 175, 10, 50);
        let playerComponents = [];
        playerComponents.push(new _GameEngine_Components_RectangleCollider__WEBPACK_IMPORTED_MODULE_1__["RectangleCollider"](this));
        playerComponents.push(new _Components_PlayerMotor__WEBPACK_IMPORTED_MODULE_2__["PlayerMotor"](this));
        playerComponents.push(new _GameEngine_Components_Rigidbody__WEBPACK_IMPORTED_MODULE_3__["Rigidbody"](this));
        let initialAnimation = new _GameEngine_Core_Animation__WEBPACK_IMPORTED_MODULE_6__["Animation"](_assets_mario_png__WEBPACK_IMPORTED_MODULE_5___default.a, 4, 1, 0.1);
        playerComponents.push(new _GameEngine_Components_Animator__WEBPACK_IMPORTED_MODULE_4__["Animator"](this, initialAnimation));
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

module.exports = __webpack_require__.p + "249faac8674a31fa922af6089863bffa.png";

/***/ }),

/***/ "./src/assets/marioLeft.png":
/*!**********************************!*\
  !*** ./src/assets/marioLeft.png ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "0121541694936934c979ae0cf0c66a34.png";

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dhbWVFbmdpbmUvQ29tcG9uZW50cy9BbmltYXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR2FtZUVuZ2luZS9Db21wb25lbnRzL0NvbXBvbmVudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR2FtZUVuZ2luZS9Db21wb25lbnRzL1JlY3RhbmdsZUNvbGxpZGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9HYW1lRW5naW5lL0NvbXBvbmVudHMvUmVjdGFuZ2xlUmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dhbWVFbmdpbmUvQ29tcG9uZW50cy9SaWdpZGJvZHkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dhbWVFbmdpbmUvQ29tcG9uZW50cy9UcmFuc2Zvcm0udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dhbWVFbmdpbmUvQ29yZS9BbmltYXRpb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dhbWVFbmdpbmUvQ29yZS9HYW1lRW5naW5lLnRzIiwid2VicGFjazovLy8uL3NyYy9HYW1lRW5naW5lL0NvcmUvR2FtZU9iamVjdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR2FtZUVuZ2luZS9Db3JlL0dlb21ldHJ5LnRzIiwid2VicGFjazovLy8uL3NyYy9HYW1lRW5naW5lL0NvcmUvSGVscGVycy9LZXlzLnRzIiwid2VicGFjazovLy8uL3NyYy9HYW1lRW5naW5lL0NvcmUvSGVscGVycy9MaXRlRXZlbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dhbWVFbmdpbmUvQ29yZS9JbWFnZUJhY2tncm91bmQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dhbWVFbmdpbmUvQ29yZS9QaHlzaWNzLnRzIiwid2VicGFjazovLy8uL3NyYy9HYW1lRW5naW5lL0NvcmUvVGltZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR2FtZUVuZ2luZS9Db3JlL1ZlY3RvcjIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL01hcmlvL0NvbXBvbmVudHMvQmFsbE1vdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9NYXJpby9Db21wb25lbnRzL0NvbXB1dGVyTW90b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL01hcmlvL0NvbXBvbmVudHMvR2FtZU1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL01hcmlvL0NvbXBvbmVudHMvTW90b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL01hcmlvL0NvbXBvbmVudHMvUGxheWVyTW90b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL01hcmlvL0dhbWVPYmplY3RzL0JhbGwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL01hcmlvL0dhbWVPYmplY3RzL0NvbXB1dGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9NYXJpby9HYW1lT2JqZWN0cy9HYW1lTWFuYWdlck9iamVjdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTWFyaW8vR2FtZU9iamVjdHMvUGxheWVyLnRzIiwid2VicGFjazovLy8uL3NyYy9hc3NldHMvYmFja2dyb3VuZC5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2Fzc2V0cy9tYXJpby5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2Fzc2V0cy9tYXJpb0xlZnQucG5nIiwid2VicGFjazovLy8uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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LCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsImltcG9ydCB7IFRyYW5zZm9ybSB9IGZyb20gXCIuL1RyYW5zZm9ybVwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi9Db21wb25lbnRcIjtcclxuaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuLi9Db3JlL0dhbWVPYmplY3RcIjtcclxuaW1wb3J0IHsgQW5pbWF0aW9uIH0gZnJvbSBcIi4uL0NvcmUvQW5pbWF0aW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQW5pbWF0b3IgZXh0ZW5kcyBDb21wb25lbnQge1xyXG5cclxuICBcclxuICAgIHByaXZhdGUgY2FudmFzQ29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gICAgcHJpdmF0ZSB0cmFuc2Zvcm06IFRyYW5zZm9ybTtcclxuICAgIHByaXZhdGUgYW5pbWF0aW9uOiBBbmltYXRpb247XHJcblxyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihnYW1lT2JqZWN0OiBHYW1lT2JqZWN0LCBpbml0aWFsQW5pbWF0aW9uOiBBbmltYXRpb24pIHtcclxuICAgICAgICBzdXBlcihnYW1lT2JqZWN0KTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbiA9IGluaXRpYWxBbmltYXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXJ0KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY2FudmFzQ29udGV4dCA9IHRoaXMuZ2FtZU9iamVjdC5nZXRHYW1lQ2FudmFzKCkuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtID0gdGhpcy5nYW1lT2JqZWN0LmdldFRyYW5zZm9ybSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5kcmF3U3ByaXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldEFuaW1hdGlvbihhbmltYXRpb246IEFuaW1hdGlvbik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uID0gYW5pbWF0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZHJhd1Nwcml0ZSgpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIXRoaXMuYW5pbWF0aW9uLmFuaW1hdGlvblJlYWR5KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY2FudmFzQ29udGV4dC5kcmF3SW1hZ2UodGhpcy5hbmltYXRpb24uY3VycmVudEZyYW1lLCB0aGlzLnRyYW5zZm9ybS5wb3NpdGlvbi54LCB0aGlzLnRyYW5zZm9ybS5wb3NpdGlvbi55LCB0aGlzLnRyYW5zZm9ybS53aWR0aCwgdGhpcy50cmFuc2Zvcm0uaGVpZ2h0KTtcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbi51cGRhdGVBbmltYXRpb24oKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi4vQ29yZS9HYW1lT2JqZWN0XCI7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ29tcG9uZW50IHtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgZ2FtZU9iamVjdDogR2FtZU9iamVjdDtcclxuXHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGdhbWVPYmplY3Q6IEdhbWVPYmplY3QpIHtcclxuICAgICAgICB0aGlzLmdhbWVPYmplY3QgPSBnYW1lT2JqZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGFydCgpOiB2b2lkIHt9O1xyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoKTogdm9pZCB7fTtcclxufSIsImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vQ29yZS9WZWN0b3IyXCI7XHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL0NvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBUcmFuc2Zvcm0gfSBmcm9tIFwiLi9UcmFuc2Zvcm1cIjtcclxuaW1wb3J0IHsgTGl0ZUV2ZW50IH0gZnJvbSBcIi4uL0NvcmUvSGVscGVycy9MaXRlRXZlbnRcIjtcclxuaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuLi9Db3JlL0dhbWVPYmplY3RcIjtcclxuaW1wb3J0IHsgUGh5c2ljcyB9IGZyb20gXCIuLi9Db3JlL1BoeXNpY3NcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSZWN0YW5nbGVDb2xsaWRlciBleHRlbmRzIENvbXBvbmVudCB7XHJcblxyXG4gICAgcHVibGljIHRvcExlZnQ6IFZlY3RvcjI7XHJcbiAgICBwdWJsaWMgdG9wUmlnaHQ6IFZlY3RvcjI7XHJcbiAgICBwdWJsaWMgYm90dG9tTGVmdDogVmVjdG9yMjtcclxuICAgIHB1YmxpYyBib3R0b21SaWdodDogVmVjdG9yMjtcclxuICAgIHB1YmxpYyByZWFkb25seSB0cmFuc2Zvcm06IFRyYW5zZm9ybTtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IG9uQ29sbGlkZSA9IG5ldyBMaXRlRXZlbnQ8UmVjdGFuZ2xlQ29sbGlkZXI+KCk7XHJcblxyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihnYW1lT2JqZWN0OiBHYW1lT2JqZWN0KSB7XHJcbiAgICAgICAgc3VwZXIoZ2FtZU9iamVjdCk7XHJcblxyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtID0gZ2FtZU9iamVjdC5nZXRUcmFuc2Zvcm0oKTtcclxuICAgICAgICBsZXQgdHJhbnNmb3JtOiBUcmFuc2Zvcm0gPSB0aGlzLnRyYW5zZm9ybTtcclxuXHJcbiAgICAgICAgdHJhbnNmb3JtLm9uTW92ZWQuYWRkKCgpID0+IHRoaXMub25UcmFuc2Zvcm1Nb3ZlZCgpKTtcclxuXHJcbiAgICAgICAgdGhpcy50b3BMZWZ0ID0gbmV3IFZlY3RvcjIodHJhbnNmb3JtLnBvc2l0aW9uLngsIHRyYW5zZm9ybS5wb3NpdGlvbi55KTtcclxuICAgICAgICB0aGlzLnRvcFJpZ2h0ID0gbmV3IFZlY3RvcjIodHJhbnNmb3JtLnBvc2l0aW9uLnggKyB0cmFuc2Zvcm0ud2lkdGgsIHRyYW5zZm9ybS5wb3NpdGlvbi55KTtcclxuICAgICAgICB0aGlzLmJvdHRvbUxlZnQgPSBuZXcgVmVjdG9yMih0cmFuc2Zvcm0ucG9zaXRpb24ueCwgdHJhbnNmb3JtLnBvc2l0aW9uLnkgKyB0cmFuc2Zvcm0uaGVpZ2h0KTtcclxuICAgICAgICB0aGlzLmJvdHRvbVJpZ2h0ID0gbmV3IFZlY3RvcjIodHJhbnNmb3JtLnBvc2l0aW9uLnggKyB0cmFuc2Zvcm0ud2lkdGgsIHRyYW5zZm9ybS5wb3NpdGlvbi55ICsgdHJhbnNmb3JtLmhlaWdodCk7XHJcblxyXG4gICAgICAgIFBoeXNpY3MuSW5zdGFuY2UuYWRkQ29sbGlkZXIodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRldGVjdENvbGxpc2lvbihvdGhlcjogUmVjdGFuZ2xlQ29sbGlkZXIpOiBib29sZWFuIHtcclxuICAgICAgICBcclxuICAgICAgICBpZighKG90aGVyLnRvcExlZnQueCA+IHRoaXMudG9wUmlnaHQueCB8fFxyXG4gICAgICAgICAgICBvdGhlci50b3BSaWdodC54IDwgdGhpcy50b3BMZWZ0LnggfHxcclxuICAgICAgICAgICAgb3RoZXIudG9wTGVmdC55ID4gdGhpcy5ib3R0b21MZWZ0LnkgfHxcclxuICAgICAgICAgICAgb3RoZXIuYm90dG9tTGVmdC55IDwgdGhpcy50b3BMZWZ0LnkpKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25Db2xsaWRlLnRyaWdnZXIob3RoZXIpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBvbkNvbGxpZGVkKCkgeyBcclxuICAgICAgICByZXR1cm4gdGhpcy5vbkNvbGxpZGUuZXhwb3NlKCk7IFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvblRyYW5zZm9ybU1vdmVkKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMudG9wTGVmdC54ID0gdGhpcy50cmFuc2Zvcm0ucG9zaXRpb24ueDtcclxuICAgICAgICB0aGlzLnRvcExlZnQueSA9IHRoaXMudHJhbnNmb3JtLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdGhpcy50b3BSaWdodC54ID0gdGhpcy50cmFuc2Zvcm0ucG9zaXRpb24ueCArIHRoaXMudHJhbnNmb3JtLndpZHRoO1xyXG4gICAgICAgIHRoaXMudG9wUmlnaHQueSA9IHRoaXMudHJhbnNmb3JtLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdGhpcy5ib3R0b21MZWZ0LnggPSB0aGlzLnRyYW5zZm9ybS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHRoaXMuYm90dG9tTGVmdC55ID0gdGhpcy50cmFuc2Zvcm0ucG9zaXRpb24ueSArIHRoaXMudHJhbnNmb3JtLmhlaWdodDtcclxuICAgICAgICB0aGlzLmJvdHRvbVJpZ2h0LnggPSB0aGlzLnRyYW5zZm9ybS5wb3NpdGlvbi54ICsgdGhpcy50cmFuc2Zvcm0ud2lkdGg7XHJcbiAgICAgICAgdGhpcy5ib3R0b21SaWdodC55ID0gdGhpcy50cmFuc2Zvcm0ucG9zaXRpb24ueSArIHRoaXMudHJhbnNmb3JtLmhlaWdodDtcclxuICAgIH1cclxufSIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL0NvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBUcmFuc2Zvcm0gfSBmcm9tIFwiLi9UcmFuc2Zvcm1cIjtcclxuaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuLi9Db3JlL0dhbWVPYmplY3RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSZWN0YW5nbGVSZW5kZXJlciBleHRlbmRzIENvbXBvbmVudCB7XHJcblxyXG4gICAgcHJpdmF0ZSB0cmFuc2Zvcm06IFRyYW5zZm9ybTtcclxuICAgIHByaXZhdGUgZ2FtZUNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBwcml2YXRlIGNhbnZhc0NvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICAgIHByaXZhdGUgY29sb3I6IHN0cmluZztcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoZ2FtZU9iamVjdDogR2FtZU9iamVjdCwgY29sb3I6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKGdhbWVPYmplY3QpO1xyXG5cclxuICAgICAgICB0aGlzLnRyYW5zZm9ybSA9IGdhbWVPYmplY3QuZ2V0VHJhbnNmb3JtKCk7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXJ0KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcyA9IHRoaXMuZ2FtZU9iamVjdC5nZXRHYW1lQ2FudmFzKCk7XHJcbiAgICAgICAgdGhpcy5jYW52YXNDb250ZXh0ID0gdGhpcy5nYW1lQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldENvbG9yKGNvbG9yOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW5kZXIoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jYW52YXNDb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XHJcbiAgICAgICAgdGhpcy5jYW52YXNDb250ZXh0LmZpbGxSZWN0KHRoaXMudHJhbnNmb3JtLnBvc2l0aW9uLngsIHRoaXMudHJhbnNmb3JtLnBvc2l0aW9uLnksIHRoaXMudHJhbnNmb3JtLndpZHRoLCB0aGlzLnRyYW5zZm9ybS5oZWlnaHQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vQ29tcG9uZW50XCI7XHJcbmltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vQ29yZS9WZWN0b3IyXCI7XHJcbmltcG9ydCB7IFRyYW5zZm9ybSB9IGZyb20gXCIuL1RyYW5zZm9ybVwiO1xyXG5pbXBvcnQgeyBHYW1lT2JqZWN0IH0gZnJvbSBcIi4uL0NvcmUvR2FtZU9iamVjdFwiO1xyXG5pbXBvcnQgeyBQaHlzaWNzIH0gZnJvbSBcIi4uL0NvcmUvUGh5c2ljc1wiO1xyXG5pbXBvcnQgeyBUaW1lIH0gZnJvbSBcIi4uL0NvcmUvVGltZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJpZ2lkYm9keSBleHRlbmRzIENvbXBvbmVudCB7XHJcblxyXG4gICAgLy8gSW4ga2dcclxuICAgIHB1YmxpYyBtYXNzOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgaXNLaW5vbWF0aWM6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgdmVsb2NpdHk6IFZlY3RvcjI7XHJcbiAgICBwcml2YXRlIGFjY2VsZXJhdGlvbjogVmVjdG9yMjtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBmb3JjZTogVmVjdG9yMjtcclxuICAgIHByaXZhdGUgdHJhbnNmb3JtOiBUcmFuc2Zvcm07XHJcblxyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihnYW1lT2JqZWN0OiBHYW1lT2JqZWN0LCBtYXNzOiBudW1iZXIgPSA3MCkge1xyXG4gICAgICAgIHN1cGVyKGdhbWVPYmplY3QpO1xyXG5cclxuICAgICAgICB0aGlzLnRyYW5zZm9ybSA9IGdhbWVPYmplY3QuZ2V0VHJhbnNmb3JtKCk7XHJcbiAgICAgICAgdGhpcy5tYXNzID0gbWFzcztcclxuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gbmV3IFZlY3RvcjIoMCwgMCk7XHJcbiAgICAgICAgdGhpcy5hY2NlbGVyYXRpb24gPSBuZXcgVmVjdG9yMigwLCAwKTtcclxuICAgICAgICB0aGlzLmZvcmNlID0gVmVjdG9yMi56ZXJvO1xyXG4gICAgICAgIFBoeXNpY3MuSW5zdGFuY2UuYWRkUmlnaWRib2R5KHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNLaW5vbWF0aWMpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5hZGRHcmF2aXR5KDY2NSk7XHJcbiAgICAgICAgdGhpcy52ZWxvY2l0eS5hZGQodGhpcy5mb3JjZS5kaXZpZGVTY2FsYXIodGhpcy5tYXNzKSk7XHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0udHJhbnNsYXRlKHRoaXMudmVsb2NpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRGb3JjZShmb3JjZTogVmVjdG9yMik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZm9yY2UuYWRkKGZvcmNlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkR3Jhdml0eShuZXd0b25zRG93bjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5hZGRGb3JjZShWZWN0b3IyLmRvd24ubXVsdGlwbHlTY2FsYXIobmV3dG9uc0Rvd24pLm11bHRpcGx5U2NhbGFyKFRpbWUuRGVsdGFUaW1lKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlc2V0Rm9yY2UoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5mb3JjZS56ZXJvKCk7XHJcbiAgICAgICAgdGhpcy52ZWxvY2l0eS56ZXJvKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi9Db21wb25lbnRcIjtcclxuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9Db3JlL1ZlY3RvcjJcIjtcclxuaW1wb3J0IHsgTGl0ZUV2ZW50IH0gZnJvbSBcIi4uL0NvcmUvSGVscGVycy9MaXRlRXZlbnRcIjtcclxuaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuLi9Db3JlL0dhbWVPYmplY3RcIjtcclxuaW1wb3J0IHsgSUxpdGVFdmVudCB9IGZyb20gXCIuLi9Db3JlL0ludGVyZmFjZXMvSUxpdGVFdmVudFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRyYW5zZm9ybSBleHRlbmRzIENvbXBvbmVudCB7XHJcblxyXG4gICAgcHVibGljIHdpZHRoOiBudW1iZXIgPSAwO1xyXG4gICAgcHVibGljIGhlaWdodDogbnVtYmVyID0gMDtcclxuICAgIC8vUG9zaXRpb24gaXMgdGhlIHRvcCBsZWZ0IG9mIHRoZSBhZ2VudCB3aXRoIHdpZHRoIGdyb3dpbmcgcmlnaHQgYW5kIGhlaWdodCBncm93aW5nIGRvd24uXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgcG9zaXRpb246IFZlY3RvcjI7XHJcbiAgICAvL1JvdGF0aW9uIGluIHJhZGlhbnNcclxuICAgIHB1YmxpYyByb3RhdGlvbjogbnVtYmVyO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgb25Nb3ZlID0gbmV3IExpdGVFdmVudDx2b2lkPigpO1xyXG5cclxuICAgIFxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGdhbWVPYmplY3Q6IEdhbWVPYmplY3QsIHg6IG51bWJlciwgeTogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xyXG4gICAgICAgIHN1cGVyKGdhbWVPYmplY3QpO1xyXG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFZlY3RvcjIoeCwgeSk7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvbiA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBvbk1vdmVkKCk6IElMaXRlRXZlbnQ8dm9pZD4geyBcclxuICAgICAgICByZXR1cm4gdGhpcy5vbk1vdmUuZXhwb3NlKCk7IFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgY2VudGVyKCk6IFZlY3RvcjIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMih0aGlzLnBvc2l0aW9uLnggKyAodGhpcy53aWR0aCAvIDIpLCB0aGlzLnBvc2l0aW9uLnkgKyAodGhpcy5oZWlnaHQgLyAyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBib3R0b21DZW50ZXIoKTogVmVjdG9yMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHRoaXMucG9zaXRpb24ueCArICh0aGlzLndpZHRoIC8gMiksIHRoaXMucG9zaXRpb24ueSArIHRoaXMuaGVpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdHJhbnNsYXRlKHRyYW5zbGF0aW9uOiBWZWN0b3IyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbi54ICs9IHRyYW5zbGF0aW9uLng7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbi55ICs9ICgtMSAqIHRyYW5zbGF0aW9uLnkpOyAvL1RoaXMgaXMgdG8gbWFrZSBhIG1vcmUgcG9zaXRpdmUgeSB2YWx1ZSBnbyB1cCBpbnN0ZWFkIG9mIGRvd24uXHJcbiAgICAgICAgdGhpcy5vbk1vdmUudHJpZ2dlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRQb3NpdGlvbih4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24ueCA9IHg7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbi55ID0geTtcclxuICAgICAgICB0aGlzLm9uTW92ZS50cmlnZ2VyKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBUaW1lIH0gZnJvbSBcIi4vVGltZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFuaW1hdGlvbiB7XHJcblxyXG4gICAgcHVibGljIGxvb3A6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHVibGljIGFuaW1hdGlvblJlYWR5OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBcclxuICAgIHByaXZhdGUgZnJhbWVzOiBIVE1MSW1hZ2VFbGVtZW50W10gPSBbXTtcclxuICAgIHByaXZhdGUgZnJhbWVJbmRleDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgZGVsYXk6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIHRpbWVyOiBudW1iZXIgPSAwO1xyXG4gICAgXHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHNwcml0ZVNoZWV0VXJsOiBzdHJpbmcsIG51bUZyYW1lczogbnVtYmVyLCBudW1Sb3dzOiBudW1iZXIsIGRlbGF5OiBudW1iZXIgPSAwKSB7XHJcbiAgICAgICAgdGhpcy5kZWxheSA9IGRlbGF5O1xyXG5cclxuICAgICAgICBsZXQgc3ByaXRlU2hlZXQgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICBzcHJpdGVTaGVldC5zcmMgPSBzcHJpdGVTaGVldFVybDtcclxuICAgICAgICBzcHJpdGVTaGVldC5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzcHJpdGVXaWR0aCA9IHNwcml0ZVNoZWV0LndpZHRoIC8gbnVtRnJhbWVzO1xyXG4gICAgICAgICAgICBsZXQgc3ByaXRlSGVpZ2h0ID0gc3ByaXRlU2hlZXQuaGVpZ2h0IC8gbnVtUm93cztcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtUm93czsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG51bUZyYW1lczsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25SZWFkeSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBjYW52YXMud2lkdGggPSBzcHJpdGVXaWR0aDtcclxuICAgICAgICAgICAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gc3ByaXRlSGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKHNwcml0ZVNoZWV0LCBqICogc3ByaXRlV2lkdGgsIGkgKiBzcHJpdGVIZWlnaHQsIHNwcml0ZVdpZHRoLCBzcHJpdGVIZWlnaHQsIDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZyYW1lID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZnJhbWUuc3JjID0gY2FudmFzLnRvRGF0YVVSTCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZyYW1lLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mcmFtZXMucHVzaChmcmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uUmVhZHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgY3VycmVudEZyYW1lKCk6IEhUTUxJbWFnZUVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZyYW1lc1t0aGlzLmZyYW1lSW5kZXhdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGVBbmltYXRpb24oKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmxvb3AgJiYgdGhpcy5mcmFtZUluZGV4ID09PSB0aGlzLmZyYW1lcy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudGltZXIgKz0gVGltZS5EZWx0YVRpbWU7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRpbWVyIDwgdGhpcy5kZWxheSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnRpbWVyID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5mcmFtZUluZGV4ID0gKHRoaXMuZnJhbWVJbmRleCArIDEpICUgdGhpcy5mcmFtZXMubGVuZ3RoO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUGh5c2ljcyB9IGZyb20gXCIuL1BoeXNpY3NcIjtcclxuaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuL0dhbWVPYmplY3RcIjtcclxuaW1wb3J0IHsgVGltZSB9IGZyb20gXCIuL1RpbWVcIjtcclxuaW1wb3J0IHsgSUJhY2tncm91bmQgfSBmcm9tIFwiLi9JbnRlcmZhY2VzL0lCYWNrZ3JvdW5kXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgR2FtZUVuZ2luZSB7XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IEdhbWVFbmdpbmU7XHJcblxyXG4gICAgcHJpdmF0ZSBnYW1lQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIHByaXZhdGUgY2FudmFzQ29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gICAgcHJpdmF0ZSBiYWNrZ3JvdW5kOiBJQmFja2dyb3VuZDtcclxuICAgIHByaXZhdGUgcGh5c2ljc0VuZ2luZTogUGh5c2ljcztcclxuICAgIHByaXZhdGUgZ2FtZU9iamVjdHM6IEdhbWVPYmplY3RbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBnYW1lT2JqZWN0TWFwOiBNYXA8c3RyaW5nLCBHYW1lT2JqZWN0PiA9IG5ldyBNYXA8c3RyaW5nLCBHYW1lT2JqZWN0PigpO1xyXG4gICAgcHJpdmF0ZSBnYW1lT2JqZWN0TnVtTWFwOiBNYXA8c3RyaW5nLCBudW1iZXI+ID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcclxuICAgIHByaXZhdGUgZ2FtZUluaXRpYWxpemVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIHBhdXNlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuXHJcbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuZ2FtZUluaXRpYWxpemVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5waHlzaWNzRW5naW5lID0gUGh5c2ljcy5JbnN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBJbnN0YW5jZSgpOiBHYW1lRW5naW5lIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZSB8fCAodGhpcy5pbnN0YW5jZSA9IG5ldyBHYW1lRW5naW5lKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbml0aWFsaXplR2FtZShnYW1lQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgZ2FtZU9iamVjdHM6IEdhbWVPYmplY3RbXSwgYmFja2dyb3VuZDogSUJhY2tncm91bmQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmJhY2tncm91bmQgPSBiYWNrZ3JvdW5kO1xyXG4gICAgICAgIHRoaXMuc2V0R2FtZUNhbnZhcyhnYW1lQ2FudmFzKTtcclxuICAgICAgICB0aGlzLnNldEdhbWVPYmplY3RzKGdhbWVPYmplY3RzKTtcclxuICAgICAgICAgXHJcbiAgICAgICAgdGhpcy5nYW1lSW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGFydEdhbWUoKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGlmKCF0aGlzLmdhbWVJbml0aWFsaXplZCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgZ2FtZSBpcyBub3QgaW5pdGlhbGl6ZWQgeWV0IVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFRpbWUuc3RhcnQoKTtcclxuICAgICAgICB0aGlzLnBhdXNlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBmb3IobGV0IGk6IG51bWJlciA9IDA7IGkgPCB0aGlzLmdhbWVPYmplY3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZU9iamVjdHNbaV0uc3RhcnQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmdhbWVMb29wKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbnN0YW50aWF0ZShuZXdHYW1lT2JqZWN0OiBHYW1lT2JqZWN0KTogR2FtZU9iamVjdCB7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2FtZU9iamVjdE1hcC5oYXMobmV3R2FtZU9iamVjdC5pZCkpIHtcclxuICAgICAgICAgICAgbGV0IG9yaWdpbmFsSWQgPSBuZXdHYW1lT2JqZWN0LmlkO1xyXG4gICAgICAgICAgICBuZXdHYW1lT2JqZWN0LmlkICs9IFwiIENsb25lKFwiICsgdGhpcy5nYW1lT2JqZWN0TnVtTWFwLmdldChvcmlnaW5hbElkKSArIFwiKVwiO1xyXG4gICAgICAgICAgICB0aGlzLmdhbWVPYmplY3ROdW1NYXAuc2V0KG9yaWdpbmFsSWQsIHRoaXMuZ2FtZU9iamVjdE51bU1hcC5nZXQob3JpZ2luYWxJZCkgKyAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZU9iamVjdE51bU1hcC5zZXQobmV3R2FtZU9iamVjdC5pZCwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuZ2FtZU9iamVjdE1hcC5zZXQobmV3R2FtZU9iamVjdC5pZCwgbmV3R2FtZU9iamVjdCk7XHJcbiAgICAgICAgdGhpcy5nYW1lT2JqZWN0cy5wdXNoKG5ld0dhbWVPYmplY3QpO1xyXG4gICAgICAgIG5ld0dhbWVPYmplY3Quc3RhcnQoKTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gbmV3R2FtZU9iamVjdDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0R2FtZU9iamVjdEJ5SWQoaWQ6IHN0cmluZyk6IEdhbWVPYmplY3Qge1xyXG4gICAgICAgIGlmICghdGhpcy5nYW1lT2JqZWN0TWFwLmhhcyhpZCkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gR2FtZU9iamVjdCB3aXRoIGlkIG9mIFwiICsgaWQgKyBcIiBleGlzdHMhXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2FtZU9iamVjdE1hcC5nZXQoaWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRHYW1lQ2FudmFzKCk6IEhUTUxDYW52YXNFbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nYW1lQ2FudmFzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRHYW1lQ2FudmFzQ29udGV4dCgpOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNhbnZhc0NvbnRleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHByaW50R2FtZURhdGEoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcyk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJUaW1lIHNpbmNlIGdhbWUgc3RhcnQgXCIgKyBUaW1lLlRvdGFsVGltZSArIFwic1wiKTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5nYW1lT2JqZWN0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmdhbWVPYmplY3RzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRvZ2dsZVBhdXNlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucGF1c2VkID0gIXRoaXMucGF1c2VkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0R2FtZUNhbnZhcyhnYW1lQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcyA9IGdhbWVDYW52YXM7XHJcbiAgICAgICAgdGhpcy5jYW52YXNDb250ZXh0ID0gdGhpcy5nYW1lQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldEdhbWVPYmplY3RzKGdhbWVPYmplY3RzOiBHYW1lT2JqZWN0W10pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmdhbWVPYmplY3RzID0gZ2FtZU9iamVjdHM7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGdhbWVPYmplY3Qgb2YgZ2FtZU9iamVjdHMpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdhbWVPYmplY3RNYXAuaGFzKGdhbWVPYmplY3QuaWQpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgb3JpZ2luYWxJZCA9IGdhbWVPYmplY3QuaWQ7XHJcbiAgICAgICAgICAgICAgICBnYW1lT2JqZWN0LmlkICs9IFwiIENsb25lKFwiICsgdGhpcy5nYW1lT2JqZWN0TnVtTWFwLmdldChvcmlnaW5hbElkKSArIFwiKVwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lT2JqZWN0TnVtTWFwLnNldChvcmlnaW5hbElkLCB0aGlzLmdhbWVPYmplY3ROdW1NYXAuZ2V0KG9yaWdpbmFsSWQpICsgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWVPYmplY3ROdW1NYXAuc2V0KGdhbWVPYmplY3QuaWQsIDEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmdhbWVPYmplY3RNYXAuc2V0KGdhbWVPYmplY3QuaWQsIGdhbWVPYmplY3QpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5wYXVzZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgVGltZS51cGRhdGVUaW1lKCk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJCYWNrZ3JvdW5kKCk7XHJcbiAgICAgICAgLy90aGlzLnBoeXNpY3NFbmdpbmUudXBkYXRlUGh5c2ljcygpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvcihsZXQgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMuZ2FtZU9iamVjdHMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICB0aGlzLmdhbWVPYmplY3RzW2ldLnVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbmRlckJhY2tncm91bmQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2FtZUxvb3AoKTogdm9pZCB7IFxyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuZ2FtZUxvb3AoKSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBUcmFuc2Zvcm0gfSBmcm9tIFwiLi4vQ29tcG9uZW50cy9UcmFuc2Zvcm1cIjtcclxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4uL0NvbXBvbmVudHMvQ29tcG9uZW50XCI7XHJcbmltcG9ydCB7IEdhbWVFbmdpbmUgfSBmcm9tIFwiLi9HYW1lRW5naW5lXCI7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgR2FtZU9iamVjdCB7XHJcbiAgICBcclxuICAgIHB1YmxpYyBpZDogc3RyaW5nO1xyXG5cclxuICAgIHByb3RlY3RlZCB0cmFuc2Zvcm06IFRyYW5zZm9ybTtcclxuICAgIHByb3RlY3RlZCBnYW1lQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIHByb3RlY3RlZCBjYW52YXNDb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgICBwcm90ZWN0ZWQgY29tcG9uZW50czogQ29tcG9uZW50W10gPSBbXTtcclxuICAgIHByb3RlY3RlZCBjb21wb25lbnRNYXA6IE1hcDxzdHJpbmcsIENvbXBvbmVudD4gPSBuZXcgTWFwPHN0cmluZywgQ29tcG9uZW50PigpO1xyXG4gICAgXHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIHg6IG51bWJlciA9IDAsIHk6IG51bWJlciA9IDAsIHdpZHRoOiBudW1iZXIgPSAwLCBoZWlnaHQ6IG51bWJlciA9IDApIHtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0gPSBuZXcgVHJhbnNmb3JtKHRoaXMsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGFydCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMgPSBHYW1lRW5naW5lLkluc3RhbmNlLmdldEdhbWVDYW52YXMoKTtcclxuICAgICAgICB0aGlzLmNhbnZhc0NvbnRleHQgPSB0aGlzLmdhbWVDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cclxuICAgICAgICBmb3IobGV0IGk6IG51bWJlciA9IDA7IGkgPCB0aGlzLmNvbXBvbmVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzW2ldLnN0YXJ0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgZm9yKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5jb21wb25lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50c1tpXS51cGRhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFRyYW5zZm9ybSgpOiBUcmFuc2Zvcm0ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0R2FtZUNhbnZhcygpOiBIVE1MQ2FudmFzRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2FtZUNhbnZhcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q29tcG9uZW50PFQgZXh0ZW5kcyBDb21wb25lbnQ+KGNvbXBvbmVudDogbmV3ICguLi5hcmdzOiBhbnlbXSkgPT4gVCk6IFQge1xyXG4gICAgICAgIGxldCBjb21wb25lbnRUeXBlID0gY29tcG9uZW50Lm5hbWU7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5jb21wb25lbnRNYXAuaGFzKGNvbXBvbmVudFR5cGUpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihjb21wb25lbnRUeXBlICsgXCIgbm90IGZvdW5kIG9uIHRoZSBHYW1lT2JqZWN0IHdpdGggaWQgb2YgXCIgKyB0aGlzLmlkICsgXCIhXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIDxUPnRoaXMuY29tcG9uZW50TWFwLmdldChjb21wb25lbnRUeXBlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQ29tcG9uZW50PFQgZXh0ZW5kcyBDb21wb25lbnQ+KG5ld0NvbXBvbmVudDogQ29tcG9uZW50KTogVCB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29tcG9uZW50TWFwLmhhcyhuZXdDb21wb25lbnQuY29uc3RydWN0b3IubmFtZSkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlcmUgaXMgYWxyZWFkeSBhIGNvbXBvbmVudCBvZiB0eXBlIFwiICsgbmV3Q29tcG9uZW50LmNvbnN0cnVjdG9yLm5hbWUgKyBcIiBvbiB0aGlzIG9iamVjdCFcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNvbXBvbmVudHMucHVzaChuZXdDb21wb25lbnQpO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50TWFwLnNldChuZXdDb21wb25lbnQuY29uc3RydWN0b3IubmFtZSwgbmV3Q29tcG9uZW50KTtcclxuICAgICAgICBuZXdDb21wb25lbnQuc3RhcnQoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIDxUPm5ld0NvbXBvbmVudDtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgc2V0Q29tcG9uZW50cyhjb21wb25lbnRzOiBDb21wb25lbnRbXSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50cyA9IGNvbXBvbmVudHM7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGNvbXBvbmVudCBvZiBjb21wb25lbnRzKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbXBvbmVudE1hcC5oYXMoY29tcG9uZW50LmNvbnN0cnVjdG9yLm5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGVyZSBpcyBhbHJlYWR5IGEgY29tcG9uZW50IG9mIHR5cGUgXCIgKyBjb21wb25lbnQuY29uc3RydWN0b3IubmFtZSArIFwiIG9uIHRoaXMgb2JqZWN0IVwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRNYXAuc2V0KGNvbXBvbmVudC5jb25zdHJ1Y3Rvci5uYW1lLCBjb21wb25lbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi9WZWN0b3IyXCI7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgR2VvbWV0cnkge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2l2ZW4gdGhyZWUgY29saW5lYXIgcG9pbnRzIHAsIHEsIHIsIHRoZSBmdW5jdGlvbiBjaGVja3MgaWYgcG9pbnQgcSBsaWVzIG9uIGxpbmUgc2VnbWVudCAncHInIFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIG9uU2VnbWVudChwOiBWZWN0b3IyLCBxOiBWZWN0b3IyLCByOiBWZWN0b3IyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHEueCA8PSBNYXRoLm1heChwLngsIHIueCkgJiYgcS54ID49IE1hdGgubWluKHAueCwgci54KSAmJlxyXG4gICAgICAgICAgICBxLnkgPD0gTWF0aC5tYXgocC55LCByLnkpICYmIHEueSA+PSBNYXRoLm1pbihwLnksIHIueSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGaW5kcyB0aGUgb3JpZW50YXRpb24gb2Ygb3JkZXJlZCB0cmlwbGV0IChwLCBxLCByKS4gXHJcbiAgICAgKiBUaGUgZnVuY3Rpb24gcmV0dXJucyBmb2xsb3dpbmcgdmFsdWVzIFxyXG4gICAgICogMCAtLT4gcCwgcSBhbmQgciBhcmUgY29saW5lYXIgXHJcbiAgICAgKiAxIC0tPiBDbG9ja3dpc2UgXHJcbiAgICAgKiAyIC0tPiBDb3VudGVyY2xvY2t3aXNlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgb3JpZW50YXRpb24ocDogVmVjdG9yMiwgcTogVmVjdG9yMiwgcjogVmVjdG9yMik6IG51bWJlciB7XHJcbiAgICAgICAgbGV0IHZhbCA9IChxLnkgLSBwLnkpICogKHIueCAtIHEueCkgLSAocS54IC0gcC54KSAqIChyLnkgLSBxLnkpO1xyXG5cclxuICAgICAgICBpZiAodmFsID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwOyAvLyBjb2xpbmVhciBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAodmFsID4gMCkgPyAxIDogMjsgLy8gY2xvY2sgb3IgY291bnRlcmNsb2NrIHdpc2UgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgbGluZSBzZWdtZW50ICdwMXExJyBhbmQgJ3AycTInIGludGVyc2VjdC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBkb0ludGVyc2VjdChwMTogVmVjdG9yMiwgcTE6IFZlY3RvcjIsIHAyOiBWZWN0b3IyLCBxMjogVmVjdG9yMik6IGJvb2xlYW4ge1xyXG4gICAgICAgIC8vIEZpbmQgdGhlIGZvdXIgb3JpZW50YXRpb25zIG5lZWRlZCBmb3IgZ2VuZXJhbCBhbmQgXHJcbiAgICAgICAgLy8gc3BlY2lhbCBjYXNlcyBcclxuICAgICAgICBsZXQgbzEgPSB0aGlzLm9yaWVudGF0aW9uKHAxLCBxMSwgcDIpO1xyXG4gICAgICAgIGxldCBvMiA9IHRoaXMub3JpZW50YXRpb24ocDEsIHExLCBxMik7XHJcbiAgICAgICAgbGV0IG8zID0gdGhpcy5vcmllbnRhdGlvbihwMiwgcTIsIHAxKTtcclxuICAgICAgICBsZXQgbzQgPSB0aGlzLm9yaWVudGF0aW9uKHAyLCBxMiwgcTEpO1xyXG5cclxuICAgICAgICAvLyBHZW5lcmFsIGNhc2UgXHJcbiAgICAgICAgaWYgKG8xICE9PSBvMiAmJiBvMyAhPT0gbzQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBTcGVjaWFsIENhc2VzIFxyXG4gICAgICAgIC8vIHAxLCBxMSBhbmQgcDIgYXJlIGNvbGluZWFyIGFuZCBwMiBsaWVzIG9uIHNlZ21lbnQgcDFxMSBcclxuICAgICAgICBpZiAobzEgPT09IDAgJiYgdGhpcy5vblNlZ21lbnQocDEsIHAyLCBxMSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBwMSwgcTEgYW5kIHEyIGFyZSBjb2xpbmVhciBhbmQgcTIgbGllcyBvbiBzZWdtZW50IHAxcTEgXHJcbiAgICAgICAgaWYgKG8yID09PSAwICYmIHRoaXMub25TZWdtZW50KHAxLCBxMiwgcTEpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcDIsIHEyIGFuZCBwMSBhcmUgY29saW5lYXIgYW5kIHAxIGxpZXMgb24gc2VnbWVudCBwMnEyIFxyXG4gICAgICAgIGlmIChvMyA9PT0gMCAmJiB0aGlzLm9uU2VnbWVudChwMiwgcDEsIHEyKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHAyLCBxMiBhbmQgcTEgYXJlIGNvbGluZWFyIGFuZCBxMSBsaWVzIG9uIHNlZ21lbnQgcDJxMiBcclxuICAgICAgICBpZiAobzQgPT09IDAgJiYgdGhpcy5vblNlZ21lbnQocDIsIHExLCBxMikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7IC8vIERvZXNuJ3QgZmFsbCBpbiBhbnkgb2YgdGhlIGFib3ZlIGNhc2VzIFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZG9JbnRlcnNlY3RSZWN0YW5nbGUocDE6IFZlY3RvcjIsIHAyOiBWZWN0b3IyLCB0bDogVmVjdG9yMiwgdHI6IFZlY3RvcjIsIGJsOiBWZWN0b3IyLCBicjogVmVjdG9yMik6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLmRvSW50ZXJzZWN0KHAxLCBwMiwgdGwsIHRyKSB8fCAvL0xpbmUgaW50ZXJzZWN0cyB0b3AgYm9yZGVyXHJcbiAgICAgICAgICAgIHRoaXMuZG9JbnRlcnNlY3QocDEsIHAyLCB0bCwgYmwpIHx8IC8vTGluZSBpbnRlcnNlY3RzIGxlZnQgYm9yZGVyXHJcbiAgICAgICAgICAgIHRoaXMuZG9JbnRlcnNlY3QocDEsIHAyLCBibCwgYnIpIHx8IC8vTGluZSBpbnRlcnNlY3RzIGJvdHRvbSBib3JkZXJcclxuICAgICAgICAgICAgdGhpcy5kb0ludGVyc2VjdChwMSwgcDIsIHRyLCBicikpIHsgLy9MaW5lIGludGVyc2VjdHMgcmlnaHQgYm9yZGVyXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn0gIiwiZXhwb3J0IGVudW0gS2V5cyB7XHJcbiAgICBVUCA9IDM4LFxyXG4gICAgRE9XTiA9IDQwLFxyXG4gICAgTEVGVCA9IDM3LFxyXG4gICAgUklHSFQgPSAzOSxcclxuICAgIFcgPSA4NyxcclxuICAgIEEgPSA2NSxcclxuICAgIFMgPSA4MyxcclxuICAgIEQgPSA2OCxcclxuICAgIFNQQUNFID0gMzJcclxufSIsImltcG9ydCB7IElMaXRlRXZlbnQgfSBmcm9tIFwiLi4vSW50ZXJmYWNlcy9JTGl0ZUV2ZW50XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTGl0ZUV2ZW50PFQ+IGltcGxlbWVudHMgSUxpdGVFdmVudDxUPiB7XHJcblxyXG4gICAgcHJpdmF0ZSBoYW5kbGVyczogeyAoZGF0YT86IFQpOiB2b2lkOyB9W10gPSBbXTtcclxuXHJcblxyXG4gICAgcHVibGljIGFkZChoYW5kbGVyOiB7IChkYXRhPzogVCk6IHZvaWQgfSkgOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnB1c2goaGFuZGxlcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZShoYW5kbGVyOiB7IChkYXRhPzogVCk6IHZvaWQgfSkgOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzID0gdGhpcy5oYW5kbGVycy5maWx0ZXIoaCA9PiBoICE9PSBoYW5kbGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdHJpZ2dlcihkYXRhPzogVCkge1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2xpY2UoMCkuZm9yRWFjaChoID0+IGgoZGF0YSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBleHBvc2UoKSA6IElMaXRlRXZlbnQ8VD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgSUJhY2tncm91bmQgfSBmcm9tIFwiLi9JbnRlcmZhY2VzL0lCYWNrZ3JvdW5kXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSW1hZ2VCYWNrZ3JvdW5kIGltcGxlbWVudHMgSUJhY2tncm91bmQge1xyXG4gICAgXHJcbiAgICBwcml2YXRlIGdhbWVDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBjYW52YXNDb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgICBwcml2YXRlIGltYWdlOiBIVE1MSW1hZ2VFbGVtZW50O1xyXG5cclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoZ2FtZUNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIGltYWdlU3JjOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmltYWdlID0gbmV3IEltYWdlKGdhbWVDYW52YXMud2lkdGgsIGdhbWVDYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICB0aGlzLmltYWdlLnNyYyA9IGltYWdlU3JjO1xyXG4gICAgICAgIHRoaXMuY2FudmFzQ29udGV4dCA9IGdhbWVDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcyA9IGdhbWVDYW52YXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyByZW5kZXIoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jYW52YXNDb250ZXh0LmRyYXdJbWFnZSh0aGlzLmltYWdlLCAwLCAwLCB0aGlzLmdhbWVDYW52YXMud2lkdGgsIHRoaXMuZ2FtZUNhbnZhcy5oZWlnaHQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUmlnaWRib2R5IH0gZnJvbSBcIi4uL0NvbXBvbmVudHMvUmlnaWRib2R5XCI7XHJcbmltcG9ydCB7IFJlY3RhbmdsZUNvbGxpZGVyIH0gZnJvbSBcIi4uL0NvbXBvbmVudHMvUmVjdGFuZ2xlQ29sbGlkZXJcIjtcclxuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuL1ZlY3RvcjJcIjtcclxuaW1wb3J0IHsgR2VvbWV0cnkgfSBmcm9tIFwiLi9HZW9tZXRyeVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBoeXNpY3Mge1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBQaHlzaWNzO1xyXG5cclxuICAgIHB1YmxpYyBncmF2aXR5OiBudW1iZXI7XHJcblxyXG4gICAgcHJpdmF0ZSByaWdpZGJvZGllczogUmlnaWRib2R5W107XHJcbiAgICBwcml2YXRlIGNvbGxpZGVyczogUmVjdGFuZ2xlQ29sbGlkZXJbXTtcclxuXHJcblxyXG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnJpZ2lkYm9kaWVzID0gW107XHJcbiAgICAgICAgdGhpcy5jb2xsaWRlcnMgPSBbXTtcclxuICAgICAgICB0aGlzLmdyYXZpdHkgPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IEluc3RhbmNlKCk6IFBoeXNpY3Mge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlIHx8ICh0aGlzLmluc3RhbmNlID0gbmV3IFBoeXNpY3MoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHVibGljIHVwZGF0ZVBoeXNpY3MoKTogdm9pZCB7XHJcbiAgICAvLyAgICAgZm9yKGxldCBpOiBudW1iZXIgPSAwLCBsOiBudW1iZXIgPSB0aGlzLnJpZ2lkYm9kaWVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgLy8gICAgICAgICB0aGlzLnJpZ2lkYm9kaWVzW2ldLmFkZEdyYXZpdHkodGhpcy5ncmF2aXR5KTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyB9XHJcblxyXG4gICAgcHVibGljIGFkZFJpZ2lkYm9keShyYjogUmlnaWRib2R5KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5yaWdpZGJvZGllcy5wdXNoKHJiKTtcclxuICAgICAgICAvL3RoaXMuY29sbGlkZXJzLnB1c2gocmIuZ2FtZU9iamVjdC5nZXRDb21wb25lbnQoUmVjdGFuZ2xlQ29sbGlkZXIpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQ29sbGlkZXIoY29sbGlkZXI6IFJlY3RhbmdsZUNvbGxpZGVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jb2xsaWRlcnMucHVzaChjb2xsaWRlcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyByYXljYXN0KG9yaWdpbjogVmVjdG9yMiwgZGlyZWN0aW9uOiBWZWN0b3IyLCBkaXN0YW5jZTogbnVtYmVyKTogUmVjdGFuZ2xlQ29sbGlkZXIgfCBudWxsIHtcclxuICAgICAgICBsZXQgcmVzdWx0OiBSZWN0YW5nbGVDb2xsaWRlciA9IG51bGw7XHJcbiAgICAgICAgbGV0IGhpdENvbGxpZGVycyA9IFBoeXNpY3MucmF5Y2FzdEFsbChvcmlnaW4sIGRpcmVjdGlvbiwgZGlzdGFuY2UpO1xyXG4gICAgICAgIGxldCBjbG9zZXN0Q29sbGlkZXJEaXN0YW5jZSA9IC0xMDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgY29sbGlkZXIgb2YgaGl0Q29sbGlkZXJzKSB7XHJcbiAgICAgICAgICAgIGxldCBjb2xsaWRlckRpc3RhbmNlID0gVmVjdG9yMi5kaXN0YW5jZShvcmlnaW4sIGNvbGxpZGVyLnRyYW5zZm9ybS5wb3NpdGlvbik7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29sbGlkZXJEaXN0YW5jZSA+IGNsb3Nlc3RDb2xsaWRlckRpc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBjb2xsaWRlcjtcclxuICAgICAgICAgICAgICAgIGNsb3Nlc3RDb2xsaWRlckRpc3RhbmNlID0gY29sbGlkZXJEaXN0YW5jZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcmF5Y2FzdEFsbChvcmlnaW46IFZlY3RvcjIsIGRpcmVjdGlvbjogVmVjdG9yMiwgZGlzdGFuY2U6IG51bWJlcik6IFJlY3RhbmdsZUNvbGxpZGVyW10ge1xyXG4gICAgICAgIGxldCByZXN1bHRzOiBSZWN0YW5nbGVDb2xsaWRlcltdID0gW107XHJcbiAgICAgICAgbGV0IHRlcm1pbmFsUG9pbnQgPSBWZWN0b3IyLmFkZChvcmlnaW4sIGRpcmVjdGlvbi5tdWx0aXBseVNjYWxhcihkaXN0YW5jZSkpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBjb2xsaWRlciBvZiBQaHlzaWNzLkluc3RhbmNlLmNvbGxpZGVycykge1xyXG4gICAgICAgICAgICBpZiAoR2VvbWV0cnkuZG9JbnRlcnNlY3RSZWN0YW5nbGUob3JpZ2luLCB0ZXJtaW5hbFBvaW50LCBjb2xsaWRlci50b3BMZWZ0LCBjb2xsaWRlci50b3BSaWdodCwgY29sbGlkZXIuYm90dG9tTGVmdCwgY29sbGlkZXIuYm90dG9tUmlnaHQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goY29sbGlkZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0cztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHNwaGVyZUNhc3QoKSB7fVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgb3ZlcmxhcFNwaGVyZSgpOiBSZWN0YW5nbGVDb2xsaWRlcltdIHsgcmV0dXJuIFtdIH1cclxufSIsImV4cG9ydCBhYnN0cmFjdCBjbGFzcyBUaW1lIHtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBkZWx0YVRpbWU6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBzdGFydFRpbWU6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBwcmV2VGltZTogbnVtYmVyID0gMDtcclxuXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgRGVsdGFUaW1lKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVsdGFUaW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IFRvdGFsVGltZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiAoRGF0ZS5ub3coKSAtIHRoaXMuc3RhcnRUaW1lKSAvIDEwMDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBzdGFydCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnByZXZUaW1lID0gRGF0ZS5ub3coKTtcclxuICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IHRoaXMucHJldlRpbWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyB1cGRhdGVUaW1lKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZGVsdGFUaW1lID0gKERhdGUubm93KCkgLSB0aGlzLnByZXZUaW1lKSAvIDEwMDA7XHJcbiAgICAgICAgdGhpcy5wcmV2VGltZSA9IERhdGUubm93KCk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgVmVjdG9yMiB7XHJcbiAgICBcclxuICAgIHB1YmxpYyB4OiBudW1iZXIgPSAwO1xyXG4gICAgcHVibGljIHk6IG51bWJlciA9IDA7XHJcblxyXG4gICAgXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBzcXJNYWduaXR1ZGUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMueCAqIHRoaXMueCkgKyAodGhpcy55ICogdGhpcy55KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG1hZ25pdHVkZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy5zcXJNYWduaXR1ZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgbm9ybWFsaXplZCgpOiBWZWN0b3IyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kaXZpZGUobmV3IFZlY3RvcjIodGhpcy5tYWduaXR1ZGUsIHRoaXMubWFnbml0dWRlKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZChyaWdodE9wZXJhbmQ6IFZlY3RvcjIpOiBWZWN0b3IyIHtcclxuICAgICAgICB0aGlzLnggKz0gcmlnaHRPcGVyYW5kLng7XHJcbiAgICAgICAgdGhpcy55ICs9IHJpZ2h0T3BlcmFuZC55O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3VidHJhY3QocmlnaHRPcGVyYW5kOiBWZWN0b3IyKTogVmVjdG9yMiB7XHJcbiAgICAgICAgdGhpcy54IC09IHJpZ2h0T3BlcmFuZC54O1xyXG4gICAgICAgIHRoaXMueSAtPSByaWdodE9wZXJhbmQueTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG11bHRpcGx5KHJpZ2h0T3BlcmFuZDogVmVjdG9yMik6IFZlY3RvcjIge1xyXG4gICAgICAgIHRoaXMueCAqPSByaWdodE9wZXJhbmQueDtcclxuICAgICAgICB0aGlzLnkgKj0gcmlnaHRPcGVyYW5kLnk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXZpZGUocmlnaHRPcGVyYW5kOiBWZWN0b3IyKTogVmVjdG9yMiB7XHJcbiAgICAgICAgdGhpcy54IC89IHJpZ2h0T3BlcmFuZC54O1xyXG4gICAgICAgIHRoaXMueSAvPSByaWdodE9wZXJhbmQueTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVxdWFscyhyaWdodE9wZXJhbmQ6IFZlY3RvcjIpOiBib29sZWFuIHtcclxuICAgICAgICBsZXQgZXF1YWxYID0gdGhpcy54ID09PSByaWdodE9wZXJhbmQueDtcclxuICAgICAgICBsZXQgZXF1YWxZID0gdGhpcy55ID09PSByaWdodE9wZXJhbmQueTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGVxdWFsWCAmJiBlcXVhbFk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG11bHRpcGx5U2NhbGFyKHJpZ2h0T3BlcmFuZDogbnVtYmVyKTogVmVjdG9yMiB7XHJcbiAgICAgICAgdGhpcy54ICo9IHJpZ2h0T3BlcmFuZDtcclxuICAgICAgICB0aGlzLnkgKj0gcmlnaHRPcGVyYW5kO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGl2aWRlU2NhbGFyKHJpZ2h0T3BlcmFuZDogbnVtYmVyKTogVmVjdG9yMiB7XHJcbiAgICAgICAgdGhpcy54IC89IHJpZ2h0T3BlcmFuZDtcclxuICAgICAgICB0aGlzLnkgLz0gcmlnaHRPcGVyYW5kO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgemVybygpOiBWZWN0b3IyIHtcclxuICAgICAgICB0aGlzLnggPSAwO1xyXG4gICAgICAgIHRoaXMueSA9IDA7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IHVwKCk6IFZlY3RvcjIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigwLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBkb3duKCk6IFZlY3RvcjIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigwLCAtMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgbGVmdCgpOiBWZWN0b3IyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoLTEsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IHJpZ2h0KCk6IFZlY3RvcjIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigxLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCB6ZXJvKCk6IFZlY3RvcjIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBvbmUoKTogVmVjdG9yMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKDEsIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgYWRkKGxlZnRPcGVyYW5kOiBWZWN0b3IyLCByaWdodE9wZXJhbmQ6IFZlY3RvcjIpOiBWZWN0b3IyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIobGVmdE9wZXJhbmQueCArIHJpZ2h0T3BlcmFuZC54LCBsZWZ0T3BlcmFuZC55ICsgcmlnaHRPcGVyYW5kLnkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZGlzdGFuY2UocG9pbnQxOiBWZWN0b3IyLCBwb2ludDI6IFZlY3RvcjIpOiBudW1iZXIge1xyXG4gICAgICAgIGxldCBkaXN0YW5jZVg6IG51bWJlciA9IHBvaW50MS54IC0gcG9pbnQyLng7XHJcbiAgICAgICAgbGV0IGRpc3RhbmNlWTogbnVtYmVyID0gcG9pbnQxLnkgLSBwb2ludDIueTtcclxuXHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCgoZGlzdGFuY2VYICogZGlzdGFuY2VYKSArIChkaXN0YW5jZVkgKiBkaXN0YW5jZVkpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGFuZ2xlSW5SYWRpYW5zKGZyb206IFZlY3RvcjIsIHRvOiBWZWN0b3IyKTogbnVtYmVyIHtcclxuICAgICAgICBsZXQgY29zMCA9IFZlY3RvcjIuZG90KGZyb20sIHRvKSAvIChmcm9tLm1hZ25pdHVkZSAqIHRvLm1hZ25pdHVkZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBNYXRoLmFjb3MoY29zMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBhbmdsZUluRGVncmVlcyhmcm9tOiBWZWN0b3IyLCB0bzogVmVjdG9yMik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYW5nbGVJblJhZGlhbnMoZnJvbSwgdG8pICogMTgwIC8gTWF0aC5QSTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRvdChwb2ludDE6IFZlY3RvcjIsIHBvaW50MjogVmVjdG9yMik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIChwb2ludDEueCAqIHBvaW50Mi54KSArIChwb2ludDEueSAqIHBvaW50Mi55KTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE1vdG9yIH0gZnJvbSBcIi4vTW90b3JcIjtcclxuaW1wb3J0IHsgUmVjdGFuZ2xlQ29sbGlkZXIgfSBmcm9tIFwiLi4vLi4vR2FtZUVuZ2luZS9Db21wb25lbnRzL1JlY3RhbmdsZUNvbGxpZGVyXCI7XHJcbmltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi4vLi4vR2FtZUVuZ2luZS9Db3JlL0dhbWVPYmplY3RcIjtcclxuaW1wb3J0IHsgR2FtZUVuZ2luZSB9IGZyb20gXCIuLi8uLi9HYW1lRW5naW5lL0NvcmUvR2FtZUVuZ2luZVwiO1xyXG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4uLy4uL0dhbWVFbmdpbmUvQ29yZS9WZWN0b3IyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQmFsbE1vdG9yIGV4dGVuZHMgTW90b3Ige1xyXG5cclxuICAgIHByaXZhdGUgcGxheWVyQ29sbGlkZXI6IFJlY3RhbmdsZUNvbGxpZGVyO1xyXG4gICAgcHJpdmF0ZSBjb21wdXRlckNvbGxpZGVyOiBSZWN0YW5nbGVDb2xsaWRlcjtcclxuICAgIHByaXZhdGUgY29sbGlkZXI6IFJlY3RhbmdsZUNvbGxpZGVyO1xyXG4gICAgcHJpdmF0ZSByZWFkeTogYm9vbGVhbiA9IHRydWU7XHJcblxyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihnYW1lT2JqZWN0OiBHYW1lT2JqZWN0KSB7XHJcbiAgICAgICAgc3VwZXIoZ2FtZU9iamVjdCk7XHJcblxyXG4gICAgICAgIHRoaXMucmVzZXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnQoKTogdm9pZCB7XHJcbiAgICAgICAgc3VwZXIuc3RhcnQoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNvbGxpZGVyID0gdGhpcy5nYW1lT2JqZWN0LmdldENvbXBvbmVudDxSZWN0YW5nbGVDb2xsaWRlcj4oUmVjdGFuZ2xlQ29sbGlkZXIpO1xyXG4gICAgICAgIHRoaXMucGxheWVyQ29sbGlkZXIgPSBHYW1lRW5naW5lLkluc3RhbmNlLmdldEdhbWVPYmplY3RCeUlkKFwicGxheWVyXCIpLmdldENvbXBvbmVudDxSZWN0YW5nbGVDb2xsaWRlcj4oUmVjdGFuZ2xlQ29sbGlkZXIpO1xyXG4gICAgICAgIHRoaXMuY29tcHV0ZXJDb2xsaWRlciA9IEdhbWVFbmdpbmUuSW5zdGFuY2UuZ2V0R2FtZU9iamVjdEJ5SWQoXCJjb21wdXRlclwiKS5nZXRDb21wb25lbnQ8UmVjdGFuZ2xlQ29sbGlkZXI+KFJlY3RhbmdsZUNvbGxpZGVyKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb2xsaWRlci5vbkNvbGxpZGVkLmFkZCgob3RoZXI6IFJlY3RhbmdsZUNvbGxpZGVyKSA9PiB0aGlzLmhhbmRsZUNvbGxpc2lvbihvdGhlcikpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlKCk7XHJcbiAgICAgICAgdGhpcy5kZXRlY3RDb2xsaXNpb25zKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBoYW5kbGVDb2xsaXNpb24ob3RoZXI6IFJlY3RhbmdsZUNvbGxpZGVyKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVhZHkpIHtcclxuICAgICAgICAgICAgdGhpcy5yZWFkeSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnhWZWxvY2l0eSAqPSAtMTtcclxuICAgICAgICAgICAgdGhpcy5zcGVlZCArPSAwLjEyNTtcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWFkeSA9IHRydWU7XHJcbiAgICAgICAgICAgIH0sIDI1MCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBoYW5kbGVPdXRPZkJvdW5kcygpOiB2b2lkIHtcclxuICAgICAgICBpZih0aGlzLnRyYW5zZm9ybS5wb3NpdGlvbi55IDw9IDApIHtcclxuICAgICAgICAgICAgdGhpcy55VmVsb2NpdHkgKj0gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodGhpcy50cmFuc2Zvcm0ucG9zaXRpb24ueSA+PSB0aGlzLmdhbWVDYW52YXMuaGVpZ2h0IC0gdGhpcy50cmFuc2Zvcm0uaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHRoaXMueVZlbG9jaXR5ID0gTWF0aC5hYnModGhpcy55VmVsb2NpdHkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy50cmFuc2Zvcm0ucG9zaXRpb24ueCArIHRoaXMudHJhbnNmb3JtLndpZHRoIDw9IDApIHtcclxuICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRoaXMudHJhbnNmb3JtLnBvc2l0aW9uLnggPj0gdGhpcy5nYW1lQ2FudmFzLndpZHRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG1vdmUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0udHJhbnNsYXRlKG5ldyBWZWN0b3IyKHRoaXMueFZlbG9jaXR5LCB0aGlzLnlWZWxvY2l0eSkubXVsdGlwbHlTY2FsYXIodGhpcy5zcGVlZCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVzZXQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0uc2V0UG9zaXRpb24oMzQ1LCAxOTUpO1xyXG4gICAgICAgIHRoaXMueFZlbG9jaXR5ID0gTWF0aC5yYW5kb20oKSA8IDAuNSA/IC0xIDogMTtcclxuICAgICAgICB0aGlzLnlWZWxvY2l0eSA9IE1hdGgucmFuZG9tKCkgPCAwLjUgPyAtMSA6IDE7XHJcbiAgICAgICAgdGhpcy5zcGVlZCA9IDM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZXRlY3RDb2xsaXNpb25zKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY29sbGlkZXIuZGV0ZWN0Q29sbGlzaW9uKHRoaXMucGxheWVyQ29sbGlkZXIpO1xyXG4gICAgICAgIHRoaXMuY29sbGlkZXIuZGV0ZWN0Q29sbGlzaW9uKHRoaXMuY29tcHV0ZXJDb2xsaWRlcik7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBNb3RvciB9IGZyb20gXCIuL01vdG9yXCI7XHJcbmltcG9ydCB7IFRyYW5zZm9ybSB9IGZyb20gXCIuLi8uLi9HYW1lRW5naW5lL0NvbXBvbmVudHMvVHJhbnNmb3JtXCI7XHJcbmltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi4vLi4vR2FtZUVuZ2luZS9Db3JlL0dhbWVPYmplY3RcIjtcclxuaW1wb3J0IHsgR2FtZUVuZ2luZSB9IGZyb20gXCIuLi8uLi9HYW1lRW5naW5lL0NvcmUvR2FtZUVuZ2luZVwiO1xyXG5pbXBvcnQgeyBUaW1lIH0gZnJvbSBcIi4uLy4uL0dhbWVFbmdpbmUvQ29yZS9UaW1lXCI7XHJcbmltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vLi4vR2FtZUVuZ2luZS9Db3JlL1ZlY3RvcjJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21wdXRlck1vdG9yIGV4dGVuZHMgTW90b3Ige1xyXG5cclxuICAgIHByaXZhdGUgYmFsbFRyYW5zZm9ybTogVHJhbnNmb3JtO1xyXG4gICAgcHJpdmF0ZSB0aW1lcjogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgcXVhcnRlckZpZWxkWDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBtaWRGaWVsZFk6IG51bWJlcjtcclxuXHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGdhbWVPYmplY3Q6IEdhbWVPYmplY3QpIHtcclxuICAgICAgICBzdXBlcihnYW1lT2JqZWN0KTtcclxuXHJcbiAgICAgICAgdGhpcy55VmVsb2NpdHkgPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGFydCgpOiB2b2lkIHtcclxuICAgICAgICBzdXBlci5zdGFydCgpO1xyXG5cclxuICAgICAgICB0aGlzLmJhbGxUcmFuc2Zvcm0gPSBHYW1lRW5naW5lLkluc3RhbmNlLmdldEdhbWVPYmplY3RCeUlkKFwiYmFsbFwiKS5nZXRUcmFuc2Zvcm0oKTtcclxuICAgICAgICB0aGlzLnF1YXJ0ZXJGaWVsZFggPSB0aGlzLmdhbWVDYW52YXMud2lkdGggLyA0O1xyXG4gICAgICAgIHRoaXMubWlkRmllbGRZID0gdGhpcy5nYW1lQ2FudmFzLmhlaWdodCAvIDI7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGhhbmRsZU91dE9mQm91bmRzKCk6IHZvaWQge1xyXG4gICAgICAgIGlmKHRoaXMudHJhbnNmb3JtLnBvc2l0aW9uLnkgPD0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnlWZWxvY2l0eSA9IC0xO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRoaXMudHJhbnNmb3JtLnBvc2l0aW9uLnkgPj0gdGhpcy5nYW1lQ2FudmFzLmhlaWdodCAtIHRoaXMudHJhbnNmb3JtLmhlaWdodCkge1xyXG4gICAgICAgICAgICB0aGlzLnlWZWxvY2l0eSA9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBtb3ZlKCk6IHZvaWQge1xyXG4gICAgICAgIGlmKHRoaXMuYmFsbFRyYW5zZm9ybS5wb3NpdGlvbi54IDwgdGhpcy5xdWFydGVyRmllbGRYKSB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMudHJhbnNmb3JtLnBvc2l0aW9uLnkgPiB0aGlzLm1pZEZpZWxkWSArIDUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMueVZlbG9jaXR5ID0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKHRoaXMudHJhbnNmb3JtLnBvc2l0aW9uLnkgPCB0aGlzLm1pZEZpZWxkWSAtIDUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMueVZlbG9jaXR5ID0gLTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnlWZWxvY2l0eSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudGltZXIgKz0gVGltZS5EZWx0YVRpbWU7XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLnRpbWVyID4gMC4xNSkge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy50cmFuc2Zvcm0uY2VudGVyLnkgPCB0aGlzLmJhbGxUcmFuc2Zvcm0uY2VudGVyLnkgLSAxMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMueVZlbG9jaXR5ID0gLTE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLnRyYW5zZm9ybS5jZW50ZXIueSA+IHRoaXMuYmFsbFRyYW5zZm9ybS5jZW50ZXIueSArIDEwKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnlWZWxvY2l0eSA9IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnlWZWxvY2l0eSA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMudGltZXIgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnRyYW5zZm9ybS50cmFuc2xhdGUobmV3IFZlY3RvcjIodGhpcy54VmVsb2NpdHksIHRoaXMueVZlbG9jaXR5KS5tdWx0aXBseVNjYWxhcih0aGlzLnNwZWVkKSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi4vLi4vR2FtZUVuZ2luZS9Db21wb25lbnRzL0NvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi4vR2FtZU9iamVjdHMvUGxheWVyXCI7XHJcbmltcG9ydCB7IFJlY3RhbmdsZVJlbmRlcmVyIH0gZnJvbSBcIi4uLy4uL0dhbWVFbmdpbmUvQ29tcG9uZW50cy9SZWN0YW5nbGVSZW5kZXJlclwiO1xyXG5pbXBvcnQgeyBHYW1lT2JqZWN0IH0gZnJvbSBcIi4uLy4uL0dhbWVFbmdpbmUvQ29yZS9HYW1lT2JqZWN0XCI7XHJcbmltcG9ydCB7IEdhbWVFbmdpbmUgfSBmcm9tIFwiLi4vLi4vR2FtZUVuZ2luZS9Db3JlL0dhbWVFbmdpbmVcIjtcclxuaW1wb3J0IHsgQmFsbCB9IGZyb20gXCIuLi9HYW1lT2JqZWN0cy9CYWxsXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgR2FtZU1hbmFnZXIgZXh0ZW5kcyBDb21wb25lbnQge1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBHYW1lTWFuYWdlcjtcclxuXHJcbiAgICBwcml2YXRlIHBsYXllcjogUGxheWVyO1xyXG4gICAgcHJpdmF0ZSBwbGF5ZXJSZW5kZXJlcjogUmVjdGFuZ2xlUmVuZGVyZXI7XHJcblxyXG5cclxuICAgIHByaXZhdGUgY29uc3RydWN0b3IoZ2FtZU9iamVjdDogR2FtZU9iamVjdCkge1xyXG4gICAgICAgIHN1cGVyKGdhbWVPYmplY3QpO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByaW50LWJ1dHRvblwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5wcmludEdhbWVEYXRhKCkpO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGF1c2UtYnV0dG9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnRvZ2dsZVBhdXNlKCkpO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWRkLWJhbGxcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMudGVzdEluc3RhbnRpYXRlKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGFydCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnBsYXllciA9IEdhbWVFbmdpbmUuSW5zdGFuY2UuZ2V0R2FtZU9iamVjdEJ5SWQoXCJwbGF5ZXJcIik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgSW5zdGFuY2UoKTogR2FtZU1hbmFnZXIge1xyXG4gICAgICAgIGlmKHRoaXMuaW5zdGFuY2UgPT09IG51bGwgfHwgdGhpcy5pbnN0YW5jZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWVNYW5hZ2VyIGhhcyBub3QgYmVlbiBjcmVhdGVkIHlldC4gVXNlIHRoZSBjcmVhdGVJbnN0YW5jZSBtZXRob2QgZmlyc3QuXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVJbnN0YW5jZShnYW1lT2JqZWN0OiBHYW1lT2JqZWN0KTogR2FtZU1hbmFnZXIge1xyXG4gICAgICAgIGlmKHRoaXMuaW5zdGFuY2UgPT09IG51bGwgfHwgdGhpcy5pbnN0YW5jZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2UgPSBuZXcgR2FtZU1hbmFnZXIoZ2FtZU9iamVjdCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNb3JlIHRoYW4gb25lIEdhbWVNYW5hZ2VyIGNhbm5vdCBiZSBjcmVhdGVkIVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRvZ2dsZVBhdXNlKCk6IHZvaWQge1xyXG4gICAgICAgIEdhbWVFbmdpbmUuSW5zdGFuY2UudG9nZ2xlUGF1c2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHByaW50R2FtZURhdGEoKTogdm9pZCB7XHJcbiAgICAgICAgR2FtZUVuZ2luZS5JbnN0YW5jZS5wcmludEdhbWVEYXRhKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB0ZXN0SW5zdGFudGlhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgR2FtZUVuZ2luZS5JbnN0YW5jZS5pbnN0YW50aWF0ZShuZXcgQmFsbChcImJhbGwyXCIpKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuLi8uLi9HYW1lRW5naW5lL0NvbXBvbmVudHMvQ29tcG9uZW50XCI7XHJcbmltcG9ydCB7IFRyYW5zZm9ybSB9IGZyb20gXCIuLi8uLi9HYW1lRW5naW5lL0NvbXBvbmVudHMvVHJhbnNmb3JtXCI7XHJcbmltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi4vLi4vR2FtZUVuZ2luZS9Db3JlL0dhbWVPYmplY3RcIjtcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBNb3RvciBleHRlbmRzIENvbXBvbmVudCB7XHJcblxyXG4gICAgcHJvdGVjdGVkIHRyYW5zZm9ybTogVHJhbnNmb3JtO1xyXG4gICAgcHJvdGVjdGVkIGdhbWVDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgcHJvdGVjdGVkIHhWZWxvY2l0eTogbnVtYmVyID0gMDtcclxuICAgIHByb3RlY3RlZCB5VmVsb2NpdHk6IG51bWJlciA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgc3BlZWQ6IG51bWJlciA9IDVcclxuXHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGdhbWVPYmplY3Q6IEdhbWVPYmplY3QpIHtcclxuICAgICAgICBzdXBlcihnYW1lT2JqZWN0KTtcclxuICAgICAgICB0aGlzLnRyYW5zZm9ybSA9IGdhbWVPYmplY3QuZ2V0VHJhbnNmb3JtKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXJ0KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcyA9IHRoaXMuZ2FtZU9iamVjdC5nZXRHYW1lQ2FudmFzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLm1vdmUoKTtcclxuICAgICAgICB0aGlzLmhhbmRsZU91dE9mQm91bmRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IG1vdmUoKTogdm9pZDtcclxuXHJcbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3QgaGFuZGxlT3V0T2ZCb3VuZHMoKTogdm9pZDtcclxufSIsImltcG9ydCB7IE1vdG9yIH0gZnJvbSBcIi4vTW90b3JcIjtcclxuaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuLi8uLi9HYW1lRW5naW5lL0NvcmUvR2FtZU9iamVjdFwiO1xyXG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4uLy4uL0dhbWVFbmdpbmUvQ29yZS9WZWN0b3IyXCI7XHJcbmltcG9ydCB7IEtleXMgfSBmcm9tIFwiLi4vLi4vR2FtZUVuZ2luZS9Db3JlL0hlbHBlcnMvS2V5c1wiO1xyXG5pbXBvcnQgeyBSaWdpZGJvZHkgfSBmcm9tIFwiLi4vLi4vR2FtZUVuZ2luZS9Db21wb25lbnRzL1JpZ2lkYm9keVwiO1xyXG5pbXBvcnQgTW92aW5nUmlnaHRTcHJpdGUgZnJvbSBcIi4uLy4uL2Fzc2V0cy9tYXJpby5wbmdcIlxyXG5pbXBvcnQgTW92aW5nTGVmdFNwcml0ZSBmcm9tIFwiLi4vLi4vYXNzZXRzL21hcmlvTGVmdC5wbmdcIlxyXG5pbXBvcnQgeyBBbmltYXRvciB9IGZyb20gXCIuLi8uLi9HYW1lRW5naW5lL0NvbXBvbmVudHMvQW5pbWF0b3JcIjtcclxuaW1wb3J0IHsgQW5pbWF0aW9uIH0gZnJvbSBcIi4uLy4uL0dhbWVFbmdpbmUvQ29yZS9BbmltYXRpb25cIjtcclxuaW1wb3J0IHsgUGh5c2ljcyB9IGZyb20gXCIuLi8uLi9HYW1lRW5naW5lL0NvcmUvUGh5c2ljc1wiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBQbGF5ZXJNb3RvciBleHRlbmRzIE1vdG9yIHtcclxuXHJcbiAgICBwcml2YXRlIG1vdmluZ1JpZ2h0OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIG1vdmluZ0xlZnQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgbW92ZVJpZ2h0QW5pbWF0aW9uOiBBbmltYXRpb247XHJcbiAgICBwcml2YXRlIG1vdmVMZWZ0QW5pbWF0aW9uOiBBbmltYXRpb247XHJcbiAgICBwcml2YXRlIGp1bXBpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgcmlnaWRCb2R5OiBSaWdpZGJvZHk7XHJcbiAgICBwcml2YXRlIGFuaW1hdG9yOiBBbmltYXRvcjtcclxuXHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGdhbWVPYmplY3Q6IEdhbWVPYmplY3QpIHtcclxuICAgICAgICBzdXBlcihnYW1lT2JqZWN0KTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsICgpID0+IHRoaXMub25LZXlEb3duKDxLZXlib2FyZEV2ZW50PmV2ZW50KSk7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoKSA9PiB0aGlzLm9uS2V5VXAoPEtleWJvYXJkRXZlbnQ+ZXZlbnQpKTtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMub25DbGljayg8TW91c2VFdmVudD5ldmVudCkpO1xyXG4gICAgICAgIHRoaXMubW92ZVJpZ2h0QW5pbWF0aW9uID0gbmV3IEFuaW1hdGlvbihNb3ZpbmdSaWdodFNwcml0ZSwgNCwgMSwgMC4xKTtcclxuICAgICAgICB0aGlzLm1vdmVMZWZ0QW5pbWF0aW9uID0gbmV3IEFuaW1hdGlvbihNb3ZpbmdMZWZ0U3ByaXRlLCA0LCAxLCAwLjEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGFydCgpOiB2b2lkIHtcclxuICAgICAgICBzdXBlci5zdGFydCgpO1xyXG5cclxuICAgICAgICB0aGlzLnJpZ2lkQm9keSA9IHRoaXMuZ2FtZU9iamVjdC5nZXRDb21wb25lbnQ8UmlnaWRib2R5PihSaWdpZGJvZHkpO1xyXG4gICAgICAgIHRoaXMuYW5pbWF0b3IgPSB0aGlzLmdhbWVPYmplY3QuZ2V0Q29tcG9uZW50PEFuaW1hdG9yPihBbmltYXRvcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBpc01vdmluZygpOiBib29sZWFuIHsgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMueFZlbG9jaXR5ICE9PSAwIHx8IHRoaXMueVZlbG9jaXR5ICE9PSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBoYW5kbGVPdXRPZkJvdW5kcygpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy50cmFuc2Zvcm0ucG9zaXRpb24ueSA8PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtLnBvc2l0aW9uLnkgPSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLnRyYW5zZm9ybS5wb3NpdGlvbi55ICsgdGhpcy50cmFuc2Zvcm0uaGVpZ2h0ID49IHRoaXMuZ2FtZUNhbnZhcy5oZWlnaHQgLSA1NSkge1xyXG4gICAgICAgICAgICB0aGlzLnJpZ2lkQm9keS5pc0tpbm9tYXRpYyA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuanVtcGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybS5wb3NpdGlvbi55ID0gKHRoaXMuZ2FtZUNhbnZhcy5oZWlnaHQgLSB0aGlzLnRyYW5zZm9ybS5oZWlnaHQpIC0gNTY7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy50cmFuc2Zvcm0ucG9zaXRpb24ueCA8PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtLnBvc2l0aW9uLnggPSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLnRyYW5zZm9ybS5wb3NpdGlvbi54ICsgdGhpcy50cmFuc2Zvcm0ud2lkdGggPj0gdGhpcy5nYW1lQ2FudmFzLndpZHRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtLnBvc2l0aW9uLnggPSAodGhpcy5nYW1lQ2FudmFzLndpZHRoIC0gdGhpcy50cmFuc2Zvcm0ud2lkdGgpIC0gMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG1vdmUoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMubW92aW5nUmlnaHQpIHtcclxuICAgICAgICAgICAgdGhpcy54VmVsb2NpdHkgPSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLm1vdmluZ0xlZnQpIHtcclxuICAgICAgICAgICAgdGhpcy54VmVsb2NpdHkgPSAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueFZlbG9jaXR5ID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMuaXNNb3ZpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm0udHJhbnNsYXRlKG5ldyBWZWN0b3IyKHRoaXMueFZlbG9jaXR5LCB0aGlzLnlWZWxvY2l0eSkubXVsdGlwbHlTY2FsYXIodGhpcy5zcGVlZCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGp1bXAoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuanVtcGluZykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmp1bXBpbmcgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucmlnaWRCb2R5LmlzS2lub21hdGljID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5yaWdpZEJvZHkucmVzZXRGb3JjZSgpXHJcbiAgICAgICAgdGhpcy5yaWdpZEJvZHkuYWRkRm9yY2UoVmVjdG9yMi51cC5tdWx0aXBseVNjYWxhcig0MDApKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBsZXQgaGl0ID0gUGh5c2ljcy5yYXljYXN0KG5ldyBWZWN0b3IyKHRoaXMudHJhbnNmb3JtLnBvc2l0aW9uLngsIHRoaXMudHJhbnNmb3JtLnBvc2l0aW9uLnkgLSAxKSwgVmVjdG9yMi5yaWdodCwgNTAwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbktleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PSBLZXlzLlJJR0hUIHx8IGV2ZW50LmtleUNvZGUgPT0gS2V5cy5EKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW92aW5nUmlnaHQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmluZ0xlZnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRvci5zZXRBbmltYXRpb24odGhpcy5tb3ZlUmlnaHRBbmltYXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChldmVudC5rZXlDb2RlID09IEtleXMuTEVGVCB8fCBldmVudC5rZXlDb2RlID09IEtleXMuQSkge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmluZ1JpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMubW92aW5nTGVmdCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0b3Iuc2V0QW5pbWF0aW9uKHRoaXMubW92ZUxlZnRBbmltYXRpb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT0gS2V5cy5TUEFDRSkge1xyXG4gICAgICAgICAgICB0aGlzLmp1bXAoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbktleVVwKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT0gS2V5cy5SSUdIVCB8fCBldmVudC5rZXlDb2RlID09IEtleXMuRCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmluZ1JpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGV2ZW50LmtleUNvZGUgPT0gS2V5cy5MRUZUIHx8IGV2ZW50LmtleUNvZGUgPT0gS2V5cy5BKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW92aW5nTGVmdCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi4vLi4vR2FtZUVuZ2luZS9Db3JlL0dhbWVPYmplY3RcIjtcclxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4uLy4uL0dhbWVFbmdpbmUvQ29tcG9uZW50cy9Db21wb25lbnRcIjtcclxuaW1wb3J0IHsgUmVjdGFuZ2xlQ29sbGlkZXIgfSBmcm9tIFwiLi4vLi4vR2FtZUVuZ2luZS9Db21wb25lbnRzL1JlY3RhbmdsZUNvbGxpZGVyXCI7XHJcbmltcG9ydCB7IEJhbGxNb3RvciB9IGZyb20gXCIuLi9Db21wb25lbnRzL0JhbGxNb3RvclwiO1xyXG5pbXBvcnQgeyBSZWN0YW5nbGVSZW5kZXJlciB9IGZyb20gXCIuLi8uLi9HYW1lRW5naW5lL0NvbXBvbmVudHMvUmVjdGFuZ2xlUmVuZGVyZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBCYWxsIGV4dGVuZHMgR2FtZU9iamVjdCB7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihpZCwgMzQ1LCAxOTUsIDEwLCAxMCk7XHJcblxyXG4gICAgICAgIGxldCBiYWxsQ29tcG9uZW50czogQ29tcG9uZW50W10gPSBbXTtcclxuICAgICAgICBcclxuICAgICAgICBiYWxsQ29tcG9uZW50cy5wdXNoKG5ldyBSZWN0YW5nbGVDb2xsaWRlcih0aGlzKSk7XHJcbiAgICAgICAgYmFsbENvbXBvbmVudHMucHVzaChuZXcgQmFsbE1vdG9yKHRoaXMpKTtcclxuICAgICAgICBiYWxsQ29tcG9uZW50cy5wdXNoKG5ldyBSZWN0YW5nbGVSZW5kZXJlcih0aGlzLCBcIndoaXRlXCIpKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRDb21wb25lbnRzKGJhbGxDb21wb25lbnRzKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi4vLi4vR2FtZUVuZ2luZS9Db3JlL0dhbWVPYmplY3RcIjtcclxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4uLy4uL0dhbWVFbmdpbmUvQ29tcG9uZW50cy9Db21wb25lbnRcIjtcclxuaW1wb3J0IHsgUmVjdGFuZ2xlQ29sbGlkZXIgfSBmcm9tIFwiLi4vLi4vR2FtZUVuZ2luZS9Db21wb25lbnRzL1JlY3RhbmdsZUNvbGxpZGVyXCI7XHJcbmltcG9ydCB7IENvbXB1dGVyTW90b3IgfSBmcm9tIFwiLi4vQ29tcG9uZW50cy9Db21wdXRlck1vdG9yXCI7XHJcbmltcG9ydCB7IFJlY3RhbmdsZVJlbmRlcmVyIH0gZnJvbSBcIi4uLy4uL0dhbWVFbmdpbmUvQ29tcG9uZW50cy9SZWN0YW5nbGVSZW5kZXJlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbXB1dGVyIGV4dGVuZHMgR2FtZU9iamVjdCB7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihpZCwgNjg4LCAxNzUsIDEwLCA1MCk7XHJcblxyXG4gICAgICAgIGxldCBjb21wdXRlckNvbXBvbmVudHM6IENvbXBvbmVudFtdID0gW107XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29tcHV0ZXJDb21wb25lbnRzLnB1c2gobmV3IFJlY3RhbmdsZUNvbGxpZGVyKHRoaXMpKTtcclxuICAgICAgICBjb21wdXRlckNvbXBvbmVudHMucHVzaChuZXcgQ29tcHV0ZXJNb3Rvcih0aGlzKSk7XHJcbiAgICAgICAgY29tcHV0ZXJDb21wb25lbnRzLnB1c2gobmV3IFJlY3RhbmdsZVJlbmRlcmVyKHRoaXMsIFwid2hpdGVcIikpO1xyXG5cclxuICAgICAgICB0aGlzLnNldENvbXBvbmVudHMoY29tcHV0ZXJDb21wb25lbnRzKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuLi8uLi9HYW1lRW5naW5lL0NvbXBvbmVudHMvQ29tcG9uZW50XCI7XHJcbmltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi4vLi4vR2FtZUVuZ2luZS9Db3JlL0dhbWVPYmplY3RcIjtcclxuaW1wb3J0IHsgR2FtZU1hbmFnZXIgfSBmcm9tIFwiLi4vQ29tcG9uZW50cy9HYW1lTWFuYWdlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWVNYW5hZ2VyT2JqZWN0IGV4dGVuZHMgR2FtZU9iamVjdCB7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihpZCwgMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgICAgIGxldCBnYW1lTWFuYWdlckNvbXBvbmVudHM6IENvbXBvbmVudFtdID0gW107XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGdhbWVNYW5hZ2VyID0gR2FtZU1hbmFnZXIuY3JlYXRlSW5zdGFuY2UodGhpcyk7XHJcbiAgICAgICAgZ2FtZU1hbmFnZXJDb21wb25lbnRzLnB1c2goZ2FtZU1hbmFnZXIpO1xyXG5cclxuICAgICAgICB0aGlzLnNldENvbXBvbmVudHMoZ2FtZU1hbmFnZXJDb21wb25lbnRzKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi4vLi4vR2FtZUVuZ2luZS9Db3JlL0dhbWVPYmplY3RcIjtcclxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4uLy4uL0dhbWVFbmdpbmUvQ29tcG9uZW50cy9Db21wb25lbnRcIjtcclxuaW1wb3J0IHsgUmVjdGFuZ2xlQ29sbGlkZXIgfSBmcm9tIFwiLi4vLi4vR2FtZUVuZ2luZS9Db21wb25lbnRzL1JlY3RhbmdsZUNvbGxpZGVyXCI7XHJcbmltcG9ydCB7IFBsYXllck1vdG9yIH0gZnJvbSBcIi4uL0NvbXBvbmVudHMvUGxheWVyTW90b3JcIjtcclxuaW1wb3J0IHsgUmlnaWRib2R5IH0gZnJvbSBcIi4uLy4uL0dhbWVFbmdpbmUvQ29tcG9uZW50cy9SaWdpZGJvZHlcIjtcclxuaW1wb3J0IHsgQW5pbWF0b3IgfSBmcm9tIFwiLi4vLi4vR2FtZUVuZ2luZS9Db21wb25lbnRzL0FuaW1hdG9yXCI7XHJcbmltcG9ydCBNYXJpb1Nwcml0ZSBmcm9tIFwiLi4vLi4vYXNzZXRzL21hcmlvLnBuZ1wiO1xyXG5pbXBvcnQgeyBBbmltYXRpb24gfSBmcm9tIFwiLi4vLi4vR2FtZUVuZ2luZS9Db3JlL0FuaW1hdGlvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBsYXllciBleHRlbmRzIEdhbWVPYmplY3Qge1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIoaWQsIDIsIDE3NSwgMTAsIDUwKTtcclxuXHJcbiAgICAgICAgbGV0IHBsYXllckNvbXBvbmVudHM6IENvbXBvbmVudFtdID0gW107XHJcbiAgICAgICAgXHJcbiAgICAgICAgcGxheWVyQ29tcG9uZW50cy5wdXNoKG5ldyBSZWN0YW5nbGVDb2xsaWRlcih0aGlzKSk7XHJcbiAgICAgICAgcGxheWVyQ29tcG9uZW50cy5wdXNoKG5ldyBQbGF5ZXJNb3Rvcih0aGlzKSk7XHJcbiAgICAgICAgcGxheWVyQ29tcG9uZW50cy5wdXNoKG5ldyBSaWdpZGJvZHkodGhpcykpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBpbml0aWFsQW5pbWF0aW9uID0gbmV3IEFuaW1hdGlvbihNYXJpb1Nwcml0ZSwgNCwgMSwgMC4xKTtcclxuXHJcbiAgICAgICAgcGxheWVyQ29tcG9uZW50cy5wdXNoKG5ldyBBbmltYXRvcih0aGlzLCBpbml0aWFsQW5pbWF0aW9uKSk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLnNldENvbXBvbmVudHMocGxheWVyQ29tcG9uZW50cyk7XHJcbiAgICB9XHJcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCIyN2YwZDI5OTk5NTNlNWE4YzQzMGQ3YWU0YzEzMmExMS5wbmdcIjsiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCIyNDlmYWFjODY3NGEzMWZhOTIyYWY2MDg5ODYzYmZmYS5wbmdcIjsiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCIwMTIxNTQxNjk0OTM2OTM0Yzk3OWFlMGNmMGM2NmEzNC5wbmdcIjsiLCJpbXBvcnQgeyBHYW1lRW5naW5lIH0gZnJvbSBcIi4vR2FtZUVuZ2luZS9Db3JlL0dhbWVFbmdpbmVcIjtcclxuaW1wb3J0IHsgSW1hZ2VCYWNrZ3JvdW5kIH0gZnJvbSBcIi4vR2FtZUVuZ2luZS9Db3JlL0ltYWdlQmFja2dyb3VuZFwiO1xyXG5pbXBvcnQgeyBHYW1lTWFuYWdlck9iamVjdCB9IGZyb20gXCIuL01hcmlvL0dhbWVPYmplY3RzL0dhbWVNYW5hZ2VyT2JqZWN0XCI7XHJcbmltcG9ydCB7IFBsYXllciB9IGZyb20gXCIuL01hcmlvL0dhbWVPYmplY3RzL1BsYXllclwiO1xyXG5pbXBvcnQgeyBCYWxsIH0gZnJvbSBcIi4vTWFyaW8vR2FtZU9iamVjdHMvQmFsbFwiO1xyXG5pbXBvcnQgeyBDb21wdXRlciB9IGZyb20gXCIuL01hcmlvL0dhbWVPYmplY3RzL0NvbXB1dGVyXCI7XHJcbmltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi9HYW1lRW5naW5lL0NvcmUvR2FtZU9iamVjdFwiO1xyXG5pbXBvcnQgQmFja2dyb3VuZCBmcm9tIFwiLi9hc3NldHMvYmFja2dyb3VuZC5wbmdcIjtcclxuXHJcblxyXG5sZXQgZ2FtZUVuZ2luZTogR2FtZUVuZ2luZSA9IEdhbWVFbmdpbmUuSW5zdGFuY2U7XHJcblxyXG5sZXQgZ2FtZUNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lLWNhbnZhc1wiKTtcclxuXHJcbmxldCBiYWNrZ3JvdW5kOiBJbWFnZUJhY2tncm91bmQgPSBuZXcgSW1hZ2VCYWNrZ3JvdW5kKGdhbWVDYW52YXMsIEJhY2tncm91bmQpO1xyXG5cclxubGV0IGdhbWVNYW5hZ2VyOiBHYW1lTWFuYWdlck9iamVjdCA9IG5ldyBHYW1lTWFuYWdlck9iamVjdChcIkdhbWVNYW5hZ2VyXCIpO1xyXG5cclxubGV0IHBsYXllcjogUGxheWVyID0gbmV3IFBsYXllcihcInBsYXllclwiKTtcclxubGV0IGJhbGw6IEJhbGwgPSBuZXcgQmFsbChcImJhbGxcIik7XHJcbmxldCBjb21wdXRlcjogQ29tcHV0ZXIgPSBuZXcgQ29tcHV0ZXIoXCJjb21wdXRlclwiKTtcclxuXHJcbmxldCBnYW1lT2JqZWN0czogR2FtZU9iamVjdFtdID0gW2dhbWVNYW5hZ2VyLCBwbGF5ZXIsIGNvbXB1dGVyLCBiYWxsXTtcclxuXHJcbmdhbWVFbmdpbmUuaW5pdGlhbGl6ZUdhbWUoZ2FtZUNhbnZhcywgZ2FtZU9iamVjdHMsIGJhY2tncm91bmQpO1xyXG5cclxuZ2FtZUVuZ2luZS5zdGFydEdhbWUoKTsiXSwic291cmNlUm9vdCI6IiJ9