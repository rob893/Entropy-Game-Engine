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
        return this.divide(new Vector2(this.magnitude, this.magnitude));
    }
    add(rightOperand) {
        let newX = this.x + rightOperand.x;
        let newY = this.y + rightOperand.y;
        return new Vector2(newX, newY);
    }
    subtract(rightOperand) {
        let newX = this.x - rightOperand.x;
        let newY = this.y - rightOperand.y;
        return new Vector2(newX, newY);
    }
    multiply(rightOperand) {
        let newX = this.x * rightOperand.x;
        let newY = this.y * rightOperand.y;
        return new Vector2(newX, newY);
    }
    divide(rightOperand) {
        let newX = this.x / rightOperand.x;
        let newY = this.y / rightOperand.y;
        return new Vector2(newX, newY);
    }
    equals(rightOperand) {
        let equalX = this.x === rightOperand.x;
        let equalY = this.y === rightOperand.y;
        return equalX && equalY;
    }
    multiplyScalar(rightOperand) {
        let newX = this.x * rightOperand;
        let newY = this.y * rightOperand;
        return new Vector2(newX, newY);
    }
    static get up() {
        return new Vector2(0, 1);
    }
    static get down() {
        return new Vector2(0, -1);
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
    static distance(point1, point2) {
        let distanceX = point1.x - point2.x;
        let distanceY = point1.y - point2.y;
        return Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));
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
}
//# sourceMappingURL=Vector2.js.map