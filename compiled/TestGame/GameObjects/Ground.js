import { GameObject } from "../../GameEngine/Core/GameObject";
import { RectangleCollider } from "../../GameEngine/Components/RectangleCollider";
import { RectangleRenderer } from "../../GameEngine/Components/RectangleRenderer";
export class Ground extends GameObject {
    constructor(x, y, w, h, color) {
        super('ground', x, y, 'ground');
        this.setComponents([new RectangleCollider(this, w, h), new RectangleRenderer(this, w, h, color)]);
    }
}
//# sourceMappingURL=Ground.js.map