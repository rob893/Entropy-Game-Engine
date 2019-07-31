export class Vector2 {
    constructor(x, y) {
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
    }
    get sqrMagnitude() {
        return (this.x * this.x) + (this.y * this.y);
    }
    get magnitude() {
        return Math.sqrt(this.sqrMagnitude);
    }
    get normalized() {
        return Vector2.divide(this, new Vector2(this.magnitude, this.magnitude));
    }
    add(rightOperand) {
        this.x += rightOperand.x;
        this.y += rightOperand.y;
        return this;
    }
    subtract(rightOperand) {
        this.x -= rightOperand.x;
        this.y -= rightOperand.y;
        return this;
    }
    multiply(rightOperand) {
        this.x *= rightOperand.x;
        this.y *= rightOperand.y;
        return this;
    }
    divide(rightOperand) {
        this.x /= rightOperand.x;
        this.y /= rightOperand.y;
        return this;
    }
    equals(rightOperand) {
        const equalX = this.x === rightOperand.x;
        const equalY = this.y === rightOperand.y;
        return equalX && equalY;
    }
    isCloseTo(rightOperand, leniency = 1) {
        const closeX = Math.abs(this.x - rightOperand.x) <= leniency;
        const closeY = Math.abs(this.y - rightOperand.y) <= leniency;
        return closeX && closeY;
    }
    multiplyScalar(rightOperand) {
        this.x *= rightOperand;
        this.y *= rightOperand;
        return this;
    }
    divideScalar(rightOperand) {
        this.x /= rightOperand;
        this.y /= rightOperand;
        return this;
    }
    zero() {
        this.x = 0;
        this.y = 0;
        return this;
    }
    toString() {
        return this.x + ',' + this.y;
    }
    static fromString(xCommaY) {
        if (xCommaY.split(',').length < 2) {
            throw new Error(xCommaY + ' is invalid format. It should be x,y (eg: 5,6)');
        }
        const x = Number(xCommaY.split(',')[0]);
        const y = Number(xCommaY.split(',')[1]);
        return new Vector2(x, y);
    }
    static get up() {
        return new Vector2(0, -1);
    }
    static get down() {
        return new Vector2(0, 1);
    }
    static get left() {
        return new Vector2(-1, 0);
    }
    static get right() {
        return new Vector2(1, 0);
    }
    static get zero() {
        return new Vector2(0, 0);
    }
    static get one() {
        return new Vector2(1, 1);
    }
    static add(leftOperand, rightOperand) {
        return new Vector2(leftOperand.x + rightOperand.x, leftOperand.y + rightOperand.y);
    }
    static subtract(leftOperand, rightOperand) {
        return new Vector2(leftOperand.x - rightOperand.x, leftOperand.y - rightOperand.y);
    }
    static multiply(leftOperand, rightOperand) {
        return new Vector2(leftOperand.x * rightOperand.x, leftOperand.y * rightOperand.y);
    }
    static divide(leftOperand, rightOperand) {
        return new Vector2(leftOperand.x / rightOperand.x, leftOperand.y / rightOperand.y);
    }
    static multiplyScalar(leftOperand, scalar) {
        return new Vector2(leftOperand.x * scalar, leftOperand.y * scalar);
    }
    static divideScalar(leftOperand, scalar) {
        return new Vector2(leftOperand.x / scalar, leftOperand.y / scalar);
    }
    static distance(point1, point2) {
        let distanceX = point1.x - point2.x;
        let distanceY = point1.y - point2.y;
        return Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));
    }
    static distanceSqrd(point1, point2) {
        let distanceX = point1.x - point2.x;
        let distanceY = point1.y - point2.y;
        return (distanceX * distanceX) + (distanceY * distanceY);
    }
    static angleInRadians(from, to) {
        let cos0 = Vector2.dot(from, to) / (from.magnitude * to.magnitude);
        return Math.acos(cos0);
    }
    static angleInDegrees(from, to) {
        return this.angleInRadians(from, to) * 180 / Math.PI;
    }
    static dot(point1, point2) {
        return (point1.x * point2.x) + (point1.y * point2.y);
    }
    static direction(point1, point2) {
        return new Vector2(point2.x - point1.x, point2.y - point1.y).normalized;
    }
}
//# sourceMappingURL=Vector2.js.map