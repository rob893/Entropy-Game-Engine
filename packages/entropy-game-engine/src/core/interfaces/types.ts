import { Transform } from '../../components/Transform';
import { Vector2 } from '../helpers/Vector2';

export interface InstantiateOptions {
  position?: Vector2;
  rotation?: number;
  parent?: Transform;
}
