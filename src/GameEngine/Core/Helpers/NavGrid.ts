import { IWeightedGraph } from "../Interfaces/IWeightedGraph";
import { Vector2 } from "./Vector2";
import { IWeightedGraphCell } from "../Interfaces/IWeightedGraphCell";

export class NavGrid<T extends IWeightedGraphCell> implements IWeightedGraph<T> {
    
    public readonly cellSize: number;
    
    private readonly cells: Map<string, T> = new Map<string, T>();
    private readonly unpassableCells: Set<string> = new Set<string>();
    private readonly directions: Vector2[];


    public constructor(cellSize: number) {
        this.cellSize = cellSize;
        this.directions = [
            Vector2.up.multiplyScalar(cellSize), 
            Vector2.right.multiplyScalar(cellSize), 
            Vector2.down.multiplyScalar(cellSize), 
            Vector2.left.multiplyScalar(cellSize)
        ];
    }

    public get passableCells(): T[] {
        return Array.from(this.cells.values()).filter(cell => cell.passable);
    }

    public *neighbors(id: Vector2): Iterable<T> {
        for (let direction of this.directions) {
            const key = this.getMapKey(id.x + direction.x, id.y + direction.y);
            
            if (!this.unpassableCells.has(key) && this.cells.has(key)) {
                yield this.cells.get(key);
            }
        }
    }
    
    public cost(a: Vector2, b: Vector2): number {
        const key = this.getMapKey(b);
        
        if (!this.cells.has(key)) {
            throw new Error('Cell does not exist');
        }

        return this.cells.get(key).weight;
    }

    public addCell(cell: T): void {
        const key = this.getMapKey(cell.position);

        if (this.cells.has(key)) {
            console.error('WARNING! ' + key + ' alread in cells set!');
        }
        
        this.cells.set(key, cell);
        
        if (!cell.passable) {
            this.unpassableCells.add(key);
        }
    }

    public isUnpassable(position: Vector2): boolean {
        const key = this.getMapKey(position);

        if (this.unpassableCells.has(key)) {
            return true;
        }
        
        return false;
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
