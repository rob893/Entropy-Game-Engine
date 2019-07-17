import { GameObject } from "../../GameEngine/Core/GameObject";
import { RectangleCollider } from "../../GameEngine/Components/RectangleCollider";
import { PlayerMotor } from "../Components/PlayerMotor";
import { Rigidbody } from "../../GameEngine/Components/Rigidbody";
import { Animator } from "../../GameEngine/Components/Animator";
import MarioSprite from "../../assets/images/mario.png";
import { Animation } from "../../GameEngine/Core/Animation";
export class Player extends GameObject {
    constructor(id) {
        super(id, 2, 175);
        let playerComponents = [];
        playerComponents.push(new RectangleCollider(this, 50, 50));
        playerComponents.push(new PlayerMotor(this));
        playerComponents.push(new Rigidbody(this));
        let initialAnimation = new Animation(MarioSprite, 4, 1, 0.1);
        playerComponents.push(new Animator(this, 50, 50, initialAnimation));
        this.setComponents(playerComponents);
    }
}
//# sourceMappingURL=Player.js.map