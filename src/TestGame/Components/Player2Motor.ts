import { Motor } from './Motor';
import { GameObject } from '../../GameEngine/Core/GameObject';
import { Vector2 } from '../../GameEngine/Core/Helpers/Vector2';
import { KeyCode } from '../../GameEngine/Core/Enums/KeyCode';
import { Rigidbody } from '../../GameEngine/Components/Rigidbody';
import TrumpRun from '../Assets/Images/trump_run.png';
import TrumpIdle from '../Assets/Images/trump_idle.png';
import { Animator } from '../../GameEngine/Components/Animator';
import { Animation } from '../../GameEngine/Core/Helpers/Animation';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import { Input } from '../../GameEngine/Core/Helpers/Input';
import { EventType } from '../../GameEngine/Core/Enums/EventType';


export class Player2Motor extends Motor {

    private movingRight: boolean = false;
    private movingLeft: boolean = false;
    private movingUp: boolean = false;
    private movingDown: boolean = false;
    private colliding: boolean = false;
    private animator: Animator;
    private rb: Rigidbody;
    private collider: RectangleCollider;
    private readonly runRightAnimation: Animation;
    private readonly runLeftAnimation: Animation;
    private readonly runUpAnimation: Animation;
    private readonly runDownAnimation: Animation;
    private readonly idleAnimation: Animation;


    public constructor(gameObject: GameObject) {
        super(gameObject);

        Input.addKeyListener(EventType.KeyDown, [KeyCode.W, KeyCode.D, KeyCode.S, KeyCode.A], (event) => this.onKeyDown(event));
        Input.addKeyListener(EventType.KeyUp, [KeyCode.W, KeyCode.D, KeyCode.S, KeyCode.A], (event) => this.onKeyUp(event));

        this.runRightAnimation = new Animation(TrumpRun, 6, 4, 0.075, 2);
        this.runLeftAnimation = new Animation(TrumpRun, 6, 4, 0.075, 4);
        this.runUpAnimation = new Animation(TrumpRun, 6, 4, 0.075, 3);
        this.runDownAnimation = new Animation(TrumpRun, 6, 4, 0.075, 1);
        this.idleAnimation = new Animation(TrumpIdle, 10, 4, 0.1, 1);

        this.speed = 2;
    }

    public start(): void {
        super.start();

        this.collider = this.gameObject.getComponent(RectangleCollider);
        this.animator = this.gameObject.getComponent<Animator>(Animator);
        this.rb = this.gameObject.getComponent(Rigidbody);
        //this.collider.onCollided.add((other) => this.handleCollisions(other));
    }

    public get isMoving(): boolean { 
        return this.xVelocity !== 0 || this.yVelocity !== 0;
    }

    protected move(): void {
        if (this.colliding) {
            this.colliding = false;
            return;
        }

        if (this.movingRight) {
            //this.xVelocity = 1;
            this.rb.addForce(Vector2.right);
        }
        else if (this.movingLeft) {
            //this.xVelocity = -1;
            this.rb.addForce(Vector2.left);
        }
        else {
            //this.xVelocity = 0;
        }

        if (this.movingUp) {
            this.rb.addForce(Vector2.up);
            //this.yVelocity = -1;
        }
        else if (this.movingDown) {
            this.rb.addForce(Vector2.down);
            //this.yVelocity = 1;
        }
        else {
            //this.yVelocity = 0;
        }
        
        if (this.isMoving) {
            //this.transform.translate(new Vector2(this.xVelocity, this.yVelocity).multiplyScalar(this.speed));
        }
    }

    protected handleOutOfBounds(): void {
    }

    private handleCollisions(other: RectangleCollider): void {
        this.colliding = true;
        
        if (this.movingRight) {
            while (this.collider.topRight.x > other.topLeft.x) {
                this.transform.setPosition(this.transform.position.x - 1, this.transform.position.y);
            }
        }
        else if (this.movingLeft) {
            while (this.collider.topLeft.x < other.topRight.x) {
                this.transform.setPosition(this.transform.position.x + 1, this.transform.position.y);
            }
        }

        if (this.movingUp) {
            while (this.collider.topLeft.y < other.topLeft.y) {
                this.transform.setPosition(this.transform.position.x, this.transform.position.y + 1);
            }
        }
        else {
            while (this.collider.bottomLeft.y > other.bottomLeft.y) {
                this.transform.setPosition(this.transform.position.x, this.transform.position.y - 1);
            }
        }
    }

    private onKeyDown(event: KeyboardEvent): void {
        if (event.keyCode === KeyCode.D) {
            this.movingRight = true;
            this.movingLeft = false;
            this.animator.setAnimation(this.runRightAnimation);
        }
        else if (event.keyCode === KeyCode.A) {
            this.movingRight = false;
            this.movingLeft = true;
            this.animator.setAnimation(this.runLeftAnimation);
        }

        if (event.keyCode === KeyCode.W) {
            this.movingUp = true;
            this.movingDown = false;
            this.animator.setAnimation(this.runUpAnimation);
        }
        else if (event.keyCode === KeyCode.S) {
            this.movingUp = false;
            this.movingDown = true;
            this.animator.setAnimation(this.runDownAnimation);
        }
    }

    private onKeyUp(event: KeyboardEvent): void {
        if (event.keyCode == KeyCode.D) {
            this.movingRight = false;
        }
        else if (event.keyCode == KeyCode.A) {
            this.movingLeft = false;
        }

        if (event.keyCode == KeyCode.W) {
            this.movingUp = false;
        }
        else if (event.keyCode == KeyCode.S) {
            this.movingDown = false;
        }

        if (!Input.getKey(KeyCode.W) && !Input.getKey(KeyCode.A) && !Input.getKey(KeyCode.S) && !Input.getKey(KeyCode.D)) {
            this.animator.setAnimation(this.idleAnimation);
        }
    }
}