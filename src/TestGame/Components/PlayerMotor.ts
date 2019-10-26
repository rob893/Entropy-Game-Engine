import { GameObject } from '../../GameEngine/Core/GameObject';
import { Vector2 } from '../../GameEngine/Core/Helpers/Vector2';
import { KeyCode } from '../../GameEngine/Core/Enums/KeyCode';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import { EventType } from '../../GameEngine/Core/Enums/EventType';
import { CollisionManifold } from '../../GameEngine/Core/Helpers/CollisionManifold';
import { Fireball } from '../GameObjects/Fireball';
import { FireballBehavior } from './FireballBehavior';
import { Component } from '../../GameEngine/Components/Component';
import { PlayerAnimator } from './PlayerAnimator';


export class PlayerMotor extends Component {

    public speed: number = 5
    
    private xVelocity: number = 0;
    private yVelocity: number = 0;
    private movingRight: boolean = false;
    private movingLeft: boolean = false;
    private movingUp: boolean = false;
    private movingDown: boolean = false;
    private jumping: boolean = false;
    private readonly animator: PlayerAnimator;
    private readonly collider: RectangleCollider;


    public constructor(gameObject: GameObject, collider: RectangleCollider, animator: PlayerAnimator) {
        super(gameObject);

        this.collider = collider;
        this.animator = animator;

        this.collider.onCollided.add((manifold) => this.handleCollisions(manifold));

        this.input.addKeyListener(EventType.KeyDown, [KeyCode.W, KeyCode.D, KeyCode.S, KeyCode.A, KeyCode.R, KeyCode.Space], (event) => this.onKeyDown(event));
        this.input.addKeyListener(EventType.KeyUp, [KeyCode.W, KeyCode.D, KeyCode.S, KeyCode.A], (event) => this.onKeyUp(event));
        this.input.addMouseListener(EventType.MouseDown, 0, () => this.fireball());

        this.speed = 2;
    }

    public update(): void {
        this.move();
    }

    public get isMoving(): boolean {
        return this.xVelocity !== 0 || this.yVelocity !== 0;
    }

    protected move(): void {
        if (this.movingRight) {
            this.animator.playRunAnimation(true);
            this.xVelocity = 1;
        }
        else if (this.movingLeft) {
            this.animator.playRunAnimation(false);
            this.xVelocity = -1;
        }
        else {
            this.xVelocity = 0;
        }

        if (this.movingUp) {
            this.animator.playRunAnimation();
            this.yVelocity = -1;
        }
        else if (this.movingDown) {
            this.animator.playRunAnimation();
            this.yVelocity = 1;
        }
        else {
            this.yVelocity = 0;
        }

        if (this.isMoving) {
            this.transform.translate(new Vector2(this.xVelocity, this.yVelocity).multiplyScalar(this.speed));
        }
        else {
            this.animator.playIdleAnimation();
        }
    }

    private handleCollisions(collisionManifold: CollisionManifold | undefined): void {
        if (collisionManifold === undefined) {
            throw new Error();
        }

        const other = collisionManifold.getOtherCollider(this.collider);

        if (other.isTrigger) {
            return;
        }

        const normal = collisionManifold.getCollisionNormalForCollider(this.collider);

        while (this.collider.detectCollision(other)) {
            this.transform.position.add(normal);
        }
    }

    private fireball(): void {
        this.animator.playRandomAttackAnimation();
        const fireball = this.instantiate(Fireball, new Vector2(this.transform.position.x, this.transform.position.y - 20));
        const fbBehaviour = fireball.getComponent(FireballBehavior);

        if (fbBehaviour === null) {
            throw new Error('Invalid fb');
        }

        fbBehaviour.movementDirection = Vector2.direction(this.transform.position, this.input.canvasMousePosition);
    }

    private jump(): void {
        this.jumping = true;
        this.animator.playJumpAnimation();
    }

    private onKeyDown(event: KeyboardEvent): void {
        if (event.keyCode === KeyCode.D) {
            this.movingRight = true;
            this.movingLeft = false;
            
        }
        else if (event.keyCode === KeyCode.A) {
            this.movingRight = false;
            this.movingLeft = true;
        }

        if (event.keyCode === KeyCode.W) {
            this.movingUp = true;
            this.movingDown = false;
        }
        else if (event.keyCode === KeyCode.S) {
            this.movingUp = false;
            this.movingDown = true;
        }

        if (event.keyCode === KeyCode.Space) {
            this.jump();
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
    }
}