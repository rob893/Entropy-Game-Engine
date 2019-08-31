import { Component } from '../../GameEngine/Components/Component';
import { ObjectManager } from '../../GameEngine/Core/Helpers/ObjectManager';
import { GameObject } from '../../GameEngine/Core/GameObject';
import { Physics } from '../../GameEngine/Core/Physics/Physics';
import { Rigidbody } from '../../GameEngine/Components/Rigidbody';
import { Vector2 } from '../../GameEngine/Core/Helpers/Vector2';

export class Exploder extends Component {

    private readonly objectManager: ObjectManager;
    private readonly physics: Physics;


    public constructor(gameObject: GameObject, objectManager: ObjectManager, physics: Physics) {
        super(gameObject);

        this.objectManager = objectManager;
        this.physics = physics;
    }

    public start(): void {
        this.objectManager.destroy(this.gameObject, 5);

        const hitColliders = this.physics.overlapSphere(this.transform.position, 150);

        for (const collider of hitColliders) {
            if (collider.gameObject.hasComponent(Rigidbody)) {
                collider.gameObject.getComponent(Rigidbody).addForce(Vector2.direction(this.transform.position, collider.transform.position).multiplyScalar(1000));
            }
        }
    }
}