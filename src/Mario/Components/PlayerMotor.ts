import { Motor } from "./Motor";
import { GameObject } from "../../GameEngine/Core/GameObject";
import { Vector2 } from "../../GameEngine/Core/Vector2";
import { Keys } from "../../GameEngine/Core/Helpers/Keys";
import { Rigidbody } from "../../GameEngine/Components/Rigidbody";
import MovingRightSprite from "../../assets/images/mario.png"
import MovingLeftSprite from "../../assets/images/marioLeft.png"
import { Animator } from "../../GameEngine/Components/Animator";
import { Animation } from "../../GameEngine/Core/Animation";
import { PhysicsEngine } from "../../GameEngine/Core/PhysicsEngine";
import { RectangleCollider } from "../../GameEngine/Components/RectangleCollider";


export class PlayerMotor extends Motor {

    private movingRight: boolean = false;
    private movingLeft: boolean = false;
    private moveRightAnimation: Animation;
    private moveLeftAnimation: Animation;
    private jumping: boolean = false;
    private rigidBody: Rigidbody;
    private animator: Animator;
    private collider: RectangleCollider;


    public constructor(gameObject: GameObject) {
        super(gameObject);

        document.addEventListener('keydown', () => this.onKeyDown(<KeyboardEvent>event));
        document.addEventListener('keyup', () => this.onKeyUp(<KeyboardEvent>event));
        document.addEventListener('click', () => this.onClick(<MouseEvent>event));
        this.moveRightAnimation = new Animation(MovingRightSprite, 4, 1, 0.1);
        this.moveLeftAnimation = new Animation(MovingLeftSprite, 4, 1, 0.1);
    }

    public start(): void {
        super.start();

        this.collider = this.gameObject.getComponent(RectangleCollider);
        this.collider.onCollided.add((other) => this.handleCollision(other))

        this.rigidBody = this.gameObject.getComponent<Rigidbody>(Rigidbody);
        this.animator = this.gameObject.getComponent<Animator>(Animator);
    }

    public get isMoving(): boolean { 
        return this.xVelocity !== 0 || this.yVelocity !== 0;
    }

    private handleCollision(other: RectangleCollider) {
        if (other.gameObject.tag === 'ground') {
            this.transform.position.y -= 1;
            this.rigidBody.isKinomatic = true;
        }
    }

    protected handleOutOfBounds(): void {
        if (this.transform.position.y <= 0) {
            this.transform.position.y = 1;
        }
        else if (this.transform.position.y >= this.gameCanvas.height - 55) {
            this.rigidBody.isKinomatic = true;
            this.jumping = false;
            this.transform.position.y = this.gameCanvas.height - 56;
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
        this.rigidBody.resetForce()
        this.rigidBody.addForce(Vector2.up.multiplyScalar(400));
    }

    private onClick(event: MouseEvent): void {
        let hit = PhysicsEngine.raycast(new Vector2(this.transform.position.x, this.transform.position.y - 1), Vector2.right, 5000);
    }

    private onKeyDown(event: KeyboardEvent): void {
        if (event.keyCode == Keys.RIGHT || event.keyCode == Keys.D) {
            this.movingRight = true;
            this.movingLeft = false;
            this.animator.setAnimation(this.moveRightAnimation);
        }
        else if (event.keyCode == Keys.LEFT || event.keyCode == Keys.A) {
            this.movingRight = false;
            this.movingLeft = true;
            this.animator.setAnimation(this.moveLeftAnimation);
        }

        if (event.keyCode == Keys.SPACE) {
            this.jump();
        }
    }

    private onKeyUp(event: KeyboardEvent): void {
        if (event.keyCode == Keys.RIGHT || event.keyCode == Keys.D) {
            this.movingRight = false;
        }
        else if (event.keyCode == Keys.LEFT || event.keyCode == Keys.A) {
            this.movingLeft = false;
        }
    }
}