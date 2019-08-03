import { CustomLiteEvent } from './CustomLiteEvent';
import { RectangleCollider } from '../../Components/RectangleCollider';

export interface CollisionDetector {
    readonly onCollisionDetected: CustomLiteEvent<RectangleCollider>;
    readonly colliders: RectangleCollider[];
    detectCollisions(): void;
    addCollider(collider: RectangleCollider): void;
    addColliders(colliders: RectangleCollider[]): void;
}