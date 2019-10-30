import { State } from '../../../Interfaces/State';
import { Component } from '../../../../GameEngine/Components/Component';
import { NPCController } from './NPCController';
import { NavAgent } from '../../../../GameEngine/Components/NavAgent';
import { Vector2 } from '../../../../GameEngine/Core/Helpers/Vector2';
import { GameObject } from '../../../../GameEngine/Core/GameObject';
import { CharacterAnimator } from '../CharacterAnimator';
import { CharacterStats } from '../CharacterStats';

export class ChaseState extends Component implements State {
    
    private readonly navAgent: NavAgent;
    private readonly animator: CharacterAnimator;
    private readonly myStats: CharacterStats;
    private timer: number = 0;
    private targetStats: CharacterStats | null = null;


    public constructor(gameObject: GameObject, navAgent: NavAgent, animator: CharacterAnimator, myStats: CharacterStats) {
        super(gameObject);

        this.navAgent = navAgent;
        this.animator = animator;
        this.myStats = myStats;

        this.navAgent.onDirectionChanged.add((newDirection) => this.changeAnimation(newDirection));
        this.navAgent.onPathCompleted.add(() => this.animator.playIdleAnimation());
    }
    
    public performBehavior(context: NPCController): void {
        if (context.currentTarget === null || this.targetStats === null || this.targetStats.isDead) {
            context.setState(context.searchingState);
            return;
        }

        if (Vector2.distance(this.transform.position, context.currentTarget.position) < this.myStats.attackRange) {
            context.setState(context.attackState);
            return;
        }

        this.timer += this.time.deltaTime;

        if (this.timer < 1) {
            return;
        }

        this.timer = 0;

        this.navAgent.setDestination(context.currentTarget.position);
    }    
    
    public onEnter(context: NPCController): void {
        const target = context.currentTarget;

        if (target === null) {
            context.setState(context.searchingState);
            return;
        }

        this.targetStats = target.gameObject.getComponent(CharacterStats);
    }

    public onExit(context: NPCController): void {
        this.targetStats = null;
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