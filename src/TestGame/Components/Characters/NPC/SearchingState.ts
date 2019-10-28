import { State } from '../../../Interfaces/State';
import { Component } from '../../../../GameEngine/Components/Component';
import { NPCController } from './NPCController';
import { Transform } from '../../../../GameEngine/Components/Transform';
import { CharacterAnimator } from '../CharacterAnimator';
import { GameObject } from '../../../../GameEngine/Core/GameObject';

export class SearchingState extends Component implements State {
    
    private playerTransform: Transform | null = null;
    private readonly animator: CharacterAnimator;


    public constructor(gameObject: GameObject, animator: CharacterAnimator) {
        super(gameObject);

        this.animator = animator;
    }
    
    public start(): void {
        const player = this.findGameObjectById('player');

        if (player === null) {
            throw new Error('Could not find player');
        }

        this.playerTransform = player.transform;
    }
    
    public performBehavior(context: NPCController): void {
        if (this.playerTransform === null) {
            return;
        }

        context.currentTarget = this.playerTransform;
        context.setState(context.chaseState);
    }    
    
    public onEnter(context: NPCController): void {
        this.animator.playIdleAnimation();
    }

    public onExit(context: NPCController): void {
        
    }
}