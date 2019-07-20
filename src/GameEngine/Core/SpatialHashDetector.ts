import { ICollisionDetector } from "./Interfaces/ICollisionDetector";
import { RectangleCollider } from "../Components/RectangleCollider";
import { ILiteEvent } from "./Interfaces/ILiteEvent";
import { LiteEvent } from "./Helpers/LiteEvent";
import { Vector2 } from "./Vector2";

export class SpatialHashDetector implements ICollisionDetector {
    
    private readonly _colliders: RectangleCollider[];
    private readonly onCollided: LiteEvent<RectangleCollider> = new LiteEvent<RectangleCollider>();
    private readonly colliderSpacialMapKeys: Map<RectangleCollider, Set<string>> = new Map<RectangleCollider, Set<string>>();
    private readonly spatialMap: Map<string, Set<RectangleCollider>> = new Map<string, Set<RectangleCollider>>();
    private readonly cellSize: number;
    private readonly gameMapWidth: number;
    private readonly gameMapHeight: number;


    public constructor(gameMapWidth: number, gameMapHeight: number, cellSize: number = 100) {
        this._colliders = [];
        this.cellSize = cellSize;
        this.gameMapWidth = gameMapWidth;
        this.gameMapHeight = gameMapHeight;

        this.buildSpatialMapCells();
    }

    public detectCollisions(): void {
        for (let collider of this._colliders) {
            if (!collider.enabled) {
                continue;
            }

            for (let other of this.getPossibleCollisions(collider)) {
                if (collider.detectCollision(other)) {
                    this.onCollided.trigger(collider, other);
                }
            }
        }
    }

    public get colliders(): RectangleCollider[] {
        return this._colliders;
    }

    public onCollisionDetected(): ILiteEvent<RectangleCollider> {
        return this.onCollided.expose();
    }

    public addCollider(collider: RectangleCollider): void {
        collider.transform.onMoved.add(() => this.updateColliderSpatialMapping(collider));
        this._colliders.push(collider);
        this.addColliderToSpatialMap(collider);
    }

    public addColliders(colliders: RectangleCollider[]): void {
        colliders.forEach(c => this.addCollider(c));
    }

    private getMapKey(position: Vector2): string;
    private getMapKey(x: number, y: number): string;

    private getMapKey(positionOrX: Vector2|number, y?: number): string {
        if (typeof positionOrX === 'number') {
            return Math.floor(positionOrX / this.cellSize) * this.cellSize + ',' + Math.floor(y / this.cellSize) * this.cellSize;
        }

        return Math.floor(positionOrX.x / this.cellSize) * this.cellSize + ',' + Math.floor(positionOrX.y / this.cellSize) * this.cellSize;
    }

    private buildSpatialMapCells(): void {
        this.spatialMap.clear();

        for (let x = 0; x < this.gameMapWidth; x += this.cellSize) {
            for (let y = 0; y < this.gameMapHeight; y += this.cellSize) {
                this.spatialMap.set(this.getMapKey(x, y), new Set());
            }
        }
    }

    private updateColliderSpatialMapping(collider: RectangleCollider): void {
        for (let key of this.colliderSpacialMapKeys.get(collider)) {
            this.spatialMap.get(key).delete(collider);
        }

        this.addColliderToSpatialMap(collider);
    }

    private addColliderToSpatialMap(collider: RectangleCollider): void {
        let tlKey = this.getMapKey(collider.topLeft);
        let trKey = this.getMapKey(collider.topRight);
        let blKey = this.getMapKey(collider.bottomLeft);
        let brKey = this.getMapKey(collider.bottomRight);

        if (!this.colliderSpacialMapKeys.has(collider)) {
            this.colliderSpacialMapKeys.set(collider, new Set<string>());
        }

        let previousKeys = this.colliderSpacialMapKeys.get(collider);

        // let movedCells = previousKeys.size === 0 ? true : false;

        // for (let key of previousKeys) {
        //     if (key !== tlKey && key !== trKey && key !== blKey && key !== brKey) {
        //         movedCells = true;
        //         break;
        //     }
        // }

        // if (!movedCells) {
        //     return;
        // }
        // console.log('moved cells');
        // for (let key of previousKeys) {
        //     this.spatialMap.get(key).delete(collider);
        // }

        previousKeys.clear();
        
        // If all 4 points are in the same cell.
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

    private getPossibleCollisions(collider: RectangleCollider): Set<RectangleCollider> {
        let possibleCollisions: Set<RectangleCollider> = new Set<RectangleCollider>();

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