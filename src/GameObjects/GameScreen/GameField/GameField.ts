import {Container, Graphics, Polygon, Sprite} from "pixi.js";
import {Player} from "./Player";
import {HookGun} from "./HookGun";
import {Hook} from "./Hook";
import {ASSET_MANAGER, GAME_HEIGHT, GAME_WIDTH} from "../../../index";
import {InputManager} from "../../../General/InputManager";
import {
    normalize,
    quadVectorDistance,
    sleep,
    Vector2D,
    vectorAdd, vectorDistance,
    vectorDot,
    vectorLerp,
    vectorMultiply,
    vectorSub
} from "../../../General/Helpers";
import {Rope} from "./Rope";
import {PreviewRope} from "./PreviewRope";
import Tweener from "../../../General/Tweener";

export class GameField extends Container {
    field: Sprite

    blockPolygons: Polygon[]

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
        this.field = new Sprite(ASSET_MANAGER.getTextureAsset("field"))
        this.field.anchor.set(0.5)
        this.field.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 2)

        this.player = new Player()
        this.rope = new Rope()
        this.previewRope = new PreviewRope()
        this.previewRope.alpha = 0
        this.gun = new HookGun()
        this.hook = new Hook()

        this.blockPolygons = [new Polygon([20, 20, 800, 20, 800, 600, 20, 600]), new Polygon(300, 300, 300, 500, 500, 500)]
        this.blockPolygons.forEach(poly => poly.closeStroke = true)

        let fieldPolygonDrawer = new Graphics()
            .lineStyle(20, 0x000fff)
        this.blockPolygons.forEach(poly => fieldPolygonDrawer.drawPolygon(poly))

        this.inputManager = new InputManager()
        this.inputManager.initMouseControls(this.field, () => this.onPointerDown(), (pos) => this.onPointerUp(pos))

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
                this.updatePreviewRope(mousePosition)
            }
            this.hook.scale.x = this.gun.gunSprite.scale.x
            this.hook.rotation = this.gun.gunSprite.rotation
            this.hook.position = this.gun.gunSprite.toGlobal({x: 100, y: 20})
        }
    }

    private rotateGun(mousePosition: Vector2D, delta: number) {
        this.gun.rotateTowards(mousePosition, delta)
    }

    updateRope() {
        this.rope.update(this.hook.position, this.gun.gunSprite.toGlobal({x: 100, y: 20}))
    }

    updatePreviewRope(mousePosition: Vector2D) {
        let linePath = this.reflectLine([this.gun.gunSprite.toGlobal({
            x: 100,
            y: 20
        })], this.gun.gunSprite.toGlobal({x: 100, y: 20}), mousePosition)
        this.previewRope.update(linePath)
    }

    private async onPointerDown() {
        this.updatePreviewRope(this.inputManager.getMousePosition())
        Tweener.of(this.previewRope).to({alpha: 1}).duration(300).start()
    }

    private async onPointerUp(mousePosition: Vector2D) {
        Tweener.of(this.previewRope).to({alpha: 0}).duration(300).start()
        if (!this.drawingToHook && !this.inHookShooting) {
            this.inHookShooting = true
            await this.hook.hookTo(mousePosition, () => this.updateRope())
            this.drawingToHook = true
            this.player.hookTo(this.hook, () => this.updateRope())
            await sleep(400)
            this.drawingToHook = false
            this.rope.clear()

            // Wait a small time so that the hook can rotate back
            this.inHookShooting = false
        }
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

        let intersectionPoints: { point: Vector2D, lineDirection: Vector2D }[] = []

        for (let poly of this.blockPolygons) {
            const length = poly.points.length / 2;
            for (let i = 0, j = length - 1; i < length; j = i++) {
                const startPolyLine = {x: poly.points[i * 2], y: poly.points[(i * 2) + 1]};
                const endPolyLine = {x: poly.points[j * 2], y: poly.points[(j * 2) + 1]};
                let intersection = this.findLineIntersection(start, end, startPolyLine, endPolyLine)
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
            startPath.push(finalIntersection)

            // Search for further reflections
            let remainingRay = vectorSub(end, finalIntersection)
            let mirroredRay = this.mirrorVector(remainingRay, intersectionPoints[0].lineDirection)
            startPath = this.reflectLine(startPath, finalIntersection, vectorAdd(finalIntersection ,mirroredRay), maxReflections - 1)
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