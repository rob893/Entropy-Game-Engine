import { GameObject } from '../../GameEngine/Core/GameObject';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import { Color } from '../../GameEngine/Core/Enums/Color';
import { RectangleRenderer } from '../../GameEngine/Components/RectangleRenderer';
import { Component } from '../../GameEngine/Components/Component';
import { PrefabSettings } from '../../GameEngine/Core/Interfaces/PrefabSettings';
import { Layer } from '../../GameEngine/Core/Enums/Layer';

export class Ground extends GameObject {

    protected buildInitialComponents(): Component[] {
        return [new RectangleCollider(this, null, 20, 20), new RectangleRenderer(this, 20, 20, Color.Brown)];
    }

    protected getPrefabSettings(): PrefabSettings {
        return {
            x: 0,
            y: 0,
            rotation: 0,
            id: 'ground',
            tag: 'ground',
            layer: Layer.Terrain
        };
    }
}