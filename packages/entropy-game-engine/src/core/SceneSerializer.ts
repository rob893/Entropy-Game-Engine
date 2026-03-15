import { GameObject } from '../game-objects/GameObject';
import { Terrain } from '../game-objects/Terrain';
import type { GameEngine } from './GameEngine';
import { AssetPool } from './helpers/AssetPool';
import type { IScene } from './types';
import type { ISerializedScene, ISerializedTerrain } from './types';
import type { ISpriteData } from './types';
import type { ITerrainCell } from './types';
import type { ITerrainSpec } from './types';

type LegacyTerrainSpec = Required<Pick<ITerrainSpec, 'spriteSheetUrl' | 'scale' | 'cellSize' | 'getSpec'>>;

type JSONTerrainSpec = Required<Pick<ITerrainSpec, 'tileWidth' | 'tileHeight' | 'grid'>> & Pick<ITerrainSpec, 'tileSet'>;

export class SceneSerializer {
  public static serializeScene(engine: GameEngine, name: string, sceneId: number): ISerializedScene {
    const serializedScene: ISerializedScene = {
      name,
      sceneId,
      gameObjects: engine.gameObjects
        .filter(gameObject => gameObject.transform.parent === null && !(gameObject instanceof Terrain))
        .map(gameObject => gameObject.serialize())
    };

    if (engine.currentScene !== null) {
      serializedScene.gravity = engine.gravity;
    }

    const terrain = engine.currentScene?.terrainSpec ? this.serializeTerrain(engine.currentScene.terrainSpec) : undefined;

    if (terrain !== undefined) {
      serializedScene.terrain = terrain;
    }

    return serializedScene;
  }

  public static createSceneFromJSON(data: ISerializedScene): IScene {
    return {
      sceneId: data.sceneId,
      loadOrder: data.sceneId,
      name: data.name,
      gravity: data.gravity,
      terrainSpec: data.terrain ? this.createTerrainSpec(data.terrain) : null,
      getStartingGameObjects: (engine: GameEngine) => data.gameObjects.map(gameObject => GameObject.deserialize(gameObject, engine)),
      getAssetPool: () => Promise.resolve(new AssetPool(new Map<string, unknown>()))
    };
  }

  public static fromJSON(json: string): IScene {
    const data = JSON.parse(json) as ISerializedScene;
    return this.createSceneFromJSON(data);
  }

  public static toJSON(engine: GameEngine, name: string, sceneId: number): string {
    return JSON.stringify(this.serializeScene(engine, name, sceneId), null, 2);
  }

  private static createTerrainSpec(data: ISerializedTerrain): ITerrainSpec {
    return {
      tileWidth: data.tileWidth,
      tileHeight: data.tileHeight,
      grid: data.grid.map(row => [...row]),
      tileSet: data.tileSet === undefined ? undefined : { ...data.tileSet }
    };
  }

  private static serializeTerrain(terrainSpec: ITerrainSpec): ISerializedTerrain | undefined {
    if (this.isJSONTerrainSpec(terrainSpec)) {
      return {
        tileWidth: terrainSpec.tileWidth,
        tileHeight: terrainSpec.tileHeight,
        grid: terrainSpec.grid.map(row => [...row]),
        tileSet: terrainSpec.tileSet === undefined ? undefined : { ...terrainSpec.tileSet }
      };
    }

    if (!this.isLegacyTerrainSpec(terrainSpec)) {
      return undefined;
    }

    const tileSet: Record<number, string> = {};
    const tileIds = new Map<string, number>();
    let nextTileId = 1;

    const grid = terrainSpec.getSpec().map(row =>
      row.map(cell => {
        if (cell === null) {
          return 0;
        }

        const tileId = this.getLegacyTerrainTileId(cell, terrainSpec.spriteSheetUrl, tileIds, tileSet, () => nextTileId++);
        return cell.passable ? tileId : -tileId;
      })
    );

    return {
      tileWidth: terrainSpec.cellSize * terrainSpec.scale,
      tileHeight: terrainSpec.cellSize * terrainSpec.scale,
      grid,
      tileSet: Object.keys(tileSet).length === 0 ? undefined : tileSet
    };
  }

  private static getLegacyTerrainTileId(
    cell: ITerrainCell,
    spriteSheetUrl: string,
    tileIds: Map<string, number>,
    tileSet: Record<number, string>,
    getNextTileId: () => number
  ): number {
    const key = JSON.stringify(cell.spriteData);
    const existingTileId = tileIds.get(key);

    if (existingTileId !== undefined) {
      return existingTileId;
    }

    const tileId = getNextTileId();
    tileIds.set(key, tileId);
    tileSet[tileId] = this.toSpriteSheetTilePath(spriteSheetUrl, cell.spriteData);
    return tileId;
  }

  private static toSpriteSheetTilePath(spriteSheetUrl: string, spriteData: ISpriteData): string {
    return `${spriteSheetUrl}#${spriteData.sliceX},${spriteData.sliceY},${spriteData.sliceWidth},${spriteData.sliceHeight}`;
  }

  private static isJSONTerrainSpec(terrainSpec: ITerrainSpec): terrainSpec is JSONTerrainSpec {
    return (
      typeof terrainSpec.tileWidth === 'number' &&
      typeof terrainSpec.tileHeight === 'number' &&
      Array.isArray(terrainSpec.grid)
    );
  }

  private static isLegacyTerrainSpec(terrainSpec: ITerrainSpec): terrainSpec is LegacyTerrainSpec {
    return (
      typeof terrainSpec.spriteSheetUrl === 'string' &&
      typeof terrainSpec.scale === 'number' &&
      typeof terrainSpec.cellSize === 'number' &&
      typeof terrainSpec.getSpec === 'function'
    );
  }
}
