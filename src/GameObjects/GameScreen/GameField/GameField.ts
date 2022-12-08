import {Container, Graphics, LINE_JOIN, Polygon, Sprite} from "pixi.js";
import {Player} from "./Player";
import {HookGun} from "./HookGun";
import {Hook} from "./Hook";
import {GAME_HEIGHT, GAME_WIDTH} from "../../../index";
import {InputManager} from "../../../General/InputManager";
import {
    harmonizeAngle,
    lerp,
    normalize,
    Vector2D,
    vectorAdd,
    vectorDistance,
    vectorDot,
    vectorLength,
    vectorLerp,
    vectorMultiply,
    vectorSub
} from "../../../General/Helpers";
import {Rope} from "./Rope";
import {PreviewRope} from "./PreviewRope";
import Tweener from "../../../General/Tweener";
import {Texture} from "@pixi/core";

const PLAYER_HOOK_DURATION = 150
const HOOK_HOOK_DURATION = 100

export class GameField extends Container {
    field: Container

    blockPolygons: Polygon[]
    linePath: Vector2D[] = []

    player: Player
    gun: HookGun
    rope: Rope
    previewRope: PreviewRope
    hook: Hook

    inputManager: InputManager

    drawingToHook: boolean = false
    inHookShooting: boolean = false

    constructor() {
        super()
        this.field = new Sprite(Texture.WHITE)
        this.field.alpha = 0.1
        this.field.width = GAME_WIDTH
        this.field.height = GAME_HEIGHT

        this.player = new Player()
        this.player.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 2)
        this.rope = new Rope()
        this.previewRope = new PreviewRope()
        this.previewRope.alpha = 0

        this.gun = new HookGun()
        this.gun.position = this.player.position
        this.hook = new Hook()
        this.hook.position = this.gun.hookPoint.getGlobalPosition()


        this.blockPolygons = [
            new Polygon([200, 200, GAME_WIDTH - 200, 200, GAME_WIDTH - 200, GAME_HEIGHT - 200, 200, GAME_HEIGHT - 200]),
            new Polygon(700, 600, GAME_WIDTH - 700, 600, GAME_WIDTH / 2, 800)]
        this.blockPolygons.forEach(poly => poly.closeStroke = true)

        let fieldPolygonDrawer = new Graphics().lineStyle({
            width: 50,
            color: 0x005500,
            join: LINE_JOIN.ROUND
        })
        this.blockPolygons.forEach(poly => fieldPolygonDrawer.drawPolygon(poly))

        this.inputManager = new InputManager()
        this.inputManager.initMouseControls(this.field, () => this.onPointerDown(), () => this.onPointerUp())

        this.addChild(this.field, fieldPolygonDrawer, this.player, this.previewRope, this.rope, this.gun, this.hook)
    }

    update(delta: number) {
        this.inputManager.update()
        let mousePosition = this.inputManager.getMousePosition()
        let runningDirection = this.inputManager.getRunningDirection()

        if (!this.drawingToHook) {
            this.player.runTowards(delta, runningDirection)
            this.rotateGun(mousePosition, delta);
        }

        this.gun.position = this.player.position

        if (!this.inHookShooting) {
            if (this.inputManager.isMouseDown()) {
                // This is better than using Tween
                this.previewRope.alpha = lerp(this.previewRope.alpha, 1, 0.05)
                this.updatePreviewRope(mousePosition)
            }
            this.hook.scale.x = this.gun.gunSprite.scale.x
            let harmonizedHookRotation = harmonizeAngle(this.gun.gunSprite.rotation, this.hook.rotation)
            this.hook.rotation = lerp(this.hook.rotation, harmonizedHookRotation, 0.2)
            this.hook.position = vectorLerp(this.hook.position, this.gun.hookPoint.getGlobalPosition(), 0.2)
        }
    }

    private rotateGun(mousePosition: Vector2D, delta: number) {
        this.gun.rotateTowards(mousePosition, delta)
    }

    updatePreviewRope(mousePosition: Vector2D) {
        this.linePath = this.reflectLine([this.gun.hookPoint.getGlobalPosition()], this.gun.hookPoint.getGlobalPosition(), mousePosition)
        this.previewRope.update(this.linePath)
    }

    private async onPointerDown() {
        this.updatePreviewRope(this.inputManager.getMousePosition())
    }

    private async onPointerUp() {
        Tweener.of(this.previewRope).to({alpha: 0}).duration(300).start()
        if (!this.drawingToHook && !this.inHookShooting) {
            this.inHookShooting = true
            await this.hookHookTo(this.linePath)
            this.drawingToHook = true
            await this.hookPlayerTo(this.linePath)
            this.rope.clear()
            this.linePath = []
            this.drawingToHook = false
            this.inHookShooting = false
        }
    }

    async hookHookTo(linePath: Vector2D[]) {
        this.rope.addPoint(linePath[0])
        for (let position of linePath.slice(1, linePath.length)) {
            this.rope.addPoint(this.hook.position)
            let segmentDirection = vectorSub(position, this.hook.position)
            this.hook.rotation = Math.atan2(segmentDirection.y, segmentDirection.x)
            await Tweener.of(this.hook.position)
                .to({x: position.x, y: position.y})
                .duration(HOOK_HOOK_DURATION)
                .onUpdate(() => this.rope.setLast(this.hook.position))
                .start()
                .promise()
        }
    }

    async hookPlayerTo(linePath: Vector2D[]): Promise<any> {
        for (let pathPosition of linePath.slice(1)) {
            let playerPositionBefore = this.player.position
            let val = {x: 0}
            await Tweener.of(val)
                .to({x: 1})
                .duration(PLAYER_HOOK_DURATION)
                .onUpdate((object) => {
                    this.player.position = vectorLerp(playerPositionBefore, pathPosition, object.x)
                    this.rope.setFirstPoint(this.gun.hookPoint.getGlobalPosition())
                })
                .start()
                .promise()
            this.rope.dropFirstPoint()
        }
        this.rope.dropFirstPoint()
    }

    private findLineIntersection(start1: Vector2D, end1: Vector2D, start2: Vector2D, end2: Vector2D): Vector2D | undefined {
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

    private reflectLine(startPath: Vector2D[], start: Vector2D, end: Vector2D, maxReflections: number = 100): Vector2D[] {
        if (maxReflections === 0) {
            return [...startPath, end]
        }

        let rayDirection = vectorSub(start, end)
        let rayLength = vectorDistance(start, end)

        let intersectionPoints: { point: Vector2D, lineDirection: Vector2D }[] = []

        for (let poly of this.blockPolygons) {
            const length = poly.points.length / 2;
            for (let i = 0, j = length - 1; i < length; j = i++) {
                const startPolyLine = {x: poly.points[i * 2], y: poly.points[(i * 2) + 1]};
                const endPolyLine = {x: poly.points[j * 2], y: poly.points[(j * 2) + 1]};

                // Die rechnung von unten lässt sich hier noch nicht machen. Also ruhig weit gehen
                let dir2 = vectorSub(endPolyLine, startPolyLine)
                let cutAngle = Math.acos(Math.abs(vectorDot(rayDirection, dir2)) / (rayLength * vectorLength(dir2)))
                let distanceSmallerNeeded = 25 / Math.sin(cutAngle)
                let advancedEnd = vectorLerp(start, end, (rayLength + distanceSmallerNeeded) / rayLength)

                let intersection = this.findLineIntersection(start, advancedEnd, startPolyLine, endPolyLine)
                if (intersection) {
                    let polyLineDirection = vectorSub(endPolyLine, startPolyLine)
                    intersectionPoints.push({
                        point: intersection,
                        lineDirection: polyLineDirection
                    })
                }
            }
        }

        intersectionPoints = intersectionPoints
            // Avoid reflection on same line
            .filter(point => vectorDistance(point.point, start) > 1)
            .sort((a, b) => vectorDistance(a.point, start) - vectorDistance(b.point, start))

        if (intersectionPoints.length !== 0) {
            let finalIntersection = intersectionPoints[0].point
            let lastPoint = startPath[startPath.length - 1]
            let length = vectorDistance(lastPoint, finalIntersection)

            // Den Teil hier besser aufschreiben:
            // Idee: Gehe vom eigentlichen Schnittpunkt wieder ein Stück zurück
            // In normalenrichtung von der Schnittlinie soll dabei der Abstand konstant sein
            let dir2 = intersectionPoints[0].lineDirection
            let cutAngle = Math.acos(Math.abs(vectorDot(rayDirection, dir2)) / (rayLength * vectorLength(dir2)))
            let distanceSmallerNeeded = 25 / Math.sin(cutAngle)
            let preIntersectionPoint = vectorLerp(lastPoint, finalIntersection, (length - distanceSmallerNeeded) / length)
            startPath.push(preIntersectionPoint)

            // Search for further reflections
            let remainingRay = vectorSub(end, preIntersectionPoint)
            let mirroredRay = this.mirrorVector(remainingRay, intersectionPoints[0].lineDirection)
            startPath = this.reflectLine(startPath, preIntersectionPoint, vectorAdd(preIntersectionPoint, mirroredRay), maxReflections - 1)
        } else {
            startPath.push(end)
        }

        return startPath
    }

    private mirrorVector(vector: Vector2D, mirror: Vector2D): Vector2D {
        let normalizedMirror = normalize(mirror)
        let negatedVector = vectorMultiply(-1, vector)
        return vectorAdd(negatedVector, vectorMultiply(2 * vectorDot(vector, normalizedMirror), normalizedMirror))
    }
}