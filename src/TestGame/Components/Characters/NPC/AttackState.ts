import { State } from '../../../Interfaces/State';
import { Component } from '../../../../GameEngine/Components/Component';
import { NPCController } from './NPCController';
import { CharacterAnimator } from '../CharacterAnimator';
import { GameObject } from '../../../../GameEngine/Core/GameObject';
import { Vector2 } from '../../../../GameEngine/Core/Helpers/Vector2';
import { Transform } from '../../../../GameEngine/Components/Transform';

export class AttackState extends Component implements State {
    
    private readonly animator: CharacterAnimator;
    private attackTimer: number = 0;


    public constructor(gameObject: GameObject, animator: CharacterAnimator) {
        super(gameObject);

        this.animator = animator;
    }
    
    public performBehavior(context: NPCController): void {
        if (context.currentTarget === null) {
            context.setState(context.searchingState);
            return;
        }

        if (Vector2.distance(this.transform.position, context.currentTarget.position) > 50) {
            context.setState(context.chaseState);
            return;
        }

        this.attackTimer += this.time.deltaTime;

        if (this.attackTimer < 1.25) {
            this.animator.playIdleAnimation();
            return;
        }

        this.faceTarget(context.currentTarget);
        this.attackTimer = 0;
        this.animator.playRandomAttackAnimation();
    }    
    
    public onEnter(context: NPCController): void {
        this.attackTimer = 0;
    }

    public onExit(context: NPCController): void {
    }

    private faceTarget(target: Transform): void {
        if (target.position.x < this.transform.position.x) {
            this.animator.faceLeft();
        }
        else {
            this.animator.faceRight();
        }
    }
}