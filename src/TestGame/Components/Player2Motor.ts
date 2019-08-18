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
import { CollisionManifold } from '../../GameEngine/Core/Helpers/CollisionManifold';


export class Player2Motor extends Motor {

    private movingRight: boolean = false;
    private movingLeft: boolean = false;
    private movingUp: boolean = false;
    private movingDown: boolean = false;
    private readonly animator: Animator;
    private readonly collider: RectangleCollider;
    private readonly runRightAnimation: Animation;
    private readonly runLeftAnimation: Animation;
    private readonly runUpAnimation: Animation;
    private readonly runDownAnimation: Animation;
    private readonly idleAnimation: Animation;


    public constructor(gameObject: GameObject, gameCanvas: HTMLCanvasElement, collider: RectangleCollider, animator: Animator) {
        super(gameObject, gameCanvas);

        this.collider = collider;
        this.animator = animator;

        this.collider.onCollided.add((manifold) => this.handleCollisions(manifold));

        Input.addKeyListener(EventType.KeyDown, [KeyCode.W, KeyCode.D, KeyCode.S, KeyCode.A], (event) => this.onKeyDown(event));
        Input.addKeyListener(EventType.KeyUp, [KeyCode.W, KeyCode.D, KeyCode.S, KeyCode.A], (event) => this.onKeyUp(event));

        this.runRightAnimation = new Animation(TrumpRun, 6, 4, 0.075, 2);
        this.runLeftAnimation = new Animation(TrumpRun, 6, 4, 0.075, 4);
        this.runUpAnimation = new Animation(TrumpRun, 6, 4, 0.075, 3);
        this.runDownAnimation = new Animation(TrumpRun, 6, 4, 0.075, 1);
        this.idleAnimation = new Animation(TrumpIdle, 10, 4, 0.1, 1);

        this.speed = 2;
    }

    public get isMoving(): boolean { 
        return this.xVelocity !== 0 || this.yVelocity !== 0;
    }

    protected move(): void {
        if (this.movingRight) {
            this.xVelocity = 1;
        }
        else if (this.movingLeft) {
            this.xVelocity = -1;
        }
        else {
            this.xVelocity = 0;
        }

        if (this.movingUp) {
            this.yVelocity = -1;
        }
        else if (this.movingDown) {
            this.yVelocity = 1;
        }
        else {
            this.yVelocity = 0;
        }
        
        if (this.isMoving) {
            this.transform.translate(new Vector2(this.xVelocity, this.yVelocity).multiplyScalar(this.speed));
        }
    }

    protected handleOutOfBounds(): void {
    }

    private handleCollisions(collisionManifold: CollisionManifold): void {
        const other = collisionManifold.getOtherCollider(this.collider);
        const normal = collisionManifold.getCollisionNormalForCollider(this.collider);

        while (this.collider.detectCollision(other)) {
            this.transform.position.add(normal);
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