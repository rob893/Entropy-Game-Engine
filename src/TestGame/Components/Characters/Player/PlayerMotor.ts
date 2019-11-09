import { GameObject } from '../../../../GameEngine/Core/GameObject';
import { Vector2 } from '../../../../GameEngine/Core/Helpers/Vector2';
import { KeyCode } from '../../../../GameEngine/Core/Enums/KeyCode';
import { RectangleCollider } from '../../../../GameEngine/Components/RectangleCollider';
import { EventType } from '../../../../GameEngine/Core/Enums/EventType';
import { CollisionManifold } from '../../../../GameEngine/Core/Helpers/CollisionManifold';
import { Fireball } from '../../../GameObjects/Fireball';
import { FireballBehavior } from '../../FireballBehavior';
import { Component } from '../../../../GameEngine/Components/Component';
import { CharacterAnimator } from '../CharacterAnimator';
import { ClickedOnDetector } from '../../../../GameEngine/Components/ClickedOnDetector';
import { CharacterStats } from '../CharacterStats';
import { Layer } from '../../../../GameEngine/Core/Enums/Layer';
import { Spawner } from '../../Spawner';


export class PlayerMotor extends Component {

    public speed: number = 5
    
    private xVelocity: number = 0;
    private yVelocity: number = 0;
    private jumping: boolean = false;
    private readonly animator: CharacterAnimator;
    private readonly collider: RectangleCollider;
    private readonly myStats: CharacterStats;


    public constructor(gameObject: GameObject, collider: RectangleCollider, animator: CharacterAnimator, myStats: CharacterStats) {
        super(gameObject);

        this.collider = collider;
        this.animator = animator;
        this.myStats = myStats;

        this.collider.onCollided.add((manifold) => this.handleCollisions(manifold));

        this.input.addKeyListener(EventType.KeyDown, KeyCode.Space, () => this.jump());
        this.input.addKeyListener(EventType.KeyDown, KeyCode.R, () => this.fireball());
        this.input.addMouseListener(EventType.MouseDown, 0, () => this.meleeAttack());

        this.speed = 2;
    }

    public start(): void {
        const spawner = this.getComponent(Spawner);

        if (spawner !== null) {
            this.input.addKeyListener(EventType.KeyDown, KeyCode.Backspace, () => spawner.toggleSpawn());
            this.myStats.onDeath.add(() => spawner.stopSpawning());
        }
    }

    public update(): void {
        if (!this.myStats.isDead) {
            this.move();
        }
    }

    public get isMoving(): boolean {
        return this.xVelocity !== 0 || this.yVelocity !== 0;
    }

    private move(): void {
        if (this.input.getKey(KeyCode.D)) {
            this.animator.playRunAnimation(true);
            this.xVelocity = 1;
        }
        else if (this.input.getKey(KeyCode.A)) {
            this.animator.playRunAnimation(false);
            this.xVelocity = -1;
        }
        else {
            this.xVelocity = 0;
        }

        if (this.input.getKey(KeyCode.W)) {
            this.animator.playRunAnimation();
            this.yVelocity = -1;
        }
        else if (this.input.getKey(KeyCode.S)) {
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

        let moved = false;
        while (this.collider.detectCollision(other)) {
            this.transform.position.add(normal);
            moved = true;
        }

        if (moved) {
            this.transform.setPosition(this.transform.position.x, this.transform.position.y); //trigger the move event
        }
    }

    private meleeAttack(): void {
        // if (this.input.canvasMousePosition.x < this.transform.position.x) {
        //     this.animator.faceLeft();
        // }
        // else {
        //     this.animator.faceRight();
        // }
        
        this.animator.playRandomAttackAnimation();

        const colliders = this.physics.overlapSphere(this.transform.position, this.myStats.attackRange, Layer.Hostile);

        for (const collider of colliders) {
            const hitStats = collider.getComponent(CharacterStats);

            if (hitStats !== null) {
                hitStats.takeDamage(this.myStats.attackPower);
            }
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
}