import 'jest-canvas-mock';
import { GameObject } from '../src/GameEngine/Core/GameObject';
import { Component } from '../src/GameEngine/Components/Component';
import { Rigidbody } from '../src/GameEngine/Components/Rigidbody';
import { Layer } from '../src/GameEngine/Core/Enums/Layer';
import { PrefabSettings } from '../src/GameEngine/Core/Interfaces/PrefabSettings';
import { Transform } from '../src/GameEngine/Components/Transform';
import { Vector2 } from '../src/GameEngine/Core/Helpers/Vector2';
import { GameEngine } from '../src/GameEngine/Core/GameEngine';
import { Scene } from '../src/GameEngine/Core/Interfaces/Scene';
import { AssetPool } from '../src/GameEngine/Core/Helpers/AssetPool';
import { RectangleBackground } from '../src/GameEngine/Core/Helpers/RectangleBackground';

jest.mock('../src/GameEngine/Core/GameEngine');

class TestComponent extends Component {}

class TestComponent2 extends Component {
    public testData: number = 0;

    public start(): void {
        this.testData++;
    }

    public update(): void {
        this.testData++;
    }
}

class TestGameObject extends GameObject {
    protected buildInitialComponents(): Component[] {
        return [new TestComponent(this)];
    }

    protected getPrefabSettings(): PrefabSettings {
        return {
            x: 0,
            y: 0,
            rotation: 0,
            id: 'test1',
            tag: '',
            layer: Layer.Default
        };
    }
}

class TestGameObject2 extends GameObject {
    protected buildInitialComponents(): Component[] {
        return [new TestComponent2(this)];
    }

    protected buildAndReturnChildGameObjects(gameEngine: GameEngine): GameObject[] {
        return [new TestGameObject(gameEngine)];
    }

    protected getPrefabSettings(): PrefabSettings {
        return {
            x: 50,
            y: 75,
            rotation: 0,
            id: 'test',
            tag: 'testTag',
            layer: Layer.Friendly
        };
    }
}

const scene1: Scene = {
    name: 'Scene1',
    loadOrder: 1,
    terrainSpec: null,

    getSkybox(gameCanvas: HTMLCanvasElement): RectangleBackground {
        return null;
    },

    getStartingGameObjects(gameEngine: GameEngine): GameObject[] {
        return [
            new TestGameObject(gameEngine),
            new TestGameObject2(gameEngine)
        ];
    },

    async getAssetPool(): Promise<AssetPool> {
        return null;
    }
};

let testGameObject: GameObject = null
let testGameObject2: GameObject = null;

beforeAll(async () => {
    const canvas = document.createElement('canvas');

    const gameEngine = new GameEngine(canvas);
    gameEngine.setScenes([scene1]);
    await gameEngine.loadScene(1);

    testGameObject = gameEngine.findGameObjectById('test1');
    testGameObject2 = gameEngine.findGameObjectById('test');
});

test('Tests the creation of a game object.', () => {
    expect(testGameObject).toBeInstanceOf(GameObject);
    expect(testGameObject.id).toBe('test1');
    expect(testGameObject.tag).toBe('');
    expect(testGameObject.enabled).toBe(true);
    expect(testGameObject.layer).toBe(Layer.Default);
    expect(testGameObject.transform).toBeInstanceOf(Transform);
    expect(testGameObject.transform.position).toBeInstanceOf(Vector2);
    expect(testGameObject.transform.position.x).toBe(0);
    expect(testGameObject.transform.position.y).toBe(0);
    expect(testGameObject.transform.rotation).toBe(0);

    expect(testGameObject2).toBeInstanceOf(GameObject);
    expect(testGameObject2.id).toBe('test');
    expect(testGameObject2.tag).toBe('testTag');
    expect(testGameObject2.enabled).toBe(true);
    expect(testGameObject2.layer).toBe(Layer.Friendly);
    expect(testGameObject2.transform).toBeInstanceOf(Transform);
    expect(testGameObject2.transform.position).toBeInstanceOf(Vector2);
    expect(testGameObject2.transform.position.x).toBe(50);
    expect(testGameObject2.transform.position.y).toBe(75);
    expect(testGameObject2.transform.rotation).toBe(0);
});

test('Tests nesting of game objects', () => {
    expect(testGameObject.transform.children.length).toBe(0);
    expect(testGameObject2.transform.children.length).toBe(1);

    expect(testGameObject.transform.parent).toBe(null);
    expect(testGameObject2.transform.parent).toBe(null);
    expect(testGameObject2.transform.children[0].parent).toBe(testGameObject2.transform);
});

test('Tests various GameObject functions', () => {
    expect(testGameObject.hasComponent(TestComponent)).toBe(true);
    expect(testGameObject.hasComponent(Rigidbody)).toBe(false);
    expect(testGameObject.getComponent(TestComponent)).toBeInstanceOf(TestComponent);
    expect(testGameObject.getComponent(Rigidbody)).toBe(null);

    expect(testGameObject2.getComponentInChildren(TestComponent)).toBeInstanceOf(TestComponent);
    expect(testGameObject2.getComponentInChildren(TestComponent2)).toBe(null);

    const childGameObject = testGameObject2.transform.children[0].gameObject;

    expect(childGameObject.getComponentInParent(TestComponent2)).toBeInstanceOf(TestComponent2);
    expect(childGameObject.getComponentInParent(TestComponent2)).toBe(testGameObject2.getComponent(TestComponent2));
});