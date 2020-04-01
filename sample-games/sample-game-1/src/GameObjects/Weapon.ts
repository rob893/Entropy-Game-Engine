import { GameObject, Component, RectangleRenderer, PrefabSettings, Layer } from '@rherber/typescript-game-engine/src';

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
