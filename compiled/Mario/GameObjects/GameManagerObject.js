import { GameObject } from "../../GameEngine/Core/GameObject";
import { GameManager } from "../Components/GameManager";
import { FPSCounter } from "../../GameEngine/Components/FPSCounter";
export class GameManagerObject extends GameObject {
    constructor(id) {
        super(id, 0, 0, 0, 0);
        let gameManagerComponents = [];
        let gameManager = GameManager.createInstance(this);
        gameManagerComponents.push(gameManager);
        gameManagerComponents.push(new FPSCounter(this));
        this.setComponents(gameManagerComponents);
    }
}
//# sourceMappingURL=GameManagerObject.js.map