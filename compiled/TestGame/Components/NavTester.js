import { Component } from '../../GameEngine/Components/Component';
import { NavAgent } from '../../GameEngine/Components/NavAgent';
import { KeyCode } from '../../GameEngine/Core/Enums/KeyCode';
import { Vector2 } from '../../GameEngine/Core/Helpers/Vector2';
import { Input } from '../../GameEngine/Core/Helpers/Input';
import { EventType } from '../../GameEngine/Core/Enums/EventType';
import TrumpRun from '../Assets/Images/trump_run.png';
import TrumpIdle from '../Assets/Images/trump_idle.png';
import { Animation } from '../../GameEngine/Core/Helpers/Animation';
import { Animator } from '../../GameEngine/Components/Animator';
export class NavTester extends Component {
    constructor(gameObject) {
        super(gameObject);
        Input.addMouseListener(EventType.Click, 0, (event) => this.onClick(event));
        Input.addKeyListener(EventType.KeyDown, KeyCode.Backspace, (event) => this.onKeyDown(event));
        this.runRightAnimation = new Animation(TrumpRun, 6, 4, 0.075, [2]);
        this.runLeftAnimation = new Animation(TrumpRun, 6, 4, 0.075, [4]);
        this.runUpAnimation = new Animation(TrumpRun, 6, 4, 0.075, [1]);
        this.runDownAnimation = new Animation(TrumpRun, 6, 4, 0.075, [3]);
        this.idleAnimation = new Animation(TrumpIdle, 10, 4, 0.1, [1]);
    }
    start() {
        this.navAgent = this.gameObject.getComponent(NavAgent);
        this.navAgent.onDirectionChanged.add((newDirection) => this.changeAnimation(newDirection));
        this.navAgent.onPathCompleted.add(() => this.animator.setAnimation(this.idleAnimation));
        this.animator = this.gameObject.getComponent(Animator);
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
    changeAnimation(newDirection) {
        if (Math.abs(newDirection.x) > Math.abs(newDirection.y)) {
            if (newDirection.x > 0.5) {
                this.animator.setAnimation(this.runRightAnimation);
            }
            else {
                this.animator.setAnimation(this.runLeftAnimation);
            }
        }
        else {
            if (newDirection.y > 0.5) {
                this.animator.setAnimation(this.runUpAnimation);
            }
            else {
                this.animator.setAnimation(this.runDownAnimation);
            }
        }
    }
}
//# sourceMappingURL=NavTester.js.map