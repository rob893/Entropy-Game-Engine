import { Vector2 } from './Vector2';

export abstract class Geometry {
  /**
   * Given three colinear points p, q, r, the function checks if point q lies on line segment 'pr'
   */
  public static onSegment(p: Vector2, q: Vector2, r: Vector2): boolean {
    if (
      q.x <= Math.max(p.x, r.x) &&
      q.x >= Math.min(p.x, r.x) &&
      q.y <= Math.max(p.y, r.y) &&
      q.y >= Math.min(p.y, r.y)
    ) {
      return true;
    }

    return false;
  }

  /**
   * Finds the orientation of ordered triplet (p, q, r).
   * The function returns following values
   * 0 --> p, q and r are colinear
   * 1 --> Clockwise
   * 2 --> Counterclockwise
   */
  public static orientation(p: Vector2, q: Vector2, r: Vector2): number {
    const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

    if (val === 0) {
      return 0; // colinear
    }

    return val > 0 ? 1 : 2; // clock or counterclock wise
  }

  /**
   * Returns true if line segment 'p1q1' and 'p2q2' intersect.
   */
  public static doIntersect(p1: Vector2, q1: Vector2, p2: Vector2, q2: Vector2): boolean {
    // Find the four orientations needed for general and
    // special cases
    const o1 = this.orientation(p1, q1, p2);
    const o2 = this.orientation(p1, q1, q2);
    const o3 = this.orientation(p2, q2, p1);
    const o4 = this.orientation(p2, q2, q1);

    // General case
    if (o1 !== o2 && o3 !== o4) {
      return true;
    }

    // Special Cases
    // p1, q1 and p2 are colinear and p2 lies on segment p1q1
    if (o1 === 0 && this.onSegment(p1, p2, q1)) {
      return true;
    }

    // p1, q1 and q2 are colinear and q2 lies on segment p1q1
    if (o2 === 0 && this.onSegment(p1, q2, q1)) {
      return true;
    }

    // p2, q2 and p1 are colinear and p1 lies on segment p2q2
    if (o3 === 0 && this.onSegment(p2, p1, q2)) {
      return true;
    }

    // p2, q2 and q1 are colinear and q1 lies on segment p2q2
    if (o4 === 0 && this.onSegment(p2, q1, q2)) {
      return true;
    }

    return false; // Doesn't fall in any of the above cases
  }

  public static doIntersectRectangle(
    p1: Vector2,
    p2: Vector2,
    tl: Vector2,
    tr: Vector2,
    bl: Vector2,
    br: Vector2
  ): boolean {
    if (
      this.doIntersect(p1, p2, tl, tr) || //Line intersects top border
      this.doIntersect(p1, p2, tl, bl) || //Line intersects left border
      this.doIntersect(p1, p2, bl, br) || //Line intersects bottom border
      this.doIntersect(p1, p2, tr, br)
    ) {
      //Line intersects right border
      return true;
    }

    return false;
  }

  public static rectangleContainsPoint(recTopLeft: Vector2, recBottomRight: Vector2, point: Vector2): boolean {
    return (
      point.x >= recTopLeft.x && point.x <= recBottomRight.x && point.y >= recTopLeft.y && point.y <= recBottomRight.y
    );
  }
}
