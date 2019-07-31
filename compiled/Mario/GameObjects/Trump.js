import { GameObject } from "../../GameEngine/Core/GameObject";
import { RectangleCollider } from "../../GameEngine/Components/RectangleCollider";
import TrumpIdleSprite from "../../assets/images/trump_idle.png";
import { Animation } from "../../GameEngine/Core/Helpers/Animation";
import { Animator } from "../../GameEngine/Components/Animator";
import { NavAgent } from "../../GameEngine/Components/NavAgent";
import { NavTester } from "../Components/NavTester";
export class Trump extends GameObject {
    constructor(id) {
        super(id, 200, 300);
        let components = [];
        components.push(new RectangleCollider(this, 60, 60));
        components.push(new NavAgent(this));
        components.push(new NavTester(this));
        let initialAnimation = new Animation(TrumpIdleSprite, 10, 4, 0.1, [4]);
        components.push(new Animator(this, 75, 75, initialAnimation));
        this.setComponents(components);
    }
}
//# sourceMappingURL=Trump.js.map