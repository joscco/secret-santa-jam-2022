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
    } else if(verticalDiff < 0) {
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

export function indexAdd(a: Index2D, b: Index2D): Index2D {
    return {row: a.row + b.row, column: a.column + b.column}
}