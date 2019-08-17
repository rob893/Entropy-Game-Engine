import { GameObject } from '../../GameEngine/Core/GameObject';
import { Component } from '../../GameEngine/Components/Component';
import { RectangleRenderer } from '../../GameEngine/Components/RectangleRenderer';

export class Weapon extends GameObject {

    public constructor(id: string = 'weapon') {
        super(id);

        const weaponComponents: Component[] = [];
        
        weaponComponents.push(new RectangleRenderer(this, 15, 10, 'white'));

        this.setComponents(weaponComponents);
    }
}