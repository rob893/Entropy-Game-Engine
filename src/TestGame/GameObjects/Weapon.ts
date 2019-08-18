import { GameObject } from '../../GameEngine/Core/GameObject';
import { Component } from '../../GameEngine/Components/Component';
import { RectangleRenderer } from '../../GameEngine/Components/RectangleRenderer';

export class Weapon extends GameObject {

    protected buildInitialComponents(): Component[] {
        return [new RectangleRenderer(this, 15, 10, 'white')];
    }
}