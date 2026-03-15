import { Component, GameObject, Transform } from '@entropy-engine/entropy-game-engine';
import type { IState } from '../../../types';
import { CharacterStats } from '../CharacterStats';

export class NPCController extends Component {
  public currentTarget: Transform | null = null;

  private readonly myStats: CharacterStats;

  #currentState: IState;

  readonly #searchingState: IState;

  readonly #chaseState: IState;

  readonly #attackState: IState;

  public constructor(
    gameObject: GameObject,
    myStats: CharacterStats,
    searchingState: IState,
    chaseState: IState,
    attackState: IState
  ) {
    super(gameObject);

    this.myStats = myStats;
    this.#searchingState = searchingState;
    this.#chaseState = chaseState;
    this.#attackState = attackState;

    this.#currentState = searchingState;
    searchingState.onEnter(this);
  }

  public get currentState(): IState {
    return this.#currentState;
  }

  public get searchingState(): IState {
    return this.#searchingState;
  }

  public get chaseState(): IState {
    return this.#chaseState;
  }

  public get attackState(): IState {
    return this.#attackState;
  }

  public override update(): void {
    if (this.myStats.isDead) {
      return;
    }

    this.#currentState.performBehavior(this);
  }

  public setState(nextState: IState): void {
    this.#currentState.onExit(this);
    this.#currentState = nextState;
    nextState.onEnter(this);
  }
}
