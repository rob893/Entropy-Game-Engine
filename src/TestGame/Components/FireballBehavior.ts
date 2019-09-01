import { Component } from '../../GameEngine/Components/Component';
import { GameObject } from '../../GameEngine/Core/GameObject';
import { ObjectManager } from '../../GameEngine/Core/Helpers/ObjectManager';
import { Vector2 } from '../../GameEngine/Core/Helpers/Vector2';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import { Explosion } from '../GameObjects/Explosion';
import { CollisionManifold } from '../../GameEngine/Core/Helpers/CollisionManifold';
import { Input } from '../../GameEngine/Core/Helpers/Input';

export class FireballBehavior extends Component {
    
    private _movementDirection: Vector2 = Vector2.zero;
    private readonly objectManager: ObjectManager;
    private readonly collider: RectangleCollider;
    private readonly input: Input;


    public constructor(gameObject: GameObject, objectManager: ObjectManager, collider: RectangleCollider, input: Input) {
        super(gameObject);

        this.objectManager = objectManager;
        this.collider = collider;
        this.input = input;

        this.collider.onCollided.add((manifold) => this.hit(manifold));
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

    private hit(manifold: CollisionManifold): void {
        if (manifold.getOtherCollider(this.collider).gameObject.id === 'player') {
            return;
        }

        this.objectManager.instantiate(Explosion, this.transform.position);
        this.objectManager.destroy(this.gameObject);
    }
}