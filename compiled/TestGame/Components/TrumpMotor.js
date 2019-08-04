import { Motor } from './Motor';
import { GameEngine } from '../../GameEngine/Core/GameEngine';
import { Vector2 } from '../../GameEngine/Core/Helpers/Vector2';
import { Animation } from '../../GameEngine/Core/Helpers/Animation';
import { Animator } from '../../GameEngine/Components/Animator';
import TrumpRun from '../../assets/images/trump_run.png';
import TrumpIdle from '../../assets/images/trump_idle.png';
import YouSuckSound from '../../assets/sounds/suck.mp3';
import { AudioSource } from '../../GameEngine/Components/AudioSource';
import { PlayerHealth } from './PlayerHealth';
import { Time } from '../../GameEngine/Core/Time';
export class TrumpMotor extends Motor {
    constructor(gameObject) {
        super(gameObject);
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.isIdle = true;
        this.damageTimer = 0;
        this.speed = 2;
        this.runRightAnimation = new Animation(TrumpRun, 6, 4, 0.075, [2]);
        this.runLeftAnimation = new Animation(TrumpRun, 6, 4, 0.075, [4]);
        this.idleAnimation = new Animation(TrumpIdle, 10, 4, 0.1, [1]);
    }
    start() {
        this.animator = this.gameObject.getComponent(Animator);
        this.audioSource = this.gameObject.getComponent(AudioSource);
        this.audioSource.setClip(YouSuckSound);
        this.player = GameEngine.instance.findGameObjectById('player');
        this.playerTransform = this.player.transform;
        this.playerHealth = this.player.getComponent(PlayerHealth);
    }
    move() {
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
    handleOutOfBounds() {
    }
    damagePlayer() {
        this.playerHealth.takeDamage(15);
    }
}
//# sourceMappingURL=TrumpMotor.js.map