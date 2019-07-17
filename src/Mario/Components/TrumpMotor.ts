import { Motor } from "./Motor";
import { GameObject } from "../../GameEngine/Core/GameObject";
import { GameEngine } from "../../GameEngine/Core/GameEngine";
import { Vector2 } from "../../GameEngine/Core/Vector2";
import { Transform } from "../../GameEngine/Components/Transform";
import { Animation } from "../../GameEngine/Core/Animation";
import { Animator } from "../../GameEngine/Components/Animator";
import TrumpRun from "../../assets/images/trump_run.png";
import TrumpIdle from "../../assets/images/trump_idle.png";
import YouSuckSound from "../../assets/sounds/suck.mp3";
import { AudioSource } from "../../GameEngine/Components/AudioSource";

export class TrumpMotor extends Motor {
    
    private player: GameObject;
    private playerTransform: Transform;
    private idleAnimation: Animation;
    private runRightAnimation: Animation;
    private runLeftAnimation: Animation;
    private animator: Animator;
    private audioSource: AudioSource;
    private isMovingLeft: boolean = false;
    private isMovingRight: boolean = false;
    private isIdle: boolean = true;


    public constructor(gameObject: GameObject) {
        super(gameObject);
        this.speed = 2;
        this.runRightAnimation = new Animation(TrumpRun, 6, 4, 0.075, [2]);
        this.runLeftAnimation = new Animation(TrumpRun, 6, 4, 0.075, [4]);
        this.idleAnimation = new Animation(TrumpIdle, 10, 4, 0.1, [1]);
    }

    public start(): void {
        this.animator = this.gameObject.getComponent(Animator);
        this.audioSource = this.gameObject.getComponent(AudioSource);
        this.audioSource.setClip(YouSuckSound);
        this.player = GameEngine.Instance.getGameObjectById('player');
        this.playerTransform = this.player.getTransform();
    }

    protected move(): void {
        let direction = Vector2.direction(this.transform.position, this.playerTransform.position);
        direction.y = 0;

        if (direction.x < -0.1 && !this.isMovingLeft) {
            this.isMovingLeft = true;
            this.isMovingRight = false;
            this.isIdle = false;
            this.animator.setAnimation(this.runLeftAnimation);
        }
        else if (direction.x > 0.1 && !this.isMovingRight) {
            this.isMovingLeft = false;
            this.isMovingRight = true;
            this.isIdle = false;
            this.animator.setAnimation(this.runRightAnimation);
        }
        else if (direction.x >= -0.1 && direction.x <= 0.1 && !this.isIdle) {
            this.isMovingLeft = false;
            this.isMovingRight = false;
            this.isIdle = true;
            this.animator.setAnimation(this.idleAnimation);
            this.audioSource.play();
        }

        this.transform.translate(direction.multiplyScalar(this.speed));
    }

    protected handleOutOfBounds(): void {
        
    }
}