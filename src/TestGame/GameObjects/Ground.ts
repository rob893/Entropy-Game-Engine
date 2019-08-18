import { GameObject } from '../../GameEngine/Core/GameObject';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import { Color } from '../../GameEngine/Core/Enums/Color';
import { RectangleRenderer } from '../../GameEngine/Components/RectangleRenderer';
import { GameEngine } from '../../GameEngine/Core/GameEngine';

export class Ground extends GameObject {

    public constructor(gameEngine: GameEngine, x: number, y: number, w: number, h: number, color: Color) {
        super(gameEngine, 'ground', x, y, 'ground');

        this.setComponents([new RectangleCollider(this, w, h), new RectangleRenderer(this, w, h, color)]);
    }
}