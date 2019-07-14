import { Motor } from "./Motor";
import { GameObject } from "../../GameEngine/Core/GameObject";
import { Vector2 } from "../../GameEngine/Core/Vector2";
import { Keys } from "../../GameEngine/Core/Helpers/Keys";
import { Rigidbody } from "../../GameEngine/Components/Rigidbody";
import MovingRightSprite from "../../assets/mario.png"
import MovingLeftSprite from "../../assets/marioLeft.png"
import { Animator } from "../../GameEngine/Components/Animator";


export class PlayerMotor extends Motor {

    private movingUp: boolean = false;
    private movingDown: boolean = false;
    private movingRight: boolean = false;
    private movingLeft: boolean = false;
    private movingRSprite: string;
    private movingLSprite: string;
    private jumping: boolean = false;
    private rigidBody: Rigidbody;
    private animator: Animator;


    public constructor(gameObject: GameObject) {
        super(gameObject);

        document.addEventListener('keydown', () => this.onKeyDown(<KeyboardEvent>event));
        document.addEventListener('keyup', () => this.onKeyUp(<KeyboardEvent>event));
        this.movingRSprite = MovingRightSprite;
        this.movingLSprite = MovingLeftSprite;
    }

    public start(): void {
        super.start();

        this.rigidBody = this.gameObject.getComponent<Rigidbody>(Rigidbody);
        this.animator = this.gameObject.getComponent<Animator>(Animator);
    }

    public get isMoving(): boolean { 
        return this.xVelocity !== 0 || this.yVelocity !== 0;
    }

    protected handleOutOfBounds(): void {
        if (this.transform.position.y <= 0) {
            this.transform.position.y = 1;
        }
        else if (this.transform.position.y + this.transform.height >= this.gameCanvas.height - 55) {
            this.rigidBody.isKinomatic = true;
            this.jumping = false;
            this.transform.position.y = (this.gameCanvas.height - this.transform.height) - 56;
        }

        if (this.transform.position.x <= 0) {
            this.transform.position.x = 1;
        }
        else if (this.transform.position.x + this.transform.width >= this.gameCanvas.width) {
            this.transform.position.x = (this.gameCanvas.width - this.transform.width) - 1;
        }
    }

    protected move(): void {
        // if (this.movingUp) {
        //     this.yVelocity = 1;
        // }
        // else if (this.movingDown) {
        //     this.yVelocity = -1;
        // }
        // else {
        //     this.yVelocity = 0;
        // }

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

    private onKeyDown(event: KeyboardEvent) {
        // if (event.keyCode == Keys.UP || event.keyCode == Keys.W) {
        //     this.movingUp = true;
        //     this.movingDown = false;
        // }
        // else if (event.keyCode == Keys.DOWN || event.keyCode == Keys.S) {
        //     this.movingDown = true;
        //     this.movingUp = false;
        // }

        if (event.keyCode == Keys.RIGHT || event.keyCode == Keys.D) {
            this.movingRight = true;
            this.movingLeft = false;
            this.animator.setSprite(this.movingRSprite);
        }
        else if (event.keyCode == Keys.LEFT || event.keyCode == Keys.A) {
            this.movingRight = false;
            this.movingLeft = true;
            this.animator.setSprite(this.movingLSprite);
        }

        if (event.keyCode == Keys.SPACE) {
            this.jump();
        }
    }

    private onKeyUp(event: KeyboardEvent) {
        // if (event.keyCode == Keys.UP || event.keyCode == Keys.W) {
        //     this.movingUp = false;
        // }
        // else if (event.keyCode == Keys.DOWN || event.keyCode == Keys.S) {
        //     this.movingDown = false;
        // }

        if (event.keyCode == Keys.RIGHT || event.keyCode == Keys.D) {
            this.movingRight = false;
        }
        else if (event.keyCode == Keys.LEFT || event.keyCode == Keys.A) {
            this.movingLeft = false;
        }
    }
}