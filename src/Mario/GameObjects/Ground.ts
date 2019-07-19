import { GameObject } from "../../GameEngine/Core/GameObject";
import { RectangleCollider } from "../../GameEngine/Components/RectangleCollider";
import { Colors } from "../../GameEngine/Core/Helpers/Colors";
import { RectangleRenderer } from "../../GameEngine/Components/RectangleRenderer";

export class Ground extends GameObject {

    public constructor(x: number, y: number, w: number, h: number, color: Colors) {
        super('ground', x, y, 'ground');

        this.setComponents([new RectangleCollider(this, w, h), new RectangleRenderer(this, w, h, color)]);
    }
}