import { State } from '../../../Interfaces/State';
import { Component } from '../../../../GameEngine/Components/Component';
import { NPCController } from './NPCController';
import { CharacterAnimator } from '../CharacterAnimator';
import { GameObject } from '../../../../GameEngine/Core/GameObject';

export class SearchingState extends Component implements State {
    
    private timer = 0;
    private readonly animator: CharacterAnimator;


    public constructor(gameObject: GameObject, animator: CharacterAnimator) {
        super(gameObject);

        this.animator = animator;
    }
    
    public performBehavior(context: NPCController): void {
        this.timer += this.time.deltaTime;

        if (this.timer < 1) {
            return;
        }
        
        const player = this.findGameObjectById('player');

        if (player === null) {
            return;
        }

        context.currentTarget = player.transform;
        context.setState(context.chaseState);
    }    
    
    public onEnter(context: NPCController): void {
        this.animator.playIdleAnimation();
        this.timer = 0;
        context.currentTarget = null;
    }

    public onExit(context: NPCController): void {
        this.timer = 0;
    }
}