import { ILiteEvent } from "./ILiteEvent";
import { RectangleCollider } from "../../Components/RectangleCollider";

export interface ICollisionDetector {
    readonly onCollisionDetected: ILiteEvent<RectangleCollider>;
    readonly colliders: RectangleCollider[];
    detectCollisions(): void;
    addCollider(collider: RectangleCollider): void;
    addColliders(colliders: RectangleCollider[]): void;
}