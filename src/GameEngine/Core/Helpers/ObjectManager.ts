import { GameObject } from '../GameObject';
import { GameEngine } from '../GameEngine';
import { Vector2 } from './Vector2';
import { Transform } from '../../Components/Transform';

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

    public instantiate(newGameObject: GameObject, position: Vector2 = Vector2.zero, rotation: number = 0, parent: Transform = null): GameObject {
        newGameObject.transform.setPosition(position.x, position.y);
        newGameObject.transform.rotation = rotation;
        newGameObject.transform.parent = parent;
        
        return this.gameEngine.instantiate(newGameObject);
    }
}