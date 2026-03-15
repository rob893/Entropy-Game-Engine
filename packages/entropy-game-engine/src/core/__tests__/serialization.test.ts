import 'vitest-canvas-mock';
import { AssetPool } from '../helpers/AssetPool';
import { GameEngine } from '../GameEngine';
import { Layer } from '../enums/Layer';
import type { IPrefabSettings } from '../types';
import type { IScene } from '../types';
import type { ISerializedGameObject } from '../types';
import type { RectangleBackground } from '../helpers/RectangleBackground';
import type { Component } from '../../components/Component';
import { GameObject, RectangleCollider, Rigidbody } from '../../index';
import { PhysicalMaterial } from '../helpers/PhysicalMaterial';

class SerializableTestGameObject extends GameObject {
  protected override getPrefabSettings(): IPrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      name: 'serializable-object',
      tag: 'serializable',
      layer: Layer.Default
    };
  }

  protected override buildInitialComponents(): Component[] {
    return [];
  }
}

const serializationScene: IScene = {
  name: 'SerializationScene',
  loadOrder: 99,
  terrainSpec: null,

  getSkybox(_gameEngine: GameEngine): RectangleBackground {
    return null!;
  },

  getStartingGameObjects(): GameObject[] {
    return [];
  },

  getAssetPool(): Promise<AssetPool> {
    return Promise.resolve(new AssetPool(new Map<string, unknown>()));
  }
};

let gameEngine: GameEngine = null!;

beforeAll(async () => {
  const gameCanvas = document.createElement('canvas');
  gameEngine = new GameEngine({ gameCanvas });
  gameEngine.setScenes([serializationScene]);
  await gameEngine.loadScene(99);
});

function buildSerializableObject(): SerializableTestGameObject {
  const gameObject = new SerializableTestGameObject({
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

  const collider = gameObject.addComponent<RectangleCollider>(
    new RectangleCollider(gameObject, rigidbody, 20, 30, 4, 6)
  );
  collider.isTrigger = true;
  collider.physicalMaterial = new PhysicalMaterial(0.2, 0.4, 0.6);

  return gameObject;
}

test('serializes a GameObject with Transform, Rigidbody, and RectangleCollider', () => {
  const gameObject = buildSerializableObject();

  expect(gameObject.serialize()).toEqual({
    id: gameObject.id,
    name: 'Player',
    tag: 'player',
    layer: Layer.Friendly,
    enabled: true,
    components: [
      {
        typeName: 'Transform',
        data: {
          position: { x: 10, y: 20 },
          rotation: Math.PI / 4,
          scale: { x: 2, y: 3 },
          localPosition: { x: 0, y: 0 },
          parentId: null
        }
      },
      {
        typeName: 'Rigidbody',
        data: {
          mass: 5,
          velocity: { x: 3, y: -2 },
          useGravity: true,
          isKinematic: true,
          drag: 0.25
        }
      },
      {
        typeName: 'RectangleCollider',
        data: {
          width: 20,
          height: 30,
          offset: { x: 4, y: 6 },
          isTrigger: true,
          attachedRigidbodyId: gameObject.id,
          physicalMaterial: {
            dynamicFriction: 0.2,
            staticFriction: 0.4,
            bounciness: 0.6
          }
        }
      }
    ],
    children: []
  });
});

test('serialized GameObject output is valid JSON with no circular references', () => {
  const serialized = buildSerializableObject().serialize();

  expect(() => JSON.stringify(serialized)).not.toThrow();
  expect(JSON.parse(JSON.stringify(serialized))).toEqual(serialized);
});

test('roundtrips through JSON stringify/parse and deserialize', () => {
  const serialized = JSON.parse(JSON.stringify(buildSerializableObject().serialize())) as ISerializedGameObject;
  const deserializedObject = new SerializableTestGameObject({ gameEngine });

  deserializedObject.deserialize(serialized);

  expect(deserializedObject.serialize()).toEqual(serialized);
  expect(deserializedObject.getComponent(Rigidbody)).toBeInstanceOf(Rigidbody);
  expect(deserializedObject.getComponent(RectangleCollider)).toBeInstanceOf(RectangleCollider);
  expect(deserializedObject.transform.rotation).toBe(Math.PI / 4);
  expect(deserializedObject.transform.scale.x).toBe(2);
  expect(deserializedObject.transform.scale.y).toBe(3);
});
