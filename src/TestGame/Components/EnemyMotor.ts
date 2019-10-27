import { Component } from '../../GameEngine/Components/Component';
import { GameObject } from '../../GameEngine/Core/GameObject';
import { NavAgent } from '../../GameEngine/Components/NavAgent';
import { KeyCode } from '../../GameEngine/Core/Enums/KeyCode';
import { Vector2 } from '../../GameEngine/Core/Helpers/Vector2';
import { EventType } from '../../GameEngine/Core/Enums/EventType';
import { Animation } from '../../GameEngine/Core/Helpers/Animation';
import { Animator } from '../../GameEngine/Components/Animator';
import { SpriteSheet } from '../../GameEngine/Core/Helpers/SpriteSheet';
import { Transform } from '../../GameEngine/Components/Transform';
import { CanvasMouseEvent } from '../../GameEngine/Core/Interfaces/CanvasMouseEvent';
import { CharacterAnimator } from './CharacterAnimator';

export class EnemyMotor extends Component {

    private playerTransform: Transform | null = null;
    private timer: number = 0;
    private readonly navAgent: NavAgent;
    private readonly animator: CharacterAnimator;


    public constructor(gameObject: GameObject, navAgent: NavAgent, animator: CharacterAnimator) {
        super(gameObject);

        this.navAgent = navAgent;
        this.animator = animator;

        this.navAgent.onDirectionChanged.add((newDirection) => this.changeAnimation(newDirection));
        this.navAgent.onPathCompleted.add(() => this.animator.playIdleAnimation());
    }

    public start(): void {
        const player = this.findGameObjectById('player');

        if (player === null) {
            throw new Error('player not found');

        }
        this.playerTransform = player.transform;
    }

    public update(): void {
        if (this.playerTransform === null) {
            return;
        }
        
        this.timer += this.time.deltaTime;
        
        if (this.timer > 1) {
            if (Vector2.distance(this.transform.position, this.playerTransform.position) < 75) {
                this.navAgent.resetPath();
                this.animator.playRandomAttackAnimation();
                return;
            }

            this.navAgent.setDestination(this.playerTransform.position);
            this.timer = 0;
        }
    }

    private changeAnimation(newDirection: Vector2 | undefined): void {
        if (newDirection === undefined) {
            throw new Error('Error');
        }

        if (Math.abs(newDirection.x) > Math.abs(newDirection.y)) {
            if (newDirection.x > 0.5) {
                this.animator.playRunAnimation(true);
            }
            else {
                this.animator.playRunAnimation(false);
            }
        }
        else {
            if (newDirection.y > 0.5) {
                this.animator.playRunAnimation();
            }
            else {
                this.animator.playRunAnimation();
            }
        }
    }
}