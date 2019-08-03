import { Component } from '../../GameEngine/Components/Component';
import { NavAgent } from '../../GameEngine/Components/NavAgent';
import { KeyCode } from '../../GameEngine/Core/Enums/KeyCode';
import { Vector2 } from '../../GameEngine/Core/Helpers/Vector2';
import { Input } from '../../GameEngine/Core/Helpers/Input';
import { EventType } from '../../GameEngine/Core/Enums/EventType';
export class NavTester extends Component {
    constructor(gameObject) {
        super(gameObject);
        Input.addClickListener(0, (event) => this.onClick(event));
        Input.addKeyListener(EventType.KeyDown, KeyCode.Backspace, (event) => this.onKeyDown(event));
    }
    start() {
        this.navAgent = this.gameObject.getComponent(NavAgent);
    }
    onKeyDown(event) {
        if (event.keyCode === KeyCode.Space) {
            this.navAgent.setDestination(new Vector2(400, 300));
        }
        else if (event.keyCode === KeyCode.Backspace) {
            this.navAgent.resetPath();
            this.transform.setPosition(200, 300);
        }
    }
    onClick(event) {
        this.navAgent.setDestination(event.cursorPositionOnCanvas);
    }
}
//# sourceMappingURL=NavTester.js.map