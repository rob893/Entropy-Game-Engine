import { IWeightedGraph } from "../Interfaces/IWeightedGraph";
import { Vector2 } from "./Vector2";
import { IMapCell } from "../Interfaces/IMapCell";

export class NavGrid implements IWeightedGraph {
    
    private readonly cells: Set<string> = new Set<string>();
    private readonly unpassableCells: Set<string> = new Set<string>();
    private readonly cellWeights: Map<string, number> = new Map<string, number>(); 
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

            if (!this.unpassableCells.has(key) && this.cells.has(key)) {
                yield key;
            }
        }
    }
    
    public cost(a: Vector2, b: Vector2): number {
        return 0;
    }

    public addCell(cell: IMapCell, x: number, y: number): void {
        const key = this.getMapKey(x, y);
        if (this.cells.has(key)) {
            console.error('WARNING! ' + key + ' alread in cells set!');
        }
        
        this.cells.add(key);
        
        if (!cell.passable) {
            this.unpassableCells.add(key);
        }
        else {
            this.cellWeights.set(key, cell.terrainWeight);
        }
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