import { GameObject } from '../GameObject';
import { Component } from '../../Components/Component';
import { RectangleCollider } from '../../Components/RectangleCollider';
import { RectangleRenderer } from '../../Components/RectangleRenderer';
import { Color } from '../../Core/Enums/Color';
import { PrefabSettings } from '../../Core/Interfaces/PrefabSettings';
import { Layer } from '../../Core/Enums/Layer';
import { ClickedOnDetector } from '../../Components/ClickedOnDetector';

export class Button extends GameObject {
    protected buildInitialComponents(): Component[] {
        const collider = new RectangleCollider(this, null, 50, 50);

        const renderer = new RectangleRenderer(this, 50, 50, Color.Grey);

        const clickedOnDetector = new ClickedOnDetector(this, collider);

        return [renderer, collider, clickedOnDetector];
    }
    
    protected getPrefabSettings(): PrefabSettings {
        return {
            x: 0,
            y: 0,
            rotation: 0,
            id: 'button',
            tag: 'ui',
            layer: Layer.UI
        };
    }
}