import { Rigidbody } from "../Components/Rigidbody";
import { RectangleCollider } from "../Components/RectangleCollider";
import { Vector2 } from "./Vector2";
import { Geometry } from "./Geometry";

export class Physics {

    private static _instance: Physics;

    public gravity: number;

    private rigidbodies: Rigidbody[];
    private colliders: RectangleCollider[];
    private spatialMap: Map<string, Set<RectangleCollider>> = new Map<string, Set<RectangleCollider>>();
    private cellSize: number;


    private constructor() {
        this.rigidbodies = [];
        this.colliders = [];
        this.gravity = 665;
        this.cellSize = 100;
    }

    public static get instance(): Physics {
        return this._instance || (this._instance = new Physics());
    }

    public updatePhysics(): void {
        for (let collider of this.colliders) {
            if (!collider.enabled) {
                continue;
            }

            for (let other of this.getPossibleCollisions(collider)) {
                if (collider === other) {
                    continue;
                }

                if (collider.detectCollision(other)) {
                    console.log(collider.gameObject.id + ' has collided with ' + other.gameObject.id);
                }
            }

            // for (let otherCollider of this.colliders) {
            //     if (!(collider === otherCollider)) {
            //         collider.detectCollision(otherCollider);
            //     }
            // }
        }
    }

    public buildSpatialMapCells(cellSize: number, gameMapWidth: number, gameMapHeight: number): void {
        this.spatialMap.clear();
        this.cellSize = cellSize;

        for (let i = 0; i < gameMapWidth; i += cellSize) {
            for (let j = 0; j < gameMapHeight; j += cellSize) {
                this.spatialMap.set(this.getMapKey(new Vector2(i, j)), new Set());
            }
        }

        for (let collider of this.colliders) {
            this.addColliderToSpatialMap(collider);
        }
    }

    private getMapKey(position: Vector2): string {
        return Math.floor(position.x / this.cellSize) * this.cellSize + ',' + Math.floor(position.y / this.cellSize) * this.cellSize;
    }

    public addRigidbody(rb: Rigidbody): void {
        this.rigidbodies.push(rb);
    }

    public addCollider(collider: RectangleCollider): void {
        this.colliders.push(collider);
        
        this.addColliderToSpatialMap(collider);
    }

    public updateColliderSpatialMapping(collider: RectangleCollider, previousKeys: string[]): void {
        for (let key of previousKeys) {
            let cellSet = this.spatialMap.get(key);
            cellSet.delete(collider);
        }

        this.addColliderToSpatialMap(collider);
    }

    private addColliderToSpatialMap(collider: RectangleCollider): void {
        let tlKey = this.getMapKey(collider.topLeft);
        let trKey = this.getMapKey(collider.topRight);
        let blKey = this.getMapKey(collider.bottomLeft);
        let brKey = this.getMapKey(collider.bottomRight);

        let newKeys = [tlKey];

        if (this.spatialMap.has(tlKey)) {
            this.spatialMap.get(tlKey).add(collider);
        }
        else {
            this.spatialMap.set(tlKey, new Set([collider]));
        }

        // If all 4 points are in the same cell, return.
        if (tlKey === brKey) {
            collider.setSpacialMapKeys(newKeys)
            return;
        }

        newKeys.push(brKey);

        if (this.spatialMap.has(brKey)) {
            this.spatialMap.get(brKey).add(collider);
        }
        else {
            this.spatialMap.set(brKey, new Set([collider]));
        }

        if (tlKey !== blKey) {
            newKeys.push(blKey);

            if (this.spatialMap.has(blKey)) {
                this.spatialMap.get(blKey).add(collider);
            }
            else {
                this.spatialMap.set(blKey, new Set([collider]));
            }
        }

        if (tlKey !== trKey) {
            newKeys.push(trKey);

            if (this.spatialMap.has(trKey)) {
                this.spatialMap.get(trKey).add(collider);
            }
            else {
                this.spatialMap.set(trKey, new Set([collider]));
            }
        }

        collider.setSpacialMapKeys(newKeys);
    }

    private getPossibleCollisions(collider: RectangleCollider): Set<RectangleCollider> {
        let possibleCollisions: Set<RectangleCollider> = new Set<RectangleCollider>();

        for (let key of collider.mappingKeys) {
           for (let other of this.spatialMap.get(key)) {
               if (other !== collider) {
                   possibleCollisions.add(other);
               }
           }
        }

        return possibleCollisions;
    }

    public static raycast(origin: Vector2, direction: Vector2, distance: number): RectangleCollider | null {
        let result: RectangleCollider = null;
        let hitColliders = Physics.raycastAll(origin, direction, distance);
        let closestColliderDistance = -10;

        for (let collider of hitColliders) {
            let colliderDistance = Vector2.distance(origin, collider.transform.position);

            if (colliderDistance > closestColliderDistance) {
                result = collider;
                closestColliderDistance = colliderDistance;
            }
        }
        
        return result;
    }

    public static raycastAll(origin: Vector2, direction: Vector2, distance: number): RectangleCollider[] {
        let results: RectangleCollider[] = [];
        let terminalPoint = Vector2.add(origin, direction.multiplyScalar(distance));

        for (let collider of Physics.instance.colliders) {
            if (Geometry.doIntersectRectangle(origin, terminalPoint, collider.topLeft, collider.topRight, collider.bottomLeft, collider.bottomRight)) {
                results.push(collider);
            }
        }

        return results;
    }

    public static sphereCast() {}

    public static overlapSphere(): RectangleCollider[] { 
        return [];
    }
}