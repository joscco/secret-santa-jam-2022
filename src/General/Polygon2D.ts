import {Vector2D} from "./Helpers";

export class Polygon2D {
    points: Vector2D[]

    constructor(points: Vector2D[]) {
        this.points = points
    }

    contains(point: Vector2D) {
        let inside = false;
        // use some raycasting to test hits
        // https://github.com/substack/point-in-polygon/blob/master/index.js
        this.forEachSideDo((start, end) => {
            const intersect = ((start.y > point.y) !== (end.y > point.y))
                && (point.x < ((end.x - start.x) * ((point.y - start.y) / (end.y - start.y))) + start.x);
            if (intersect) {
                inside = !inside;
            }
        })
        return inside;
    }

    forEachSideDo(fn: (startPoint: Vector2D, endPoint: Vector2D) => void) {
        const length = this.points.length
        for (let i = 0, j = length - 1; i < length; j = i++) {
            const start = this.points[i]
            const end = this.points[j]
            fn(start, end)
        }
    }
}