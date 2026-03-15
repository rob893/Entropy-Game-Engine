import { Geometry } from '../Geometry';
import { Vector2 } from '../Vector2';

describe('Geometry', () => {
  describe('onSegment', () => {
    it('returns true when the point lies on the segment', () => {
      const start = new Vector2(0, 0);
      const point = new Vector2(2, 2);
      const end = new Vector2(4, 4);

      expect(Geometry.onSegment(start, point, end)).toBe(true);
    });

    it('returns false when the point lies outside the segment bounds', () => {
      const start = new Vector2(0, 0);
      const point = new Vector2(5, 5);
      const end = new Vector2(4, 4);

      expect(Geometry.onSegment(start, point, end)).toBe(false);
    });
  });

  describe('orientation', () => {
    it('returns 0 for collinear points', () => {
      expect(Geometry.orientation(new Vector2(0, 0), new Vector2(2, 2), new Vector2(4, 4))).toBe(0);
    });

    it('returns 1 for clockwise points', () => {
      expect(Geometry.orientation(new Vector2(0, 0), new Vector2(4, 4), new Vector2(2, 1))).toBe(1);
    });

    it('returns 2 for counterclockwise points', () => {
      expect(Geometry.orientation(new Vector2(0, 0), new Vector2(4, 4), new Vector2(1, 2))).toBe(2);
    });
  });

  describe('doIntersect', () => {
    it('returns true for intersecting line segments', () => {
      expect(Geometry.doIntersect(new Vector2(1, 1), new Vector2(4, 4), new Vector2(1, 4), new Vector2(4, 1))).toBe(true);
    });

    it('returns false for non-intersecting line segments', () => {
      expect(Geometry.doIntersect(new Vector2(1, 1), new Vector2(2, 2), new Vector2(3, 3), new Vector2(4, 4))).toBe(false);
    });

    it('returns true for collinear overlapping segments', () => {
      expect(Geometry.doIntersect(new Vector2(1, 1), new Vector2(5, 1), new Vector2(3, 1), new Vector2(7, 1))).toBe(true);
    });

    it('returns true when segments touch at an endpoint', () => {
      expect(Geometry.doIntersect(new Vector2(1, 1), new Vector2(4, 4), new Vector2(4, 4), new Vector2(6, 2))).toBe(true);
    });
  });

  describe('doIntersectRectangle', () => {
    const topLeft = new Vector2(0, 0);
    const topRight = new Vector2(10, 0);
    const bottomLeft = new Vector2(0, 10);
    const bottomRight = new Vector2(10, 10);

    it('returns true when a line crosses the rectangle', () => {
      expect(
        Geometry.doIntersectRectangle(
          new Vector2(-5, 5),
          new Vector2(15, 5),
          topLeft,
          topRight,
          bottomLeft,
          bottomRight
        )
      ).toBe(true);
    });

    it('returns false when a line lies fully outside the rectangle', () => {
      expect(
        Geometry.doIntersectRectangle(
          new Vector2(-5, -5),
          new Vector2(-1, -1),
          topLeft,
          topRight,
          bottomLeft,
          bottomRight
        )
      ).toBe(false);
    });

    it('returns false when a line lies fully inside the rectangle without touching an edge', () => {
      expect(
        Geometry.doIntersectRectangle(
          new Vector2(2, 2),
          new Vector2(8, 8),
          topLeft,
          topRight,
          bottomLeft,
          bottomRight
        )
      ).toBe(false);
    });

    it('returns true when a line touches a rectangle edge', () => {
      expect(
        Geometry.doIntersectRectangle(
          new Vector2(-5, 0),
          new Vector2(15, 0),
          topLeft,
          topRight,
          bottomLeft,
          bottomRight
        )
      ).toBe(true);
    });
  });

  describe('rectangleContainsPoint', () => {
    const topLeft = new Vector2(0, 0);
    const bottomRight = new Vector2(10, 10);

    it('returns true for a point inside the rectangle', () => {
      expect(Geometry.rectangleContainsPoint(topLeft, bottomRight, new Vector2(5, 5))).toBe(true);
    });

    it('returns false for a point outside the rectangle', () => {
      expect(Geometry.rectangleContainsPoint(topLeft, bottomRight, new Vector2(12, 5))).toBe(false);
    });

    it('returns true for a point on the rectangle edge', () => {
      expect(Geometry.rectangleContainsPoint(topLeft, bottomRight, new Vector2(0, 10))).toBe(true);
    });
  });
});
