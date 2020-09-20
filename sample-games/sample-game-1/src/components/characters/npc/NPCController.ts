import { Component, GameObject, Transform } from '@entropy-engine/entropy-game-engine';
import { State } from '../../../interfaces/State';
import { CharacterStats } from '../CharacterStats';

export class NPCController extends Component {
  public currentTarget: Transform | null = null;

  private _currentState: State;

  private readonly _searchingState: State;
  private readonly _chaseState: State;
  private readonly _attackState: State;
  private readonly _myStats: CharacterStats;

  public constructor(
    gameObject: GameObject,
    myStats: CharacterStats,
    searchingState: State,
    chaseState: State,
    attackState: State
  ) {
    super(gameObject);

    this._myStats = myStats;
    this._searchingState = searchingState;
    this._chaseState = chaseState;
    this._attackState = attackState;

    this._currentState = searchingState;
    searchingState.onEnter(this);
  }

  public get currentState(): State {
    return this._currentState;
  }

  public get searchingState(): State {
    return this._searchingState;
  }

  public get chaseState(): State {
    return this._chaseState;
  }

  public get attackState(): State {
    return this._attackState;
  }

  public update(): void {
    if (this._myStats.isDead) {
      return;
    }

    this._currentState.performBehavior(this);
  }

  public setState(nextState: State): void {
    this._currentState.onExit(this);
    this._currentState = nextState;
    nextState.onEnter(this);
  }
}
