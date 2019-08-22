import { GameObject } from '../src/GameEngine/Core/GameObject';
import { GameEngine } from '../src/GameEngine/Core/GameEngine';
import { GameEngineAPIs } from '../src/GameEngine/Core/Interfaces/GameEngineAPIs';
import { Component } from '../src/GameEngine/Components/Component';

jest.mock('../src/GameEngine/Core/GameEngine');

const mockGameEngine = new GameEngine(null) as jest.Mocked<GameEngine>;

class TestComponent extends Component {}

class TestGameObject extends GameObject {
    protected buildInitialComponents(gameEngineAPIs: GameEngineAPIs): Component[] {
        return [new TestComponent(this)];
    }
}

test('Tests the creation of a game object.', () => {
    
    
    //const testGameObject = new TestGameObject()
    
    //expect()
});