import { Motor } from './Motor';
import { GameObject } from '../../GameEngine/Core/GameObject';
import { Vector2 } from '../../GameEngine/Core/Helpers/Vector2';
import { KeyCode } from '../../GameEngine/Core/Enums/KeyCode';
import { Rigidbody } from '../../GameEngine/Components/Rigidbody';
import MovingRightSprite from '../Assets/Images/mario.png';
import MovingLeftSprite from '../Assets/Images/marioLeft.png';
import { Animator } from '../../GameEngine/Components/Animator';
import { Animation } from '../../GameEngine/Core/Helpers/Animation';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import { Input } from '../../GameEngine/Core/Helpers/Input';
import { EventType } from '../../GameEngine/Core/Enums/EventType';


export class PlayerMotor extends Motor {

    private movingRight: boolean = false;
    private movingLeft: boolean = false;
    private readonly moveRightAnimation: Animation;
    private readonly moveLeftAnimation: Animation;
    private jumping: boolean = false;
    private readonly rigidBody: Rigidbody;
    private readonly animator: Animator;
    private readonly collider: RectangleCollider;


    public constructor(gameObject: GameObject, gameCanvas: HTMLCanvasElement, collider: RectangleCollider, rb: Rigidbody, animator: Animator) {
        super(gameObject, gameCanvas);

        this.collider = collider;
        this.rigidBody = rb;
        this.animator = animator;

        Input.addKeyListener(EventType.KeyDown, [KeyCode.RightArrow, KeyCode.D, KeyCode.LeftArrow, KeyCode.A, KeyCode.Space], (event) => this.onKeyDown(event));
        Input.addKeyListener(EventType.KeyUp, [KeyCode.RightArrow, KeyCode.D, KeyCode.LeftArrow, KeyCode.A], (event) => this.onKeyUp(event));

        this.moveRightAnimation = new Animation(MovingRightSprite, 4, 1, 0.1);
        this.moveLeftAnimation = new Animation(MovingLeftSprite, 4, 1, 0.1);
    }

    public get isMoving(): boolean { 
        return this.xVelocity !== 0 || this.yVelocity !== 0;
    }

    protected handleOutOfBounds(): void {
        if (this.transform.position.y <= 0) {
            this.transform.position.y = 1;
        }
        else if (this.transform.position.y >= this.gameCanvas.height - 75) {
            this.rigidBody.isKinomatic = true;
            this.jumping = false;
            this.transform.position.y = this.gameCanvas.height - 76;
        }

        if (this.transform.position.x - (this.collider.width / 2) <= 0) {
            this.transform.position.x = (this.collider.width / 2) + 1;
        }
        else if (this.transform.position.x + (this.collider.width / 2) >= this.gameCanvas.width) {
            this.transform.position.x = (this.gameCanvas.width - (this.collider.width / 2)) - 1;
        }
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
        
        if (this.isMoving) {
            this.transform.translate(new Vector2(this.xVelocity, this.yVelocity).multiplyScalar(this.speed));
        }
    }

    private jump(): void {
        if (this.jumping) {
            return;
        }
        
        this.jumping = true;
        this.rigidBody.isKinomatic = false;
        //this.rigidBody.resetForce();
        this.rigidBody.addForce(Vector2.up.multiplyScalar(400));
    }

    private onKeyDown(event: KeyboardEvent): void {
        if (event.keyCode == KeyCode.RightArrow || event.keyCode == KeyCode.D) {
            this.movingRight = true;
            this.movingLeft = false;
            this.animator.setAnimation(this.moveRightAnimation);
        }
        else if (event.keyCode == KeyCode.LeftArrow || event.keyCode == KeyCode.A) {
            this.movingRight = false;
            this.movingLeft = true;
            this.animator.setAnimation(this.moveLeftAnimation);
        }

        if (event.keyCode == KeyCode.Space) {
            this.jump();
        }
    }

    private onKeyUp(event: KeyboardEvent): void {
        if (event.keyCode == KeyCode.RightArrow || event.keyCode == KeyCode.D) {
            this.movingRight = false;
        }
        else if (event.keyCode == KeyCode.LeftArrow || event.keyCode == KeyCode.A) {
            this.movingLeft = false;
        }
    }
}