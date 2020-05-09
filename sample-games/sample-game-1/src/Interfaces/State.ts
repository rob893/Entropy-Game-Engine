import { NPCController } from '../components/characters/npc/NPCController';

export interface State {
  performBehavior(context: NPCController): void;
  onEnter(context: NPCController): void;
  onExit(context: NPCController): void;
}
