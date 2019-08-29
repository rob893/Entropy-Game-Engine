import { GameObject } from '../GameObject';
import { GameEngine } from '../GameEngine';
import { Vector2 } from './Vector2';
import { Transform } from '../../Components/Transform';
import { GameEngineAPIs } from '../Interfaces/GameEngineAPIs';

export class ObjectManager {

    private readonly gameEngine: GameEngine;


    public constructor(gameEngine: GameEngine) {
        this.gameEngine = gameEngine;
    }

    public findGameObjectById(id: string): GameObject {
        return this.gameEngine.findGameObjectById(id);
    }

    public findGameObjectWithTag(tag: string): GameObject {
        return this.gameEngine.findGameObjectWithTag(tag);
    }

    public findGameObjectsWithTag(tag: string): GameObject[] {
        return this.gameEngine.findGameObjectsWithTag(tag);
    }

    public instantiate<T extends GameObject>(type: new (gameEngineAPIs: GameEngineAPIs) => T, position?: Vector2, rotation?: number, parent?: Transform): GameObject {
        return this.gameEngine.instantiate(type, position, rotation, parent);
    }

    public destroy(object: GameObject, time: number = 0): void {
        this.gameEngine.destroy(object, time);
    }
}