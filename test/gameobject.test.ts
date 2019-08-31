import { GameObject } from '../src/GameEngine/Core/GameObject';
import { GameEngineAPIs } from '../src/GameEngine/Core/Interfaces/GameEngineAPIs';
import { Component } from '../src/GameEngine/Components/Component';
import { Input } from '../src/GameEngine/Core/Helpers/Input';
import { ObjectManager } from '../src/GameEngine/Core/Helpers/ObjectManager';
import { Terrain } from '../src/GameEngine/Core/Helpers/Terrain';
import { ComponentAnalyzer } from '../src/GameEngine/Core/Helpers/ComponentAnalyzer';
import { SceneManager } from '../src/GameEngine/Core/Helpers/SceneManager';
import { Time } from '../src/GameEngine/Core/Time';
import { Physics } from '../src/GameEngine/Core/Physics/Physics';
import { Rigidbody } from '../src/GameEngine/Components/Rigidbody';
import { Layer } from '../src/GameEngine/Core/Enums/Layer';
import { PrefabSettings } from '../src/GameEngine/Core/Interfaces/PrefabSettings';
import { Transform } from '../src/GameEngine/Components/Transform';
import { Vector2 } from '../src/GameEngine/Core/Helpers/Vector2';

jest.mock('../src/GameEngine/Core/Helpers/Input');
jest.mock('../src/GameEngine/Core/Helpers/ObjectManager');
jest.mock('../src/GameEngine/Core/Helpers/Terrain');
jest.mock('../src/GameEngine/Core/Helpers/ComponentAnalyzer');

const mockApis: GameEngineAPIs = {
    input: null,
    objectManager: null,
    terrain: null,
    componentAnalyzer: new ComponentAnalyzer(null, null),
    gameCanvas: null,
    sceneManager: null,
    time: null,
    physics: null,
    assetPool: null
};

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
    protected buildInitialComponents(gameEngineAPIs: GameEngineAPIs): Component[] {
        return [new TestComponent(this)];
    }
}

class TestGameObject2 extends GameObject {
    protected buildInitialComponents(gameEngineAPIs: GameEngineAPIs): Component[] {
        return [new TestComponent2(this)];
    }

    protected buildAndReturnChildGameObjects(gameEngineAPIs: GameEngineAPIs): GameObject[] {
        return [new TestGameObject(gameEngineAPIs)];
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

const testGameObject = new TestGameObject(mockApis);
const testGameObject2 = new TestGameObject2(mockApis);

test('Tests the creation of a game object.', () => {
    expect(testGameObject).toBeInstanceOf(GameObject);
    expect(testGameObject.id).toBe('');
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