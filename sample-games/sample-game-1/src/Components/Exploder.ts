import { Transform, Component, AudioSource, Rigidbody } from '@rherber/typescript-game-engine'
import { CharacterStats } from './Characters/CharacterStats';
import { GameObject } from '../../../../compiled/src/GameEngine/Core/GameObject';
import { Vector2 } from '../../../../compiled/src/GameEngine/Core/Helpers/Vector2';

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
                rb.addForce(
                    Vector2.direction(this.transform.position, collider.transform.position).multiplyScalar(1000)
                );
            }

            const health = collider.getComponent(CharacterStats);
            if (health !== null) {
                health.takeDamage(10);
            }
        }
    }
}
