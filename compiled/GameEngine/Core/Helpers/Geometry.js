export class Geometry {
    static onSegment(p, q, r) {
        if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
            q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)) {
            return true;
        }
        return false;
    }
    static orientation(p, q, r) {
        const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
        if (val === 0) {
            return 0;
        }
        return (val > 0) ? 1 : 2;
    }
    static doIntersect(p1, q1, p2, q2) {
        const o1 = this.orientation(p1, q1, p2);
        const o2 = this.orientation(p1, q1, q2);
        const o3 = this.orientation(p2, q2, p1);
        const o4 = this.orientation(p2, q2, q1);
        if (o1 !== o2 && o3 !== o4) {
            return true;
        }
        if (o1 === 0 && this.onSegment(p1, p2, q1)) {
            return true;
        }
        if (o2 === 0 && this.onSegment(p1, q2, q1)) {
            return true;
        }
        if (o3 === 0 && this.onSegment(p2, p1, q2)) {
            return true;
        }
        if (o4 === 0 && this.onSegment(p2, q1, q2)) {
            return true;
        }
        return false;
    }
    static doIntersectRectangle(p1, p2, tl, tr, bl, br) {
        if (this.doIntersect(p1, p2, tl, tr) ||
            this.doIntersect(p1, p2, tl, bl) ||
            this.doIntersect(p1, p2, bl, br) ||
            this.doIntersect(p1, p2, tr, br)) {
            return true;
        }
        return false;
    }
}
//# sourceMappingURL=Geometry.js.map