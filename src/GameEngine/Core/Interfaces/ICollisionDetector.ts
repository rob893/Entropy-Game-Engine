import { ILiteEvent } from "./ILiteEvent";
import { RectangleCollider } from "../../Components/RectangleCollider";

export interface ICollisionDetector {
    detectCollisions(): void;
    onCollisionDetected(): ILiteEvent<RectangleCollider>;
    addCollider(collider: RectangleCollider): void;
    addColliders(colliders: RectangleCollider[]): void;
    colliders: RectangleCollider[];
}