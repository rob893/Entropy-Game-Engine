import { IWeightedGraph } from "./Interfaces/IWeightedGraph";
import { Vector2 } from "./Vector2";

export class NavGrid implements IWeightedGraph {
    
    public readonly unpassableCells: Set<string> = new Set<string>();
    public readonly cellWeights: Map<string, number> = new Map<string, number>(); 
    
    private readonly directions: Vector2[];
    private readonly cellSize: number;


    public constructor(cellSize: number) {
        this.cellSize = cellSize;
        this.directions = [
            Vector2.up.multiplyScalar(cellSize), 
            Vector2.right.multiplyScalar(cellSize), 
            Vector2.down.multiplyScalar(cellSize), 
            Vector2.left.multiplyScalar(cellSize)
        ];
    }

    public *neighbors(id: Vector2): Iterable<string> {
        for (let direction of this.directions) {
            const key = this.getMapKey(id.x + direction.x, id.y + direction.y);

            if (!this.unpassableCells.has(key)) {
                yield key;
            }
        }
    }
    
    public cost(a: Vector2, b: Vector2): number {
        return 0;
    }

    private getMapKey(position: Vector2): string;
    private getMapKey(x: number, y: number): string;

    private getMapKey(positionOrX: Vector2|number, y?: number): string {
        if (typeof positionOrX === 'number') {
            return Math.floor(positionOrX / this.cellSize) * this.cellSize + ',' + Math.floor(y / this.cellSize) * this.cellSize;
        }

        return Math.floor(positionOrX.x / this.cellSize) * this.cellSize + ',' + Math.floor(positionOrX.y / this.cellSize) * this.cellSize;
    }
}