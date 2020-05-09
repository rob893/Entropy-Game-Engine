import { CollisionDetector } from '../interfaces/CollisionDetector';
import { RectangleCollider } from '../../components/RectangleCollider';
import { CustomLiteEvent } from '../interfaces/CustomLiteEvent';
import { LiteEvent } from '../helpers/LiteEvent';
import { Vector2 } from '../helpers/Vector2';
import { Layer } from '../enums/Layer';
import { CollisionManifold } from '../helpers/CollisionManifold';

export class SpatialHashCollisionDetector implements CollisionDetector {
  private readonly _colliders: RectangleCollider[];
  private readonly _onCollisionDetected: LiteEvent<CollisionManifold> = new LiteEvent<CollisionManifold>();
  private readonly colliderSpacialMapKeys: Map<RectangleCollider, Set<string>> = new Map<
    RectangleCollider,
    Set<string>
  >();
  private readonly spatialMap: Map<string, Set<RectangleCollider>> = new Map<string, Set<RectangleCollider>>();
  private readonly collisionMap: Map<RectangleCollider, Set<RectangleCollider>> = new Map<
    RectangleCollider,
    Set<RectangleCollider>
  >();
  private readonly cellSize: number;
  private readonly gameMapWidth: number;
  private readonly gameMapHeight: number;
  private readonly layerCollisionMatrix: Map<Layer, Set<Layer>>;

  public constructor(
    gameMapWidth: number,
    gameMapHeight: number,
    layerCollisionMatrix: Map<Layer, Set<Layer>>,
    cellSize: number = 100
  ) {
    this._colliders = [];
    this.cellSize = cellSize;
    this.gameMapWidth = gameMapWidth;
    this.gameMapHeight = gameMapHeight;
    this.layerCollisionMatrix = layerCollisionMatrix;

    this.buildSpatialMapCells();
  }

  public get colliders(): RectangleCollider[] {
    return this._colliders;
  }

  public get onCollisionDetected(): CustomLiteEvent<CollisionManifold> {
    return this._onCollisionDetected.expose();
  }

  public detectCollisions(): void {
    this.collisionMap.clear();

    for (const collider of this._colliders) {
      if (!collider.enabled) {
        continue;
      }

      for (const other of this.getPossibleCollisions(collider)) {
        if (collider.detectCollision(other)) {
          const collisions = this.collisionMap.get(collider);
          if (collisions !== undefined) {
            collisions.add(other);
          } else {
            this.collisionMap.set(collider, new Set([other]));
          }

          const collisionManifold = this.buildCollisionManifold(collider, other);

          collider.triggerCollision(collisionManifold);
          other.triggerCollision(collisionManifold);

          this._onCollisionDetected.trigger(collisionManifold);
        }
      }
    }
  }

  public addCollider(collider: RectangleCollider): void {
    collider.transform.onMoved.add(() => this.updateColliderSpatialMapping(collider));
    collider.onResized.add(() => this.updateColliderSpatialMapping(collider));
    this._colliders.push(collider);
    this.updateColliderSpatialMapping(collider);
  }

  public addColliders(colliders: RectangleCollider[]): void {
    colliders.forEach(c => this.addCollider(c));
  }

  public removeCollider(collider: RectangleCollider): void {
    const index = this._colliders.indexOf(collider);

    if (index !== -1) {
      this._colliders.splice(index, 1);

      const keys = this.colliderSpacialMapKeys.get(collider);

      if (keys === undefined) {
        throw new Error('Keys not found for collider');
      }

      for (const key of keys) {
        const collidersInCell = this.spatialMap.get(key);

        if (collidersInCell === undefined) {
          throw new Error('Invalid cell key');
        }

        collidersInCell.delete(collider);
      }

      this.colliderSpacialMapKeys.delete(collider);
    }
  }

  private getMapKey(position: Vector2): string;
  private getMapKey(x: number, y: number): string;

  private getMapKey(positionOrX: Vector2 | number, y?: number): string {
    if (typeof positionOrX === 'number') {
      if (y === undefined) {
        throw new Error('y cannot be undefined when using x, y arguments.');
      }

      return (
        Math.floor(positionOrX / this.cellSize) * this.cellSize + ',' + Math.floor(y / this.cellSize) * this.cellSize
      );
    }

    return (
      Math.floor(positionOrX.x / this.cellSize) * this.cellSize +
      ',' +
      Math.floor(positionOrX.y / this.cellSize) * this.cellSize
    );
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
    const tlKey = this.getMapKey(collider.topLeft);
    const trKey = this.getMapKey(collider.topRight);
    const blKey = this.getMapKey(collider.bottomLeft);
    const brKey = this.getMapKey(collider.bottomRight);

    const newKeys = new Set([tlKey, trKey, blKey, brKey]);

    if (!this.colliderSpacialMapKeys.has(collider)) {
      this.colliderSpacialMapKeys.set(collider, new Set<string>());
    }

    const previousKeys = this.colliderSpacialMapKeys.get(collider);

    if (previousKeys === undefined) {
      throw new Error('Keys not found');
    }

    let movedCells = false;

    if (newKeys.size !== previousKeys.size) {
      movedCells = true;
    } else {
      for (const newKey of newKeys) {
        if (!previousKeys.has(newKey)) {
          movedCells = true;
          break;
        }
      }
    }

    if (!movedCells) {
      return;
    }

    for (const key of previousKeys) {
      const collidersInCell = this.spatialMap.get(key);

      if (collidersInCell === undefined) {
        throw new Error('Cell not found for given key.');
      }

      collidersInCell.delete(collider);
    }

    previousKeys.clear();

    // If all 4 points are in the same cell.
    if (tlKey === brKey) {
      const cellColliders = this.spatialMap.get(tlKey);
      if (cellColliders !== undefined) {
        cellColliders.add(collider);
      } else {
        this.spatialMap.set(tlKey, new Set([collider]));
      }
      previousKeys.add(tlKey);

      return;
    }

    const tlx = Number(tlKey.split(',')[0]);
    const tly = Number(tlKey.split(',')[1]);
    const xDiff = Number(trKey.split(',')[0]) - tlx;
    const yDiff = Number(blKey.split(',')[1]) - tly;

    for (let x = tlx; x <= xDiff + tlx; x += this.cellSize) {
      for (let y = tly; y <= yDiff + tly; y += this.cellSize) {
        const key = this.getMapKey(x, y);
        const cellColliders = this.spatialMap.get(key);
        if (cellColliders !== undefined) {
          cellColliders.add(collider);
        } else {
          this.spatialMap.set(key, new Set([collider]));
        }
        previousKeys.add(key);
      }
    }
  }

  private getPossibleCollisions(collider: RectangleCollider): Set<RectangleCollider> {
    const possibleCollisions: Set<RectangleCollider> = new Set<RectangleCollider>();

    const keys = this.colliderSpacialMapKeys.get(collider);

    if (keys === undefined) {
      return possibleCollisions;
    }

    for (const key of keys) {
      const otherCollidersInCell = this.spatialMap.get(key);

      if (otherCollidersInCell === undefined) {
        continue;
      }

      for (const other of otherCollidersInCell) {
        const collidingLayers = this.layerCollisionMatrix.get(collider.gameObject.layer);

        if (collidingLayers === undefined) {
          throw new Error('Layer not found');
        }

        if (other !== collider && collidingLayers.has(other.gameObject.layer)) {
          const collidersAlreadyCollidedWith = this.collisionMap.get(other);
          if (collidersAlreadyCollidedWith !== undefined && collidersAlreadyCollidedWith.has(collider)) {
            continue;
          }

          possibleCollisions.add(other);
        }
      }
    }

    return possibleCollisions;
  }

  private buildCollisionManifold(colliderA: RectangleCollider, colliderB: RectangleCollider): CollisionManifold {
    const xAxis = Math.abs(colliderA.center.x - colliderB.center.x);
    const yAxis = Math.abs(colliderA.center.y - colliderB.center.y);

    const cw = colliderA.width / 2 + colliderB.width / 2;
    const ch = colliderA.height / 2 + colliderB.height / 2;

    const ox = Math.abs(xAxis - cw);
    const oy = Math.abs(yAxis - ch);

    const normal = Vector2.clone(colliderA.center).subtract(colliderB.center).normalized;

    const penetration = ox > oy ? oy : ox;

    if (ox > oy) {
      normal.x = 0;
      normal.y = normal.y > 0 ? 1 : -1;
    } else if (ox < oy) {
      normal.y = 0;
      normal.x = normal.x > 0 ? 1 : -1;
    }

    return new CollisionManifold(colliderA, colliderB, penetration, normal);
  }
}
