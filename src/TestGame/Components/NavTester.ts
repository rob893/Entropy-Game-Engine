import { Component } from '../../GameEngine/Components/Component';
import { GameObject } from '../../GameEngine/Core/GameObject';
import { NavAgent } from '../../GameEngine/Components/NavAgent';
import { KeyCode } from '../../GameEngine/Core/Enums/KeyCode';
import { Vector2 } from '../../GameEngine/Core/Helpers/Vector2';
import { Input } from '../../GameEngine/Core/Helpers/Input';
import { CanvasMouseEvent } from '.../../GameEngine/Core/Interfaces/CanvasMouseEvent';
import { EventType } from '../../GameEngine/Core/Enums/EventType';

export class NavTester extends Component {

    private navAgent: NavAgent;


    public constructor(gameObject: GameObject) {
        super(gameObject);
        Input.addClickListener(0, (event) => this.onClick(event));
        Input.addKeyListener(EventType.KeyDown, KeyCode.Backspace, (event) => this.onKeyDown(event));
    }

    public start(): void {
        this.navAgent = this.gameObject.getComponent(NavAgent);
    }

    private onKeyDown(event: KeyboardEvent): void {
        if (event.keyCode === KeyCode.Space) {
            this.navAgent.setDestination(new Vector2(400, 300));
        }
        else if (event.keyCode === KeyCode.Backspace) {
            this.navAgent.resetPath();
            this.transform.setPosition(200, 300);
        }
    }

    private onClick(event: CanvasMouseEvent): void {
        this.navAgent.setDestination(event.cursorPositionOnCanvas);
    }
}