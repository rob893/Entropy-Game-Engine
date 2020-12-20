import { Vector2 } from '../core';
import { Component } from './Component';

export class Camera extends Component {
  public zoom: number = 1;

  public screenPointToGameWorld(point: Vector2): Vector2 {
    return Vector2.divideScalar(point, this.zoom);
  }
}
