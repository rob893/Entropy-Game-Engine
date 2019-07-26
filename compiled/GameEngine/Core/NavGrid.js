import { Vector2 } from "./Helpers/Vector2";
export class NavGrid {
    constructor(cellSize) {
        this.cells = new Set();
        this.unpassableCells = new Set();
        this.cellWeights = new Map();
        this.cellSize = cellSize;
        this.directions = [
            Vector2.up.multiplyScalar(cellSize),
            Vector2.right.multiplyScalar(cellSize),
            Vector2.down.multiplyScalar(cellSize),
            Vector2.left.multiplyScalar(cellSize)
        ];
    }
    *neighbors(id) {
        for (let direction of this.directions) {
            const key = this.getMapKey(id.x + direction.x, id.y + direction.y);
            if (!this.unpassableCells.has(key) && this.cells.has(key)) {
                yield key;
            }
        }
    }
    cost(a, b) {
        return 0;
    }
    addCell(cell, x, y) {
        const key = this.getMapKey(x, y);
        this.cells.add(key);
        if (!cell.passable) {
            this.unpassableCells.add(key);
        }
        else {
            this.cellWeights.set(key, cell.terrainWeight);
        }
    }
    getMapKey(positionOrX, y) {
        if (typeof positionOrX === 'number') {
            return Math.floor(positionOrX / this.cellSize) * this.cellSize + ',' + Math.floor(y / this.cellSize) * this.cellSize;
        }
        return Math.floor(positionOrX.x / this.cellSize) * this.cellSize + ',' + Math.floor(positionOrX.y / this.cellSize) * this.cellSize;
    }
}
//# sourceMappingURL=NavGrid.js.map