import { GameObject } from '../../../../GameEngine/GameObjects/GameObject';
import { Vector2 } from '../../../../GameEngine/Core/Helpers/Vector2';
import { KeyCode } from '../../../../GameEngine/Core/Enums/KeyCode';
import { Rigidbody } from '../../../../GameEngine/Components/Rigidbody';
import { EventType } from '../../../../GameEngine/Core/Enums/EventType';
import { Component } from '../../../../GameEngine/Components/Component';
import { ThrowableBall } from '../../../GameObjects/ThrowableBall';
import { CharacterAnimator } from '../CharacterAnimator';

export class PlayerPhysicsMotor extends Component {
    private movingRight: boolean = false;
    private movingLeft: boolean = false;
    private movingUp: boolean = false;
    private movingDown: boolean = false;
    private readonly speed: number;
    private readonly animator: CharacterAnimator;
    private readonly rb: Rigidbody;

    public constructor(gameObject: GameObject, rb: Rigidbody, animator: CharacterAnimator) {
        super(gameObject);

        this.rb = rb;
        this.animator = animator;

        this.input.addKeyListener(
            EventType.KeyDown,
            [KeyCode.W, KeyCode.D, KeyCode.S, KeyCode.A, KeyCode.Space, KeyCode.Backspace],
            event => this.onKeyDown(event)
        );
        this.input.addKeyListener(EventType.KeyUp, [KeyCode.W, KeyCode.D, KeyCode.S, KeyCode.A], event =>
            this.onKeyUp(event)
        );
        this.input.addMouseListener(EventType.MouseDown, 0, () => this.throwBall());

        this.speed = 5;
    }

    public start(): void {
        super.start();

        //this.ball = this.getComponentInChildren(Transform);
    }

    public update(): void {
        if (this.movingRight) {
            this.rb.addForce(Vector2.right.multiplyScalar(this.speed));
        } else if (this.movingLeft) {
            this.rb.addForce(Vector2.left.multiplyScalar(this.speed));
        }

        if (this.movingUp) {
            this.rb.addForce(Vector2.up.multiplyScalar(this.speed));
        } else if (this.movingDown) {
            this.rb.addForce(Vector2.down.multiplyScalar(this.speed));
        }

        if (!this.movingDown && !this.movingUp && !this.movingLeft && !this.movingRight) {
            this.animator.playIdleAnimation();
        }
    }

    private throwBall(): void {
        const ball = this.instantiate(
            ThrowableBall,
            new Vector2(this.transform.position.x, this.transform.position.y - 30)
        );
        const rb = ball.getComponent(Rigidbody);
        this.animator.playRandomAttackAnimation();

        if (rb !== null) {
            rb.addForce(Vector2.direction(this.transform.position, this.input.canvasMousePosition).multiplyScalar(800));
        }
    }

    private onKeyDown(event: KeyboardEvent): void {
        if (event.keyCode === KeyCode.D) {
            this.movingRight = true;
            this.movingLeft = false;
            this.animator.playRunAnimation(true);
        } else if (event.keyCode === KeyCode.A) {
            this.movingRight = false;
            this.movingLeft = true;
            this.animator.playRunAnimation(false);
        }

        if (event.keyCode === KeyCode.W) {
            this.movingUp = true;
            this.movingDown = false;
            this.animator.playRunAnimation(true);
        } else if (event.keyCode === KeyCode.S) {
            this.movingUp = false;
            this.movingDown = true;
            this.animator.playRunAnimation(true);
        }

        if (event.keyCode === KeyCode.Space) {
            this.rb.addForce(Vector2.up.multiplyScalar(600));
        }

        if (event.keyCode === KeyCode.Backspace) {
            //this.ball.parent = this.ball.parent === null ? this.transform : null;
            //this.rb.isKinomatic = !this.rb.isKinomatic;
        }
    }

    private onKeyUp(event: KeyboardEvent): void {
        if (event.keyCode == KeyCode.D) {
            this.movingRight = false;
        } else if (event.keyCode == KeyCode.A) {
            this.movingLeft = false;
        }

        if (event.keyCode == KeyCode.W) {
            this.movingUp = false;
        } else if (event.keyCode == KeyCode.S) {
            this.movingDown = false;
        }

        if (
            !this.input.getKey(KeyCode.W) &&
            !this.input.getKey(KeyCode.A) &&
            !this.input.getKey(KeyCode.S) &&
            !this.input.getKey(KeyCode.D)
        ) {
            this.animator.playIdleAnimation();
        }
    }
}
