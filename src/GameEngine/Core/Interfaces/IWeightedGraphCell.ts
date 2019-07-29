import { Vector2 } from "../Helpers/Vector2";

export interface IWeightedGraphCell {
    passable: boolean;
    weight: number;
    position: Vector2;
}