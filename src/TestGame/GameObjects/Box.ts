import { GameObject } from '../../GameEngine/Core/GameObject';
import { Rigidbody } from '../../GameEngine/Components/Rigidbody';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import { PhysicalMaterial } from '../../GameEngine/Core/Helpers/PhysicalMaterial';
import { Component } from '../../GameEngine/Components/Component';
import { PrefabSettings } from '../../GameEngine/Core/Interfaces/PrefabSettings';
import { Layer } from '../../GameEngine/Core/Enums/Layer';
import { RectangleRenderer } from '../../GameEngine/Components/RectangleRenderer';
import { Color } from '../../GameEngine/Core/Enums/Color';
import { GameEngine } from '../../GameEngine/Core/GameEngine';

export class Box extends GameObject {

    public static buildBox(gameEngine: GameEngine, x: number, y: number, w: number, h: number, id: string, tag: string, color: Color = Color.Grey): Box {
        const box = new Box(gameEngine, id, x, y, 0, tag, Layer.Terrain);
        const renderer = box.getComponent(RectangleRenderer);

        if (renderer === null) {
            throw new Error('Error building box');
        }

        renderer.renderWidth = w;
        renderer.renderHeight = h;
        renderer.color = color;

        const collider = box.getComponent(RectangleCollider);

        if (collider === null) {
            throw new Error('Error building box');
        }

        collider.width = w;
        collider.height = h;
        collider.physicalMaterial = PhysicalMaterial.metal;

        return box;
    }
    
    protected buildInitialComponents(): Component[] {
        const rb = new Rigidbody(this, 100000, true);

        const collider = new RectangleCollider(this, rb, 50, 50);

        const renderer = new RectangleRenderer(this, 50, 50, Color.Grey);

        return [rb, renderer, collider];
    }
    
    protected getPrefabSettings(): PrefabSettings {
        return {
            x: 0,
            y: 0,
            rotation: 0,
            id: 'borders',
            tag: 'borders',
            layer: Layer.Terrain
        };
    }
}