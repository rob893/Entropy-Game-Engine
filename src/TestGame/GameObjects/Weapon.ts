import { GameObject } from '../../GameEngine/GameObjects/GameObject';
import { RectangleRenderer } from '../../GameEngine/Components/RectangleRenderer';
import { PrefabSettings } from '../../GameEngine/Core/Interfaces/PrefabSettings';
import { Layer } from '../../GameEngine/Core/Enums/Layer';
import { Component } from '../../GameEngine/Components/Component';

export class Weapon extends GameObject {

    protected buildInitialComponents(): Component[] {
        return [new RectangleRenderer(this, 15, 10, 'white')];
    }
    
    protected getPrefabSettings(): PrefabSettings {
        return {
            x: 0,
            y: 0,
            rotation: 0,
            id: 'weapon',
            tag: '',
            layer: Layer.Default
        };
    }
}