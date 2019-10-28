import { State } from '../../../Interfaces/State';
import { Component } from '../../../../GameEngine/Components/Component';
import { NPCController } from './NPCController';
import { NavAgent } from '../../../../GameEngine/Components/NavAgent';
import { Vector2 } from '../../../../GameEngine/Core/Helpers/Vector2';
import { GameObject } from '../../../../GameEngine/Core/GameObject';
import { CharacterAnimator } from '../CharacterAnimator';

export class ChaseState extends Component implements State {
    
    private readonly navAgent: NavAgent;
    private readonly animator: CharacterAnimator;
    private timer: number = 0;


    public constructor(gameObject: GameObject, navAgent: NavAgent, animator: CharacterAnimator) {
        super(gameObject);

        this.navAgent = navAgent;
        this.animator = animator;

        this.navAgent.onDirectionChanged.add((newDirection) => this.changeAnimation(newDirection));
        this.navAgent.onPathCompleted.add(() => this.animator.playIdleAnimation());
    }
    
    public performBehavior(context: NPCController): void {
        if (context.currentTarget === null) {
            context.setState(context.searchingState);
            return;
        }

        if (Vector2.distance(this.transform.position, context.currentTarget.position) < 50) {
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

    }

    public onExit(context: NPCController): void {

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