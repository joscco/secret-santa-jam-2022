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
    LINE_HIT_DISTANCE = 0

    constructor(polygons: Polygon2D[], bumpers: Bumper[]) {
        this.polygons = polygons
        this.bumpers = bumpers
    }

    reflectLine(startPath: Vector2D[], rayStart: Vector2D, rayEnd: Vector2D, maxReflections: number = 100): Vector2D[] {
        if (maxReflections === 0) {
            return [...startPath, rayEnd]
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
            let lastPoint = startPath[startPath.length - 1]
            let length = vectorDistance(lastPoint, finalIntersection)

            // Den Teil hier besser aufschreiben:
            // Idee: Gehe vom eigentlichen Schnittpunkt wieder ein Stück zurück,
            // in Normalenrichtung von der Schnittlinie soll dabei der Abstand konstant sein.
            let distanceSmallerNeeded = this.LINE_HIT_DISTANCE / Math.sin(intersectionPoints[0].cutAngle)
            let preIntersectionPoint = vectorLerp(lastPoint, finalIntersection, (length - distanceSmallerNeeded) / length)
            result.push(preIntersectionPoint)

            // Search for further reflections
            let remainingRayEnd = intersectionPoints[0].isBumper ? vectorLerp(preIntersectionPoint, rayEnd, 2) : rayEnd
            let remainingRay = vectorSub(remainingRayEnd, preIntersectionPoint)
            let mirroredRay = mirror(remainingRay, intersectionPoints[0].lineDirection)
            result = this.reflectLine(result, preIntersectionPoint, vectorAdd(preIntersectionPoint, mirroredRay), maxReflections - 1)
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
                // Perpendicular distance from line to HitPoint should be 25 pixels
                // Calculate the distance from rayEnd to this pre hitpoint
                let distanceToPreHitpoint = this.LINE_HIT_DISTANCE / Math.sin(cutAngle)
                let preHitPoint = vectorLerp(rayStart, rayEnd, (rayLength + distanceToPreHitpoint) / rayLength)

                let intersection = findLineIntersection(rayStart, preHitPoint, polySideStart, polySideEnd)
                if (intersection) {
                    let polyLineDirection = vectorSub(polySideEnd, polySideStart)
                    intersectionPoints.push({
                        point: intersection,
                        lineDirection: polyLineDirection,
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