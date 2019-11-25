import { Vector2 } from '../Helpers/Vector2';

export interface GraphCell {
    position: Vector2;
}

export interface WeightedGraphCell extends GraphCell {
    passable: boolean;
    weight: number;
}