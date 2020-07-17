import {
  GameObject,
  Layer,
  Component,
  PrefabSettings,
  SpriteSheet,
  Animator,
  Animation,
  RectangleCollider,
  PhysicalMaterial,
  NavAgent,
  GameObjectConstructionParams
} from '@entropy-engine/entropy-game-engine';
import { CharacterAnimator } from '../components/characters/CharacterAnimator';
import { CharacterAnimations } from '../interfaces/CharacterAnimations';
import { NPCController } from '../components/characters/npc/NPCController';
import { SearchingState } from '../components/characters/npc/SearchingState';
import { ChaseState } from '../components/characters/npc/ChaseState';
import { AttackState } from '../components/characters/npc/AttackState';
import { CharacterStats } from '../components/characters/CharacterStats';
import { Healthbar } from './Healthbar';

export class Minotaur extends GameObject {
  protected buildInitialComponents(): Component[] {
    const components: Component[] = [];

    const collider = new RectangleCollider(this, null, 30, 30, 0, 0);
    collider.physicalMaterial = PhysicalMaterial.bouncy;
    components.push(collider);

    const navAgent = new NavAgent(this, this.terrain.navGrid);
    components.push(navAgent);

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
      runUpAnimation: new Animation(minotaurSpriteSheet.getFrames(12), 0.075),
      runDownAnimation: new Animation(minotaurSpriteSheet.getFrames(2), 0.075),
      runUpLeftAnimation: new Animation(minotaurSpriteSheet.getFrames(12), 0.075),
      runUpRightAnimation: new Animation(minotaurSpriteSheet.getFrames(2), 0.075),
      runDownLeftAnimation: new Animation(minotaurSpriteSheet.getFrames(12), 0.075),
      runDownRightAnimation: new Animation(minotaurSpriteSheet.getFrames(2), 0.075),
      idleLeftAnimation: new Animation(minotaurSpriteSheet.getFrames(11), 0.075),
      idleRightAnimation: new Animation(minotaurSpriteSheet.getFrames(1), 0.075),
      jumpLeftAnimation: new Animation(minotaurSpriteSheet.getFrames(14), 0.075),
      jumpRightAnimation: new Animation(minotaurSpriteSheet.getFrames(14), 0.075),
      dieLeftAnimation: new Animation(minotaurSpriteSheet.getFrames(20), 0.075),
      dieRightAnimation: new Animation(minotaurSpriteSheet.getFrames(10), 0.075)
    };

    const animator = new Animator(this, 85, 85, animations.idleRightAnimation);
    components.push(animator);

    const characterAnimator = new CharacterAnimator(this, animator, animations);
    components.push(characterAnimator);

    const myStats = new CharacterStats(this, characterAnimator);
    components.push(myStats);

    const searchingState = new SearchingState(this, characterAnimator);
    components.push(searchingState);

    const chaseState = new ChaseState(this, navAgent, characterAnimator, myStats);
    components.push(chaseState);

    const attackState = new AttackState(this, characterAnimator, myStats);
    components.push(attackState);

    components.push(new NPCController(this, myStats, searchingState, chaseState, attackState));

    return components;
  }

  protected getPrefabSettings(): PrefabSettings {
    return {
      x: 200,
      y: 300,
      rotation: 0,
      id: 'minotaur',
      tag: '',
      layer: Layer.Hostile
    };
  }

  protected buildAndReturnChildGameObjects(config: GameObjectConstructionParams): GameObject[] {
    const healthBar = new Healthbar(config);

    healthBar.transform.setPosition(this.transform.position.x, this.transform.position.y - 70);

    return [healthBar];
  }
}
