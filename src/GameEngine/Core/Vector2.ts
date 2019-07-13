export class Vector2 {
    
    public x: number = 0;
    public y: number = 0;

    
    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public get sqrMagnitude(): number {
        return (this.x * this.x) + (this.y * this.y);
    }

    public get magnitude(): number {
        return Math.sqrt(this.sqrMagnitude);
    }

    public get normalized(): Vector2 {
        if (this.magnitude === 0) {
            return new Vector2(1, 0);
        }

        return this.divide(new Vector2(this.magnitude, this.magnitude));
    }

    public add(rightOperand: Vector2): Vector2 {
        let newX = this.x + rightOperand.x;
        let newY = this.y + rightOperand.y;

        return new Vector2(newX, newY);
    }

    public subtract(rightOperand: Vector2): Vector2 {
        let newX = this.x - rightOperand.x;
        let newY = this.y - rightOperand.y;

        return new Vector2(newX, newY);
    }

    public multiply(rightOperand: Vector2): Vector2 {
        let newX = this.x * rightOperand.x;
        let newY = this.y * rightOperand.y;

        return new Vector2(newX, newY);
    }

    public divide(rightOperand: Vector2): Vector2 {
        let newX = this.x / rightOperand.x;
        let newY = this.y / rightOperand.y;

        return new Vector2(newX, newY);
    }

    public equals(rightOperand: Vector2): boolean {
        let equalX = this.x === rightOperand.x;
        let equalY = this.y === rightOperand.y;

        return equalX && equalY;
    }

    public multiplyScalar(rightOperand: number): Vector2 {
        let newX = this.x * rightOperand;
        let newY = this.y * rightOperand;

        return new Vector2(newX, newY);
    }

    public static get up(): Vector2 {
        return new Vector2(0, 1);
    }

    public static get down(): Vector2 {
        return new Vector2(0, -1);
    }

    public static get left(): Vector2 {
        return new Vector2(-1, 0);
    }

    public static get right(): Vector2 {
        return new Vector2(1, 0);
    }

    public static get zero(): Vector2 {
        return new Vector2(0, 0);
    }

    public static get one(): Vector2 {
        return new Vector2(1, 1);
    }

    public static distance(point1: Vector2, point2: Vector2): number {
        let distanceX: number = point1.x - point2.x;
        let distanceY: number = point1.y - point2.y;

        return Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));
    }

    public static angle(from: Vector2, to: Vector2): number {
        let cos0 = Vector2.dot(from, to) / (from.magnitude * to.magnitude);

        return Math.acos(cos0);
    }

    public static dot(point1: Vector2, point2: Vector2): number {
        return (point1.x * point2.x) + (point1.y * point2.y);
    }
}