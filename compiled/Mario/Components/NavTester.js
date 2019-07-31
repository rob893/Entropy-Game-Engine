import { Component } from "../../GameEngine/Components/Component";
import { NavAgent } from "../../GameEngine/Components/NavAgent";
import { Key } from "../../GameEngine/Core/Enums/Key";
import { Vector2 } from "../../GameEngine/Core/Helpers/Vector2";
import { GameEngine } from "../../GameEngine/Core/GameEngine";
export class NavTester extends Component {
    constructor(gameObject) {
        super(gameObject);
        document.addEventListener('keydown', () => this.onKeyDown(event));
        document.addEventListener('click', () => this.onClick(event));
    }
    start() {
        this.navAgent = this.gameObject.getComponent(NavAgent);
    }
    onKeyDown(event) {
        if (event.keyCode === Key.Space) {
            this.navAgent.setDestination(new Vector2(400, 300));
        }
        else if (event.keyCode === Key.Backspace) {
            this.navAgent.resetPath();
            this.transform.setPosition(200, 300);
        }
    }
    onClick(event) {
        this.navAgent.setDestination(GameEngine.instance.getCursorPosition(event));
    }
}
//# sourceMappingURL=NavTester.js.map