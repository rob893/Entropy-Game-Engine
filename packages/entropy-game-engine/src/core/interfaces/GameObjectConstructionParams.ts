import { Layer } from '../enums/Layer';
import { ComponentAnalyzer } from '../helpers/ComponentAnalyzer';
import { Input } from '../helpers/Input';
import { SceneManager } from '../helpers/SceneManager';
import { Physics } from '../physics/Physics';

export interface GameObjectConstructionParams {
  gameEngine: {
    componentAnalyzer: ComponentAnalyzer;
    input: Input;
    physics: Physics;
    sceneManager: SceneManager;
  };
  id?: string;
  x?: number;
  y?: number;
  rotation?: number;
  tag?: string;
  layer?: Layer;
}
