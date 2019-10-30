import { Component } from '../../GameEngine/Components/Component';
import { GameObject } from '../../GameEngine/Core/GameObject';
import { Rigidbody } from '../../GameEngine/Components/Rigidbody';
import { Vector2 } from '../../GameEngine/Core/Helpers/Vector2';
import { AudioSource } from '../../GameEngine/Components/AudioSource';
import { PlayerHealth } from './Characters/Player/PlayerHealth';
import { CharacterStats } from './Characters/CharacterStats';

export class Exploder extends Component {

    private readonly audioSource: AudioSource;


    public constructor(gameObject: GameObject, audioSource: AudioSource) {
        super(gameObject);

        this.audioSource = audioSource;
    }

    public start(): void {
        this.destroy(this.gameObject, 5);
        this.audioSource.play();

        const hitColliders = this.physics.overlapSphere(this.transform.position, 150);

        for (const collider of hitColliders) {
            const rb = collider.getComponent(Rigidbody);
            if (rb !== null) {
                rb.addForce(Vector2.direction(this.transform.position, collider.transform.position).multiplyScalar(1000));
            }

            const health = collider.getComponent(CharacterStats);
            if (health !== null) {
                health.takeDamage(10);
            }
        }
    }
}