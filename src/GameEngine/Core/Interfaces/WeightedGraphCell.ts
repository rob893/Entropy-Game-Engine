import { Vector2 } from '../Helpers/Vector2';

export interface WeightedGraphCell {
    passable: boolean;
    weight: number;
    position: Vector2;
}