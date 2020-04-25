import { NPCController } from '../Components/Characters/NPC/NPCController';

export interface State {
  performBehavior(context: NPCController): void;
  onEnter(context: NPCController): void;
  onExit(context: NPCController): void;
}
