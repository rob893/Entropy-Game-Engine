import { GameObject } from '../../GameEngine/Core/GameObject';
import { Component } from '../../GameEngine/Components/Component';
import { RectangleRenderer } from '../../GameEngine/Components/RectangleRenderer';
import { APIs } from '../../GameEngine/Core/Interfaces/APIs';

export class Weapon extends GameObject {

    protected buildInitialComponents(apis: APIs): Component[] {
        return [new RectangleRenderer(this, 15, 10, 'white')];
    }
}