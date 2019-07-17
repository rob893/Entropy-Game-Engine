import { GameObject } from "../../GameEngine/Core/GameObject";
import { GameManager } from "../Components/GameManager";
import { FPSCounter } from "../../GameEngine/Components/FPSCounter";
import { AudioSource } from "../../GameEngine/Components/AudioSource";
import MarioTheme from "../../assets/marioTheme.mp3";
export class GameManagerObject extends GameObject {
    constructor(id) {
        super(id, 0, 0);
        let gameManagerComponents = [];
        let gameManager = GameManager.createInstance(this);
        gameManagerComponents.push(gameManager);
        gameManagerComponents.push(new FPSCounter(this));
        gameManagerComponents.push(new AudioSource(this, MarioTheme));
        this.setComponents(gameManagerComponents);
    }
}
//# sourceMappingURL=GameManagerObject.js.map