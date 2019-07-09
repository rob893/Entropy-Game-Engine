class Vector2 {
    
    public x: number = 0;
    public y: number = 0;


    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public static distance(point1: Vector2, point2: Vector2): number {
        let distanceX: number = point1.x - point2.x;
        let distanceY: number = point1.y - point2.y;

        return Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));
    }
}