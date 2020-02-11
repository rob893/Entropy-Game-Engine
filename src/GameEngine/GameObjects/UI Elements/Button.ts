import { GameObject } from '../GameObject';
import { Component } from '../../Components/Component';
import { RectangleCollider } from '../../Components/RectangleCollider';
import { RectangleRenderer } from '../../Components/RectangleRenderer';
import { Color } from '../../Core/Enums/Color';
import { PrefabSettings } from '../../Core/Interfaces/PrefabSettings';
import { Layer } from '../../Core/Enums/Layer';
import { ClickedOnDetector } from '../../Components/ClickedOnDetector';
import { TextRenderer } from '../../Components/TextRenderer';
import { GameObjectConstructionParams } from '../../Core/Interfaces/GameObjectConstructionParams';

export class Button extends GameObject {

    public height: number;
    public width: number;


    public constructor(config: GameObjectConstructionParams & { height?: number, width?: number }) {
        super(config);

        this.height = config.height || 50;
        this.width = config.width || 50;
    }

    protected buildInitialComponents(): Component[] {
        const collider = new RectangleCollider(this, null, this.width, this.height);

        const renderer = new RectangleRenderer(this, this.width, this.height, Color.Grey);

        const clickedOnDetector = new ClickedOnDetector(this, collider);

        const textRenderer = new TextRenderer(this, { fontColor: Color.Amber, text: 'Button', x: this.transform.position.x, y: this.transform.position.y });

        this.transform.onMoved.add(() => {
            textRenderer.x = this.transform.position.x;
            textRenderer.y = this.transform.position.y;
        });

        return [renderer, collider, clickedOnDetector, textRenderer];
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