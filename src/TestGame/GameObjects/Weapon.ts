import { GameObject } from '../../GameEngine/Core/GameObject';
import { RectangleRenderer } from '../../GameEngine/Components/RectangleRenderer';
import { PrefabSettings } from '../../GameEngine/Core/Interfaces/PrefabSettings';
import { Layer } from '../../GameEngine/Core/Enums/Layer';

export class Weapon extends GameObject {

    protected getPrefabSettings(): PrefabSettings {
        
        return {
            x: 0,
            y: 0,
            rotation: 0,
            id: 'weapon',
            tag: '',
            layer: Layer.Default,
            components: [new RectangleRenderer(this, 15, 10, 'white')]
        };
    }
}