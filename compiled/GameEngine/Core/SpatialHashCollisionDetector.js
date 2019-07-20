import { LiteEvent } from "./LiteEvent";
export class SpatialHashCollisionDetector {
    constructor(gameMapWidth, gameMapHeight, cellSize = 100) {
        this._onCollisionDetected = new LiteEvent();
        this.colliderSpacialMapKeys = new Map();
        this.spatialMap = new Map();
        this._colliders = [];
        this.cellSize = cellSize;
        this.gameMapWidth = gameMapWidth;
        this.gameMapHeight = gameMapHeight;
        this.buildSpatialMapCells();
    }
    get colliders() {
        return this._colliders;
    }
    get onCollisionDetected() {
        return this._onCollisionDetected.expose();
    }
    detectCollisions() {
        for (let collider of this._colliders) {
            if (!collider.enabled) {
                continue;
            }
            for (let other of this.getPossibleCollisions(collider)) {
                if (collider.detectCollision(other)) {
                    this._onCollisionDetected.trigger(collider, other);
                }
            }
        }
    }
    addCollider(collider) {
        collider.transform.onMoved.add(() => this.updateColliderSpatialMapping(collider));
        this._colliders.push(collider);
        this.addColliderToSpatialMap(collider);
    }
    addColliders(colliders) {
        colliders.forEach(c => this.addCollider(c));
    }
    getMapKey(positionOrX, y) {
        if (typeof positionOrX === 'number') {
            return Math.floor(positionOrX / this.cellSize) * this.cellSize + ',' + Math.floor(y / this.cellSize) * this.cellSize;
        }
        return Math.floor(positionOrX.x / this.cellSize) * this.cellSize + ',' + Math.floor(positionOrX.y / this.cellSize) * this.cellSize;
    }
    buildSpatialMapCells() {
        this.spatialMap.clear();
        for (let x = 0; x < this.gameMapWidth; x += this.cellSize) {
            for (let y = 0; y < this.gameMapHeight; y += this.cellSize) {
                this.spatialMap.set(this.getMapKey(x, y), new Set());
            }
        }
    }
    updateColliderSpatialMapping(collider) {
        for (let key of this.colliderSpacialMapKeys.get(collider)) {
            this.spatialMap.get(key).delete(collider);
        }
        this.addColliderToSpatialMap(collider);
    }
    addColliderToSpatialMap(collider) {
        let tlKey = this.getMapKey(collider.topLeft);
        let trKey = this.getMapKey(collider.topRight);
        let blKey = this.getMapKey(collider.bottomLeft);
        let brKey = this.getMapKey(collider.bottomRight);
        if (!this.colliderSpacialMapKeys.has(collider)) {
            this.colliderSpacialMapKeys.set(collider, new Set());
        }
        let previousKeys = this.colliderSpacialMapKeys.get(collider);
        previousKeys.clear();
        if (tlKey === brKey) {
            if (this.spatialMap.has(tlKey)) {
                this.spatialMap.get(tlKey).add(collider);
            }
            else {
                this.spatialMap.set(tlKey, new Set([collider]));
            }
            previousKeys.add(tlKey);
            return;
        }
        let tlx = Number(tlKey.split(',')[0]);
        let tly = Number(tlKey.split(',')[1]);
        let xDiff = Number(trKey.split(',')[0]) - tlx;
        let yDiff = Number(blKey.split(',')[1]) - tly;
        for (let x = tlx; x <= xDiff + tlx; x += this.cellSize) {
            for (let y = tly; y <= yDiff + tly; y += this.cellSize) {
                let key = this.getMapKey(x, y);
                if (this.spatialMap.has(key)) {
                    this.spatialMap.get(key).add(collider);
                }
                else {
                    this.spatialMap.set(key, new Set([collider]));
                }
                previousKeys.add(key);
            }
        }
    }
    getPossibleCollisions(collider) {
        let possibleCollisions = new Set();
        for (let key of this.colliderSpacialMapKeys.get(collider)) {
            for (let other of this.spatialMap.get(key)) {
                if (other !== collider) {
                    possibleCollisions.add(other);
                }
            }
        }
        return possibleCollisions;
    }
}
//# sourceMappingURL=SpatialHashCollisionDetector.js.map