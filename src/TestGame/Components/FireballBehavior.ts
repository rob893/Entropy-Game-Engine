import { Component } from '../../GameEngine/Components/Component';
import { GameObject } from '../../GameEngine/GameObjects/GameObject';
import { Vector2 } from '../../GameEngine/Core/Helpers/Vector2';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import { Explosion } from '../GameObjects/Explosion';
import { CollisionManifold } from '../../GameEngine/Core/Helpers/CollisionManifold';

export class FireballBehavior extends Component {
    private _movementDirection: Vector2 = Vector2.zero;
    private readonly collider: RectangleCollider;

    public constructor(gameObject: GameObject, collider: RectangleCollider) {
        super(gameObject);

        this.collider = collider;
        this.collider.onCollided.add(manifold => this.hit(manifold));
    }

    public get movementDirection(): Vector2 {
        return this._movementDirection.clone();
    }

    public set movementDirection(newDirection: Vector2) {
        this._movementDirection = newDirection;
        this.transform.lookAt(this.input.canvasMousePosition);
        this.transform.rotation += 5;
    }

    public update(): void {
        this.transform.translate(this.movementDirection.multiplyScalar(5));
    }

    private hit(manifold: CollisionManifold | undefined): void {
        if (manifold === undefined) {
            return;
        }

        if (manifold.getOtherCollider(this.collider).gameObject.id === 'player') {
            return;
        }

        this.instantiate(Explosion, this.transform.position);
        this.destroy(this.gameObject);
    }
}
