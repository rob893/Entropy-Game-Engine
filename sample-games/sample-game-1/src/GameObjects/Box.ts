import {
    GameObject,
    GameEngine,
    Color,
    Layer,
    RectangleRenderer,
    RectangleCollider,
    PhysicalMaterial,
    Component,
    Rigidbody,
    PrefabSettings
} from '@entropy-engine/entropy-game-engine';

export class Box extends GameObject {
    public static buildBox(
        gameEngine: GameEngine,
        x: number,
        y: number,
        w: number,
        h: number,
        id: string,
        tag: string,
        color: Color = Color.Grey
    ): Box {
        const box = new Box({ gameEngine, id, x, y, rotation: 0, tag, layer: Layer.Terrain });
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
