export class Vector2 {
    
    public x: number = 0;
    public y: number = 0;

    
    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Returns a new Vector2 with an up direction (a negative y value is up for html canvas)
     */
    public static get up(): Vector2 {
        return new Vector2(0, -1);
    }

    /**
     * Returns a new Vector2 with an down direction (a positive y value is down for html canvas)
     */
    public static get down(): Vector2 {
        return new Vector2(0, 1);
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

    public static clone(from: Vector2): Vector2 {
        return new Vector2(from.x, from.y);
    }

    public static fromString(xCommaY: string): Vector2 {
        if (xCommaY.split(',').length < 2) {
            throw new Error(xCommaY + ' is invalid format. It should be x,y (eg: 5,6)');
        }

        const x = Number(xCommaY.split(',')[0]);
        const y = Number(xCommaY.split(',')[1]);

        return new Vector2(x, y);
    }

    public static add(leftOperand: Vector2, rightOperand: Vector2): Vector2 {
        return new Vector2(leftOperand.x + rightOperand.x, leftOperand.y + rightOperand.y);
    }

    public static subtract(leftOperand: Vector2, rightOperand: Vector2): Vector2 {
        return new Vector2(leftOperand.x - rightOperand.x, leftOperand.y - rightOperand.y);
    }

    public static multiply(leftOperand: Vector2, rightOperand: Vector2): Vector2 {
        return new Vector2(leftOperand.x * rightOperand.x, leftOperand.y * rightOperand.y);
    }

    public static divide(leftOperand: Vector2, rightOperand: Vector2): Vector2 {
        if (rightOperand.x === 0 || rightOperand.y === 0) {
            console.warn('Attempting to divide by 0!');
        }

        return new Vector2(leftOperand.x / rightOperand.x, leftOperand.y / rightOperand.y);
    }

    public static multiplyScalar(leftOperand: Vector2, scalar: number): Vector2 {
        return new Vector2(leftOperand.x * scalar, leftOperand.y * scalar);
    }

    public static divideScalar(leftOperand: Vector2, scalar: number): Vector2 {
        if (scalar === 0) {
            console.warn('Attempting to divide by 0!');
        }

        return new Vector2(leftOperand.x / scalar, leftOperand.y / scalar);
    }

    public static distance(point1: Vector2, point2: Vector2): number {
        const distanceX: number = point1.x - point2.x;
        const distanceY: number = point1.y - point2.y;

        return Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));
    }

    public static distanceSqrd(point1: Vector2, point2: Vector2): number {
        const distanceX: number = point1.x - point2.x;
        const distanceY: number = point1.y - point2.y;

        return (distanceX * distanceX) + (distanceY * distanceY);
    }

    public static angleInRadians(from: Vector2, to: Vector2): number {
        const cos0 = Vector2.dot(from, to) / (from.magnitude * to.magnitude);

        return Math.acos(cos0);
    }

    public static angleInDegrees(from: Vector2, to: Vector2): number {
        return this.angleInRadians(from, to) * 180 / Math.PI;
    }

    public static dot(point1: Vector2, point2: Vector2): number {
        return (point1.x * point2.x) + (point1.y * point2.y);
    }

    /**
     * Returns a normalized vector from point 'from' to point 'to.'
     * 
     * @param from The starting position of the direction vector
     * @param to The position the direction vector is pointing to
     */
    public static direction(from: Vector2, to: Vector2): Vector2 {
        return new Vector2(to.x - from.x, to.y - from.y).normalized;
    }

    /**
     * 
     * @param vector The vector to normalize. This will change the passed in vector, not return a new one.
     */
    public static normalize(vector: Vector2): Vector2 {
        return vector.divide(new Vector2(vector.magnitude, vector.magnitude));
    }

    public get sqrMagnitude(): number {
        return (this.x * this.x) + (this.y * this.y);
    }

    public get magnitude(): number {
        return Math.sqrt(this.sqrMagnitude);
    }

    public get normalized(): Vector2 {
        return Vector2.divide(this, new Vector2(this.magnitude, this.magnitude));
    }

    /**
     * This will add the passed in vector to the calling vector. The calling vector will be modified.
     * 
     * @param rightOperand 
     */
    public add(rightOperand: Vector2): Vector2 {
        this.x += rightOperand.x;
        this.y += rightOperand.y;

        return this;
    }

    public subtract(rightOperand: Vector2): Vector2 {
        this.x -= rightOperand.x;
        this.y -= rightOperand.y;

        return this;
    }

    public multiply(rightOperand: Vector2): Vector2 {
        this.x *= rightOperand.x;
        this.y *= rightOperand.y;

        return this;
    }

    public divide(rightOperand: Vector2): Vector2 {
        if (rightOperand.x === 0 || rightOperand.y === 0) {
            console.warn('Attempting to divide by 0!');
        }

        this.x /= rightOperand.x;
        this.y /= rightOperand.y;

        return this;
    }

    public equals(x: number, y: number): boolean;
    public equals(rightOperand: Vector2): boolean;
    public equals(rightOperandOrX: Vector2 | number, y?: number): boolean {
        if (typeof rightOperandOrX === 'number') {
            return this.x === rightOperandOrX && this.y === y;
        }
        else {
            return this.x === rightOperandOrX.x && this.y === rightOperandOrX.y;
        }
    }

    public isCloseTo(rightOperand: Vector2, leniency: number = 1): boolean {
        const closeX = Math.abs(this.x - rightOperand.x) <= leniency;
        const closeY = Math.abs(this.y - rightOperand.y) <= leniency;

        return closeX && closeY;
    }

    public multiplyScalar(rightOperand: number): Vector2 {
        this.x *= rightOperand;
        this.y *= rightOperand;

        return this;
    }

    public divideScalar(rightOperand: number): Vector2 {
        if (rightOperand === 0) {
            console.warn('Attempting to divide by 0!');
        }
        
        this.x /= rightOperand;
        this.y /= rightOperand;

        return this;
    }

    public zero(): Vector2 {
        this.x = 0;
        this.y = 0;

        return this;
    }

    public clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    public toString(): string {
        return this.x + ',' + this.y;
    }
}