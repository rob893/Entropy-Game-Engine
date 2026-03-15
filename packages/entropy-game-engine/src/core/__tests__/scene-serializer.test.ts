import 'vitest-canvas-mock';
import type { Component } from '../../components/Component';
import { GameObject, RectangleCollider, Rigidbody } from '../../index';
import { GameEngine } from '../GameEngine';
import { SceneSerializer } from '../SceneSerializer';
import { Layer } from '../enums/Layer';
import { AssetPool } from '../helpers/AssetPool';
import { PhysicalMaterial } from '../helpers/PhysicalMaterial';
import type { IPrefabSettings } from '../types';
import type { IScene } from '../types';
import type { ISerializedScene } from '../types';

class SceneSerializerTestGameObject extends GameObject {
  protected override getPrefabSettings(): IPrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      name: 'scene-serializer-object',
      tag: 'scene-serializer',
      layer: Layer.Default
    };
  }

  protected override buildInitialComponents(): Component[] {
    return [];
  }
}

function createEmptyAssetPool(): AssetPool {
  return new AssetPool(new Map<string, unknown>());
}

function createGameEngine(): GameEngine {
  const gameCanvas = document.createElement('canvas');
  gameCanvas.width = 800;
  gameCanvas.height = 600;
  return new GameEngine({ gameCanvas });
}

async function createInitializedEngine(): Promise<GameEngine> {
  const engine = createGameEngine();
  const bootstrapScene: IScene = {
    name: 'Bootstrap',
    loadOrder: 0,
    terrainSpec: null,
    getStartingGameObjects: () => [],
    getAssetPool: () => Promise.resolve(createEmptyAssetPool())
  };

  engine.setScenes([bootstrapScene]);
  await engine.loadScene(0);
  return engine;
}

function buildSerializableObject(gameEngine: GameEngine, includeChild: boolean = false): SceneSerializerTestGameObject {
  const gameObject = new SceneSerializerTestGameObject({
    gameEngine,
    name: 'Player',
    x: 10,
    y: 20,
    tag: 'player',
    layer: Layer.Friendly
  });

  gameObject.transform.rotation = Math.PI / 4;
  gameObject.transform.scale.x = 2;
  gameObject.transform.scale.y = 3;

  const rigidbody = gameObject.addComponent<Rigidbody>(new Rigidbody(gameObject, 5, true));
  rigidbody.velocity.x = 3;
  rigidbody.velocity.y = -2;
  rigidbody.useGravity = true;
  rigidbody.drag = 0.25;

  const collider = gameObject.addComponent<RectangleCollider>(new RectangleCollider(gameObject, rigidbody, 20, 30, 4, 6));
  collider.isTrigger = true;
  collider.physicalMaterial = new PhysicalMaterial(0.2, 0.4, 0.6);

  if (includeChild) {
    const child = new SceneSerializerTestGameObject({
      gameEngine,
      name: 'Child',
      x: 12,
      y: 24,
      tag: 'child',
      layer: Layer.Friendly
    });
    child.transform.parent = gameObject.transform;
  }

  return gameObject;
}

test('serializes a simple scene to JSON', async () => {
  const engine = createGameEngine();
  const codeDefinedScene: IScene = {
    name: 'Code Scene',
    loadOrder: 1,
    terrainSpec: null,
    getStartingGameObjects: gameEngine => [buildSerializableObject(gameEngine, true)],
    getAssetPool: () => Promise.resolve(createEmptyAssetPool())
  };

  engine.setScenes([codeDefinedScene]);
  await engine.loadScene(1);

  const serializedScene = SceneSerializer.serializeScene(engine, 'Exported Scene', 42);

  expect(serializedScene).toMatchObject({
    name: 'Exported Scene',
    sceneId: 42,
    gravity: 665
  });
  expect(serializedScene.gameObjects).toHaveLength(1);
  expect(serializedScene.gameObjects[0].children).toHaveLength(1);
  expect(serializedScene.gameObjects[0].components.some(component => component.typeName === 'Rigidbody')).toBe(true);
});

test('deserializes JSON back to a Scene object', async () => {
  const sourceEngine = await createInitializedEngine();
  const serializedGameObject = buildSerializableObject(sourceEngine).serialize();
  const jsonScene: ISerializedScene = {
    name: 'JSON Scene',
    sceneId: 5,
    gravity: 123,
    gameObjects: [JSON.parse(JSON.stringify(serializedGameObject))]
  };

  const engine = createGameEngine();
  engine.setScenes([SceneSerializer.createSceneFromJSON(jsonScene)]);
  await engine.loadScene(5);

  const loadedGameObject = engine.findGameObjectById(serializedGameObject.id);

  expect(engine.loadedSceneId).toBe(5);
  expect(engine.gravity).toBe(123);
  expect(loadedGameObject).not.toBeNull();
  expect(loadedGameObject?.serialize()).toEqual(jsonScene.gameObjects[0]);
  expect(loadedGameObject?.getComponent(Rigidbody)).toBeInstanceOf(Rigidbody);
  expect(loadedGameObject?.getComponent(RectangleCollider)).toBeInstanceOf(RectangleCollider);
});

test('SceneSerializer.toJSON produces valid JSON output with no circular references', async () => {
  const engine = createGameEngine();
  const codeDefinedScene: IScene = {
    name: 'Code Scene',
    loadOrder: 3,
    terrainSpec: null,
    getStartingGameObjects: gameEngine => [buildSerializableObject(gameEngine)],
    getAssetPool: () => Promise.resolve(createEmptyAssetPool())
  };

  engine.setScenes([codeDefinedScene]);
  await engine.loadScene(3);

  const json = SceneSerializer.toJSON(engine, 'JSON Output', 77);
  const parsedJson = JSON.parse(json) as ISerializedScene;

  expect(parsedJson).toEqual(SceneSerializer.serializeScene(engine, 'JSON Output', 77));
});

test('code-defined scenes still work alongside JSON scenes', async () => {
  const sourceEngine = await createInitializedEngine();
  const serializedGameObject = buildSerializableObject(sourceEngine).serialize();

  const codeDefinedScene: IScene = {
    name: 'Code Scene',
    loadOrder: 1,
    terrainSpec: null,
    getStartingGameObjects: gameEngine => [
      new SceneSerializerTestGameObject({
        gameEngine,
        name: 'Code Scene Object',
        tag: 'code-defined',
        layer: Layer.Default
      })
    ],
    getAssetPool: () => Promise.resolve(createEmptyAssetPool())
  };

  const jsonScene = SceneSerializer.createSceneFromJSON({
    name: 'JSON Scene',
    sceneId: 2,
    gameObjects: [serializedGameObject]
  });

  const engine = createGameEngine();
  engine.setScenes([codeDefinedScene, jsonScene]);

  await engine.loadScene(1);
  expect(engine.findGameObjectWithTag('code-defined')?.name).toBe('Code Scene Object');

  await engine.loadScene(2);
  expect(engine.findGameObjectById(serializedGameObject.id)).not.toBeNull();
});
