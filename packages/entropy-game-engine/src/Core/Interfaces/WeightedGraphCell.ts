import { GraphCell } from './GraphCell';

export interface WeightedGraphCell extends GraphCell {
    passable: boolean;
    weight: number;
}
