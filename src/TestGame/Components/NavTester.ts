import { Component } from "../../GameEngine/Components/Component";
import { GameObject } from "../../GameEngine/Core/GameObject";
import { NavAgent } from "../../GameEngine/Components/NavAgent";
import { Key } from "../../GameEngine/Core/Enums/Key";
import { Vector2 } from "../../GameEngine/Core/Helpers/Vector2";
import { GameEngine } from "../../GameEngine/Core/GameEngine";
import { Input } from "../../GameEngine/Core/Helpers/Input";

export class NavTester extends Component {

    private navAgent: NavAgent;


    public constructor(gameObject: GameObject) {
        super(gameObject);
        Input.addClickListener(0, (event) => this.onClick(event));
        Input.addKeydownListener(Key.Backspace, (event) => this.onKeyDown(event));
        //document.addEventListener('keydown', () => this.onKeyDown(<KeyboardEvent>event));
        //document.addEventListener('click', () => this.onClick(<MouseEvent>event));
    }

    public start(): void {
        this.navAgent = this.gameObject.getComponent(NavAgent);
    }

    private onKeyDown(event: KeyboardEvent): void {
        if (event.keyCode === Key.Space) {
            this.navAgent.setDestination(new Vector2(400, 300));
        }
        else if (event.keyCode === Key.Backspace) {
            this.navAgent.resetPath();
            this.transform.setPosition(200, 300);
        }
    }

    private onClick(event: MouseEvent): void {
        this.navAgent.setDestination(GameEngine.instance.getCursorPosition(event));
    }
}