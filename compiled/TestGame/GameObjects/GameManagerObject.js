import { GameObject } from "../../GameEngine/Core/GameObject";
import { FPSCounter } from "../../GameEngine/Components/FPSCounter";
export class GameManagerObject extends GameObject {
    constructor(id) {
        super(id, 0, 0);
        let gameManagerComponents = [];
        gameManagerComponents.push(new FPSCounter(this));
        this.setComponents(gameManagerComponents);
    }
}
//# sourceMappingURL=GameManagerObject.js.map