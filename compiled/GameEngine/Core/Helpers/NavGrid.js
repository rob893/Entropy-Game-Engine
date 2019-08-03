import { Vector2 } from './Vector2';
export class NavGrid {
    constructor(cellSize) {
        this.cells = new Map();
        this.unpassableCells = new Set();
        this.cellSize = cellSize;
        this.directions = [
            Vector2.up.multiplyScalar(cellSize),
            Vector2.right.multiplyScalar(cellSize),
            Vector2.down.multiplyScalar(cellSize),
            Vector2.left.multiplyScalar(cellSize)
        ];
    }
    get passableCells() {
        return Array.from(this.cells.values()).filter(cell => cell.passable);
    }
    *neighbors(id) {
        for (const direction of this.directions) {
            const key = this.getMapKey(id.x + direction.x, id.y + direction.y);
            if (!this.unpassableCells.has(key) && this.cells.has(key)) {
                yield this.cells.get(key);
            }
        }
    }
    cost(a, b) {
        const key = this.getMapKey(b);
        if (!this.cells.has(key)) {
            throw new Error('Cell does not exist');
        }
        return this.cells.get(key).weight;
    }
    addCell(cell) {
        const key = this.getMapKey(cell.position);
        if (this.cells.has(key)) {
            console.error('WARNING! ' + key + ' alread in cells set!');
        }
        this.cells.set(key, cell);
        if (!cell.passable) {
            this.unpassableCells.add(key);
        }
    }
    isUnpassable(position) {
        const key = this.getMapKey(position);
        if (this.unpassableCells.has(key)) {
            return true;
        }
        return false;
    }
    getMapKey(positionOrX, y) {
        if (typeof positionOrX === 'number') {
            return Math.floor(positionOrX / this.cellSize) * this.cellSize + ',' + Math.floor(y / this.cellSize) * this.cellSize;
        }
        return Math.floor(positionOrX.x / this.cellSize) * this.cellSize + ',' + Math.floor(positionOrX.y / this.cellSize) * this.cellSize;
    }
}
//# sourceMappingURL=NavGrid.js.map