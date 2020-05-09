import { GameEngine } from '../GameEngine';

export class SceneManager {
  private readonly gameEngine: GameEngine;

  public get loadedSceneId(): number {
    return this.gameEngine.loadedSceneId;
  }

  public constructor(gameEngine: GameEngine) {
    this.gameEngine = gameEngine;
  }

  public async loadScene(loadOrderOrName: number | string): Promise<void> {
    await this.gameEngine.loadScene(loadOrderOrName);
  }

  public togglePause(): void {
    this.gameEngine.togglePause();
  }

  public printGameData(): void {
    this.gameEngine.printGameData();
  }
}
