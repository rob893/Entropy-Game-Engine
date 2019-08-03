import { CustomEvent } from './CustomEvent';
import { RectangleCollider } from '../../Components/RectangleCollider';

export interface CollisionDetector {
    readonly onCollisionDetected: CustomEvent<RectangleCollider>;
    readonly colliders: RectangleCollider[];
    detectCollisions(): void;
    addCollider(collider: RectangleCollider): void;
    addColliders(colliders: RectangleCollider[]): void;
}