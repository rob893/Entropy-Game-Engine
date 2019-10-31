import { GameObject } from '../../GameEngine/Core/GameObject';
import { PrefabSettings } from '../../GameEngine/Core/Interfaces/PrefabSettings';
import { Component } from '../../GameEngine/Components/Component';
import { Slider } from '../../GameEngine/Components/Slider';
import { Color } from '../../GameEngine/Core/Enums/Color';
import { Layer } from '../../GameEngine/Core/Enums/Layer';

export class Healthbar extends GameObject {
      
    protected buildInitialComponents(): Component[] {
        return [new Slider(this, 46, 8, Color.Green, Color.Red)];
    }

    protected getPrefabSettings(): PrefabSettings {
        return {
            x: 0,
            y: 0,
            rotation: 0,
            id: 'healthbar',
            tag: 'healthbar',
            layer: Layer.UI
        };
    }
}