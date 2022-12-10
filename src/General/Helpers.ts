// String stuff
export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Async stuff
export function sleep(durationInMS: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, durationInMS))
}

// Math stuff

export type VerticalDirection = "UP" | "DOWN" | "NONE"

export function getVerticalDirectionForIndices(from: Index2D, to: Index2D): VerticalDirection {
    let verticalDiff = to.row - from.row;
    if (verticalDiff > 0) {
        return "DOWN"
    } else if (verticalDiff < 0) {
        return "UP"
    }
    return "NONE"
}

export type Vector2D = {
    x: number,
    y: number
}

export type Index2D = {
    row: number,
    column: number
}

export function indexEquals(index1: Index2D, index2: Index2D) {
    return index1.row === index2.row && index1.column === index2.column
}

export function quadIndexDistance(a: Index2D, b: Index2D): number {
    return (a.row - b.row) * (a.row - b.row) + (a.column - b.column) * (a.column - b.column)
}

export function quadVectorDistance(a: Vector2D, b: Vector2D): number {
    return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)
}

export function vectorDistance(a: Vector2D, b: Vector2D): number {
    return Math.sqrt(quadVectorDistance(a, b))
}

export function quadVectorLength(direction: Vector2D) {
    return quadVectorDistance({x: 0, y: 0}, direction)
}

export function vectorLength(direction: Vector2D) {
    return Math.sqrt(quadVectorDistance({x: 0, y: 0}, direction))
}

export function clampAndRound(value: number, min: number, max: number): number {
    return Math.round(clamp(value, min, max));
}

export function clamp(value: number, min: number, max: number): number {
    let minNum = Math.min(min, max)
    let maxNum = Math.max(min, max)
    return Math.max(minNum, Math.min(maxNum, value));
}

export function isRectangularArray(items: any[][]): boolean {
    if (items.length === 0 || items[0].length === 0) {
        return false;
    }

    let firstColumnNumber = items[0].length;
    for (let rowIndex = 1; rowIndex < items.length; rowIndex++) {
        if (items[rowIndex].length !== firstColumnNumber) {
            return false;
        }
    }

    return true;
}

export function vectorAdd(a: Vector2D, b: Vector2D): Vector2D {
    return {x: a.x + b.x, y: a.y + b.y}
}

export function vectorSub(a: Vector2D, b: Vector2D): Vector2D {
    return {x: a.x - b.x, y: a.y - b.y}
}

export function indexAdd(a: Index2D, b: Index2D): Index2D {
    return {row: a.row + b.row, column: a.column + b.column}
}

export function vectorMultiply(scalar: number, v: Vector2D) {
    return {x: v.x * scalar, y: v.y * scalar};
}

export function vectorDot(u: Vector2D, v: Vector2D): number {
    return u.x * v.x + u.y * v.y;
}

export function limit(v: Vector2D, length: number): Vector2D {
    if (v.x === 0 && v.y === 0) {
        return v
    }

    let dist = vectorDistance({x: 0, y: 0}, v)
    let sanitizedDist = Math.max(0.01, dist)
    return vectorMultiply(Math.min(length, length / sanitizedDist), v)
}

export function normalize(v: Vector2D): Vector2D{
    if (v.x === 0 && v.y === 0) {
        return v
    }

    let dist = vectorDistance({x: 0, y: 0}, v)
    let sanitizedDist = Math.max(0.001, dist)
    return vectorMultiply(1 / sanitizedDist, v)
}

export function vectorLerp(vec1: Vector2D, vec2: Vector2D, amount: number) {
    return {x: lerp(vec1.x, vec2.x, amount), y: lerp(vec1.y, vec2.y, amount)}
}

export function mirror(vector: Vector2D, mirror: Vector2D): Vector2D {
    let normalizedMirror = normalize(mirror)
    let negatedVector = vectorMultiply(-1, vector)
    return vectorAdd(negatedVector, vectorMultiply(2 * vectorDot(vector, normalizedMirror), normalizedMirror))
}

export function findLineIntersection(start1: Vector2D, end1: Vector2D, start2: Vector2D, end2: Vector2D): Vector2D | undefined {
    // See https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
    let t_up = (start1.x - start2.x) * (start2.y - end2.y) - (start1.y - start2.y) * (start2.x - end2.x)
    let t_down = (start1.x - end1.x) * (start2.y - end2.y) - (start1.y - end1.y) * (start2.x - end2.x)

    let u_up = (start1.x - start2.x) * (start1.y - end1.y) - (start1.y - start2.y) * (start1.x - end1.x)
    let u_down = (start1.x - end1.x) * (start2.y - end2.y) - (start1.y - end1.y) * (start2.x - end2.x)

    // We have to have 0 <= t_up / t_down <= 1 if the two lines shall intersect
    if (t_down !== 0 && u_down !== 0
        && Math.sign(t_up) == Math.sign(t_down)
        && Math.sign(u_down) == Math.sign(u_up)
        && Math.abs(t_up) <= Math.abs(t_down)
        && Math.abs(u_up) <= Math.abs(u_down)
    ) {
        let t = t_up / t_down
        return vectorLerp(start1, end1, t)
    }

    // Both lines will not have an intersection
    return undefined
}

export function lerp(value: number, to: number, amount: number) {
    return value + amount * (to - value);
}

export function lerpAbs(value: number, to: number, amount: number) {
    return clamp(to, value - amount, value + amount);
}

export function harmonizeAngle(angle: number, other: number) {
    if (Math.abs(angle - other) <= Math.PI) {
        return angle
    }
    return other + smallestMod(angle - other, 2 * Math.PI)
}

export function positiveMod(x: number, n: number) {
    return ((x % n) + n) % n;
}

export function smallestMod(x: number, n: number) {
    let preResult = x % n
    if (Math.abs(preResult) > n / 2) {
        return preResult - n * Math.sign(preResult)
    }
    return preResult
}