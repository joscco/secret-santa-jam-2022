import {Polygon2D} from "../../../General/Polygon2D";
import {
    findLineIntersection, mirror,
    Vector2D, vectorAdd,
    vectorDistance,
    vectorDot,
    vectorLength,
    vectorLerp,
    vectorSub
} from "../../../General/Helpers";
import {Bumper} from "./Bumper";

export class LineReflector {

    polygons: Polygon2D[]
    bumpers: Bumper[]
    MAX_REFLECTIONS: number = 5

    constructor(polygons: Polygon2D[], bumpers: Bumper[]) {
        this.polygons = polygons
        this.bumpers = bumpers
    }

    reflectLine(startPath: Vector2D[], rayStart: Vector2D, rayEnd: Vector2D, maxReflections: number = this.MAX_REFLECTIONS): Vector2D[] {
        if (maxReflections === 0) {
            return [...startPath]
        }

        let result: Vector2D[] = [...startPath]
        let rayDirection = vectorSub(rayStart, rayEnd)
        let rayLength = vectorDistance(rayStart, rayEnd)

        let intersectionPoints: { point: Vector2D, lineDirection: Vector2D, cutAngle: number, isBumper: boolean }[] = []
        this.findPolygonHitPoints(rayDirection, rayLength, rayStart, rayEnd, intersectionPoints);
        this.findBumperHitPoints(rayStart, rayEnd, rayDirection, rayLength, intersectionPoints);

        intersectionPoints = intersectionPoints
            // Avoid reflection on same line
            .filter(point => vectorDistance(point.point, rayStart) > 1)
            .sort((a, b) => vectorDistance(a.point, rayStart) - vectorDistance(b.point, rayStart))

        if (intersectionPoints.length !== 0) {
            let finalIntersection = intersectionPoints[0].point
            result.push(finalIntersection)

            // Search for further reflections
            let remainingRayEnd = intersectionPoints[0].isBumper ? vectorLerp(finalIntersection, rayEnd, 2) : rayEnd
            let remainingRay = vectorSub(remainingRayEnd, finalIntersection)
            let mirroredRay = mirror(remainingRay, intersectionPoints[0].lineDirection)
            result = this.reflectLine(result, finalIntersection, vectorAdd(finalIntersection, mirroredRay), maxReflections - 1)
        } else {
            result.push(rayEnd)
        }

        return result
    }

    private findPolygonHitPoints(rayDirection: Vector2D, rayLength: number, rayStart: Vector2D, rayEnd: Vector2D, intersectionPoints: { point: Vector2D; lineDirection: Vector2D; cutAngle: number; isBumper: boolean }[]) {
        for (let polygon of this.polygons) {
            polygon.forEachSideDo((polySideStart, polySideEnd) => {
                let polySideDirection = vectorSub(polySideEnd, polySideStart)
                let polySideLength = vectorLength(polySideDirection)
                let cutAngle = Math.acos(Math.abs(vectorDot(rayDirection, polySideDirection)) / (rayLength * polySideLength))

                let intersection = findLineIntersection(rayStart, rayEnd, polySideStart, polySideEnd)
                if (intersection) {
                    // If intersection is the edge of a polygon Side, put it a bit of to avoid "passing through corners"
                    if (vectorDistance(intersection, polySideStart) < 5) {
                        intersection = vectorLerp(intersection, polySideEnd, 0.01)
                    } else if (vectorDistance(intersection, polySideEnd) < 5) {
                        intersection = vectorLerp(polySideStart, intersection, 0.99)
                    }

                    intersectionPoints.push({
                        point: intersection,
                        lineDirection: polySideDirection,
                        cutAngle: cutAngle,
                        isBumper: false
                    })
                }
            })
        }
    }

    private findBumperHitPoints(rayStart: Vector2D, rayEnd: Vector2D, rayDirection: Vector2D, rayLength: number, intersectionPoints: { point: Vector2D; lineDirection: Vector2D; cutAngle: number; isBumper: boolean }[]) {
        for (let bumper of this.bumpers) {
            let bumperStart = vectorAdd(bumper.position, {x: 0, y: -60})
            let bumperEnd = vectorAdd(bumper.position, {x: 0, y: 60})
            let intersection = findLineIntersection(rayStart, rayEnd, bumperStart, bumperEnd)
            let cutAngle = Math.acos(Math.abs(vectorDot(rayDirection, {x: 0, y: 120})) / (rayLength * 120))
            if (intersection) {
                let bumperDirection = vectorSub(bumperEnd, bumperStart)
                intersectionPoints.push({
                    point: intersection,
                    lineDirection: bumperDirection,
                    cutAngle: cutAngle,
                    isBumper: true
                })
            }
        }
    }
}