import { Component, Rigidbody, GameObject, EventType, Key, Vector2 } from '@entropy-engine/entropy-game-engine';

export class Motor extends Component {
  private movingRight: boolean = false;
  private movingLeft: boolean = false;
  private movingUp: boolean = false;
  private movingDown: boolean = false;
  private readonly speed: number;
  private readonly rb: Rigidbody;

  public constructor(gameObject: GameObject, rb: Rigidbody) {
    super(gameObject);

    this.rb = rb;

    this.input.addKeyListener(EventType.KeyDown, ['w', 'a', 's', 'd', Key.Space, Key.Backspace], event =>
      this.onKeyDown(event)
    );
    this.input.addKeyListener(EventType.KeyUp, ['w', 'a', 's', 'd'], event => this.onKeyUp(event));

    this.speed = 5;
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
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'd') {
      this.movingRight = true;
      this.movingLeft = false;
    } else if (event.key === 'a') {
      this.movingRight = false;
      this.movingLeft = true;
    }

    if (event.key === 'w') {
      this.movingUp = true;
      this.movingDown = false;
    } else if (event.key === 's') {
      this.movingUp = false;
      this.movingDown = true;
    }

    if (event.key === Key.Space) {
      this.rb.addForce(Vector2.up.multiplyScalar(600));
    }
  }

  private onKeyUp(event: KeyboardEvent): void {
    if (event.key === 'd') {
      this.movingRight = false;
    } else if (event.key === 'a') {
      this.movingLeft = false;
    }

    if (event.key === 'w') {
      this.movingUp = false;
    } else if (event.key === 's') {
      this.movingDown = false;
    }
  }
}
