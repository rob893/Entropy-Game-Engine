import { Motor } from './Motor';
import { GameObject } from '../../GameEngine/Core/GameObject';
import { GameEngine } from '../../GameEngine/Core/GameEngine';
import { Vector2 } from '../../GameEngine/Core/Helpers/Vector2';
import { Transform } from '../../GameEngine/Components/Transform';
import { Animation } from '../../GameEngine/Core/Helpers/Animation';
import { Animator } from '../../GameEngine/Components/Animator';
import TrumpRun from '../../assets/images/trump_run.png';
import TrumpIdle from '../../assets/images/trump_idle.png';
import YouSuckSound from '../../assets/sounds/suck.mp3';
import { AudioSource } from '../../GameEngine/Components/AudioSource';
import { Damageable } from '../Interfaces/Damageable';
import { PlayerHealth } from './PlayerHealth';
import { Time } from '../../GameEngine/Core/Time';

export class TrumpMotor extends Motor {
    
    private player: GameObject;
    private playerTransform: Transform;
    private playerHealth: Damageable;
    private readonly idleAnimation: Animation;
    private readonly runRightAnimation: Animation;
    private readonly runLeftAnimation: Animation;
    private readonly animator: Animator;
    private readonly audioSource: AudioSource;
    private isMovingLeft: boolean = false;
    private isMovingRight: boolean = false;
    private isIdle: boolean = true;
    private damageTimer: number = 0;


    public constructor(gameObject: GameObject, gameCanvas: HTMLCanvasElement, animator: Animator, audioSource: AudioSource) {
        super(gameObject, gameCanvas);

        this.animator = animator;
        this.audioSource = audioSource;

        this.speed = 2;
        this.runRightAnimation = new Animation(TrumpRun, 6, 4, 0.075, [2]);
        this.runLeftAnimation = new Animation(TrumpRun, 6, 4, 0.075, [4]);
        this.idleAnimation = new Animation(TrumpIdle, 10, 4, 0.1, [1]);
    }

    public start(): void {
        this.audioSource.setClip(YouSuckSound);
        this.player = this.gameObject.findGameObjectById('player');
        this.playerTransform = this.player.transform;
        this.playerHealth = this.player.getComponent(PlayerHealth);
    }

    protected move(): void {
        const direction = Vector2.direction(this.transform.position, this.playerTransform.position);
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
        }
        
        this.damageTimer += Time.DeltaTime;

        if (this.damageTimer > 1.5 && Vector2.distance(this.transform.position, this.playerTransform.position) < 15) {
            this.damagePlayer();
            this.damageTimer = 0;
            this.audioSource.play();
        }

        this.transform.translate(direction.multiplyScalar(this.speed));
    }

    protected handleOutOfBounds(): void {
        
    }

    private damagePlayer(): void {
        this.playerHealth.takeDamage(15);
    }
}