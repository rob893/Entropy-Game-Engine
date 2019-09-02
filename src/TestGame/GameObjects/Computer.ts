import { GameObject } from '../../GameEngine/Core/GameObject';
import { Component } from '../../GameEngine/Components/Component';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import { ComputerMotor } from '../Components/ComputerMotor';
import { RectangleRenderer } from '../../GameEngine/Components/RectangleRenderer';
import { PrefabSettings } from '../../GameEngine/Core/Interfaces/PrefabSettings';
import { Layer } from '../../GameEngine/Core/Enums/Layer';


export class Computer extends GameObject {

    protected buildInitialComponents(): Component[] {
        const computerComponents: Component[] = [];
        
        const collider = new RectangleCollider(this, null, 10, 50);
        computerComponents.push(collider);

        computerComponents.push(new ComputerMotor(this, collider));
        computerComponents.push(new RectangleRenderer(this, 10, 50, 'white'));

        return computerComponents;
    }

    protected getPrefabSettings(): PrefabSettings {
        return {
            x: 688,
            y: 175,
            rotation: 0,
            id: 'computer',
            tag: '',
            layer: Layer.Default
        };
    }
}