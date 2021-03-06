import {
  Animation,
  Animator,
  AudioClip,
  AudioSource,
  Component,
  GameObject,
  GameObjectConstructionParams,
  Layer,
  PhysicalMaterial,
  PrefabSettings,
  RectangleCollider,
  Rigidbody,
  SpriteSheet
} from '@entropy-engine/entropy-game-engine';
import { CharacterAnimations } from '../interfaces/CharacterAnimations';
import { CharacterAnimator } from '../components/characters/CharacterAnimator';
import { PlayerHealth } from '../components/characters/player/PlayerHealth';
import { PlayerPhysicsMotor } from '../components/characters/player/PlayerPhysicsMotor';

export class PlayerRB extends GameObject {
  protected buildInitialComponents(): Component[] {
    const components: Component[] = [];

    const rb = new Rigidbody(this);
    components.push(rb);

    const collider = new RectangleCollider(this, rb, 35, 35, 0, -5);
    collider.physicalMaterial = PhysicalMaterial.bouncy;
    components.push(collider);

    const minotaurSpriteSheet = this.assetPool.getAsset<SpriteSheet>('minotaurSpriteSheet');

    const attack1R = new Animation(minotaurSpriteSheet.getFrames(4), 0.075);
    const attack2R = new Animation(minotaurSpriteSheet.getFrames(7), 0.075);

    const attack1L = new Animation(minotaurSpriteSheet.getFrames(14), 0.075);
    const attack2L = new Animation(minotaurSpriteSheet.getFrames(17), 0.075);

    const animations: CharacterAnimations = {
      rightAttackAnimations: [attack1R, attack2R],
      leftAttackAnimations: [attack1L, attack2L],
      runLeftAnimation: new Animation(minotaurSpriteSheet.getFrames(12), 0.075),
      runRightAnimation: new Animation(minotaurSpriteSheet.getFrames(2), 0.075),
      runDownAnimation: new Animation(minotaurSpriteSheet.getFrames(12), 0.075),
      runUpAnimation: new Animation(minotaurSpriteSheet.getFrames(2), 0.075),
      runUpLeftAnimation: new Animation(minotaurSpriteSheet.getFrames(12), 0.075),
      runUpRightAnimation: new Animation(minotaurSpriteSheet.getFrames(2), 0.075),
      runDownLeftAnimation: new Animation(minotaurSpriteSheet.getFrames(12), 0.075),
      runDownRightAnimation: new Animation(minotaurSpriteSheet.getFrames(2), 0.075),
      idleLeftAnimation: new Animation(minotaurSpriteSheet.getFrames(11), 0.075),
      idleRightAnimation: new Animation(minotaurSpriteSheet.getFrames(1), 0.075),
      jumpLeftAnimation: new Animation(minotaurSpriteSheet.getFrames(11), 0.075),
      jumpRightAnimation: new Animation(minotaurSpriteSheet.getFrames(1), 0.075),
      dieLeftAnimation: new Animation(minotaurSpriteSheet.getFrames(20), 0.075),
      dieRightAnimation: new Animation(minotaurSpriteSheet.getFrames(10), 0.075)
    };

    const animator = new Animator(this, 75, 75, animations.idleLeftAnimation);
    components.push(animator);

    const characterAnimator = new CharacterAnimator(this, animator, animations);
    components.push(characterAnimator);

    const audioSource = new AudioSource(this, this.assetPool.getAsset<AudioClip>('hurtSound'));
    components.push(audioSource);

    components.push(new PlayerHealth(this, audioSource));

    components.push(new PlayerPhysicsMotor(this, rb, characterAnimator));

    return components;
  }

  protected getPrefabSettings(): PrefabSettings {
    return {
      x: 400,
      y: 250,
      rotation: 0,
      id: 'player',
      tag: 'player',
      layer: Layer.Default
    };
  }

  protected override buildAndReturnChildGameObjects(config: GameObjectConstructionParams): GameObject[] {
    // const ball = new ThrowableBall(gameEngineAPIs, 'ball');

    // ball.transform.setPosition(this.transform.position.x, this.transform.position.y - 20);

    // return [ball];
    return [];
  }
}
