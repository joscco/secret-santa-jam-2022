declare global {
    interface Array<T> {
        add(): number,
        multiply(scalar: number): number[],
        floor(): number[],
        ceil(): number[],

        contains(element: T): boolean;
        max(sortFn: (a: T, b: T) => number): T,
        slideWindow(width: number): T[][]
    }
}

Array.prototype.add = function (): number {
    return this.reduce((a, b) => a + b, 0)
}

Array.prototype.multiply = function(scalar: number): number[] {
    return this.map(val => scalar * val)
}

Array.prototype.floor = function (): number[] {
    return this.map(val => Math.floor(val))
}

Array.prototype.ceil = function (): number[] {
    return this.map(val => Math.ceil(val))
}

Array.prototype.contains = function <T>(element: T): boolean {
    return this.indexOf(element) > -1
}

Array.prototype.max = function <T>(sortFn: (a: T, b: T) => number): number {
    let currentMax = this[0]
    for (let i = 1; i < this.length; i++) {
        if (sortFn(currentMax, this[i]) <= 0) {
            currentMax = this[i]
        }
    }
    return currentMax
}

Array.prototype.slideWindow = function <T>(width: number): T[][] {
    let result = [];
    for (let i = width - 1; i < this.length; i++) {
        result.push(this.slice(i - width + 1, i + 1))
    }
    return result
}

export function ORDER_NATURAL(a: number, b: number): number {
    return a - b
}