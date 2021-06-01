import { ThrowableBall } from '../../../game-objects/ThrowableBall';
import { CharacterAnimator } from '../CharacterAnimator';
import { Component, EventType, GameObject, Key, Rigidbody, Vector2 } from '@entropy-engine/entropy-game-engine';

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

    this.input.addKeyListener(EventType.KeyDown, ['w', 'a', 's', 'd', Key.Space, Key.Backspace], event =>
      this.onKeyDown(event)
    );
    this.input.addKeyListener(EventType.KeyUp, ['w', 'a', 's', 'd'], event => this.onKeyUp(event));
    this.input.addMouseListener(EventType.MouseDown, 0, () => this.throwBall());

    this.speed = 5;
  }

  public override start(): void {
    super.start();

    //this.ball = this.getComponentInChildren(Transform);
  }

  public override update(): void {
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
    if (event.key === 'd') {
      this.movingRight = true;
      this.movingLeft = false;
      this.animator.playRunAnimation(1, 0);
    } else if (event.key === 'a') {
      this.movingRight = false;
      this.movingLeft = true;
      this.animator.playRunAnimation(-1, 0);
    }

    if (event.key === 'w') {
      this.movingUp = true;
      this.movingDown = false;
      this.animator.playRunAnimation(1, 0);
    } else if (event.key === 's') {
      this.movingUp = false;
      this.movingDown = true;
      this.animator.playRunAnimation(-1, 0);
    }

    if (event.key === Key.Space) {
      this.rb.addForce(Vector2.up.multiplyScalar(600));
    }

    if (event.key === Key.Backspace) {
      //this.ball.parent = this.ball.parent === null ? this.transform : null;
      //this.rb.isKinomatic = !this.rb.isKinomatic;
    }
  }

  private onKeyUp(event: KeyboardEvent): void {
    if (event.key == 'd') {
      this.movingRight = false;
    } else if (event.key == 'a') {
      this.movingLeft = false;
    }

    if (event.key == 'w') {
      this.movingUp = false;
    } else if (event.key == 's') {
      this.movingDown = false;
    }

    if (!this.input.getKey('w') && !this.input.getKey('a') && !this.input.getKey('s') && !this.input.getKey('d')) {
      this.animator.playIdleAnimation();
    }
  }
}
