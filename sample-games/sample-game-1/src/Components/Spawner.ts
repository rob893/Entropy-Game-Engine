import { GameObject, Component, GameObjectConstructionParams, Vector2 } from '@entropy-engine/entropy-game-engine';

export class Spawner extends Component {
  public spawnRate = 10;
  public spawnX = 725;
  public spawnY = 350;

  private cancelToken = { cancel: false };
  private readonly objectsToSpawn: (new (constructionParams: GameObjectConstructionParams) => GameObject)[];

  public constructor(
    gameObject: GameObject,
    objectsToSpawn: (new (constructionParams: GameObjectConstructionParams) => GameObject)[]
  ) {
    super(gameObject);

    this.objectsToSpawn = objectsToSpawn;
  }

  public start(): void {
    this.invokeRepeating(() => this.spawn(), this.spawnRate, this.cancelToken);
  }

  public stopSpawning(): void {
    this.cancelToken.cancel = true;
  }

  public startSpawning(): void {
    if (!this.cancelToken.cancel) {
      return; //Don't want to start again if already spawning.
    }

    this.cancelToken.cancel = false;
    this.invokeRepeating(() => this.spawn(), this.spawnRate, this.cancelToken);
  }

  public toggleSpawn(): void {
    if (this.cancelToken.cancel) {
      this.startSpawning();
    } else {
      this.stopSpawning();
    }
  }

  private spawn(): void {
    const ranIndex = Math.floor(Math.random() * this.objectsToSpawn.length);
    const objectToSpawn = this.objectsToSpawn[ranIndex];
    this.instantiate(objectToSpawn, new Vector2(this.spawnX, this.spawnY));
  }
}
