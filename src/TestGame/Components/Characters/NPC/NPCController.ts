import { Component } from '../../../../GameEngine/Components/Component';
import { State } from '../../../Interfaces/State';
import { SearchingState } from './SearchingState';
import { AttackState } from './AttackState';
import { ChaseState } from './ChaseState';
import { Transform } from '../../../../GameEngine/Components/Transform';

export class NPCController extends Component {

    public currentTarget: Transform | null = null;
    
    private _currentState: State | null = null;

    private _searchingState: State | null = null;
    private _chaseState: State | null = null;
    private _attackState: State | null = null;

    
    public get currentState(): State {
        if (this._currentState === null) {
            throw new Error('No current state assigned!');
        }

        return this._currentState;
    }
    
    public get searchingState(): State {
        if (this._searchingState === null) {
            throw new Error('No seaching state assigned!');
        }

        return this._searchingState;
    }

    public get chaseState(): State {
        if (this._chaseState === null) {
            throw new Error('No chase state assigned!');
        }

        return this._chaseState;
    }

    public get attackState(): State {
        if (this._attackState === null) {
            throw new Error('No attack state assigned!');
        }

        return this._attackState;
    }

    public start(): void {
        this._searchingState = this.gameObject.getComponent(SearchingState);
        this._chaseState = this.gameObject.getComponent(ChaseState);
        this._attackState = this.gameObject.getComponent(AttackState);

        this._currentState = this.searchingState;
    }

    public update(): void {
        this.currentState.performBehavior(this);
    }

    public setState(nextState: State): void {
        this.currentState.onExit(this);
        this._currentState = nextState;
        nextState.onEnter(this);
    }
}