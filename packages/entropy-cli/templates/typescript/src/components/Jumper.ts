import { Component, Rigidbody, GameObject, EventType, KeyCode, Vector2 } from '@entropy-engine/entropy-game-engine';

export class Jumper extends Component {
    private readonly rb: Rigidbody;

    public constructor(gameObject: GameObject, rb: Rigidbody) {
        super(gameObject);

        this.rb = rb;

        this.input.addKeyListener(EventType.KeyDown, KeyCode.Space, event => this.onKeyDown(event));
    }

    private onKeyDown(event: KeyboardEvent): void {
        if (event.keyCode === KeyCode.Space) {
            this.rb.addForce(Vector2.up.multiplyScalar(600));
        }
    }
}
