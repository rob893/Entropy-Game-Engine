import { GameObject } from "../../GameEngine/Core/GameObject";
import { GameManager } from "../Components/GameManager";
export class GameManagerObject extends GameObject {
    constructor(id) {
        super(id, 0, 0, 0, 0);
        let gameManagerComponents = [];
        let gameManager = GameManager.createInstance(this);
        gameManagerComponents.push(gameManager);
        this.setComponents(gameManagerComponents);
    }
}
//# sourceMappingURL=GameManagerObject.js.map