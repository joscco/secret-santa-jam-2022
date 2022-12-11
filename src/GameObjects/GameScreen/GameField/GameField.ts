import {Container, Sprite} from "pixi.js";
import {Hedgehog} from "./Hedgehog";
import {Hook} from "./Hook";
import {ASSET_MANAGER, GAME_HEIGHT, GAME_WIDTH} from "../../../index";
import {InputManager} from "../../../General/InputManager";
import {
    findLineIntersection,
    harmonizeAngle,
    lerp,
    mirror,
    Vector2D,
    vectorAdd,
    vectorDistance,
    vectorDot,
    vectorLength,
    vectorLerp,
    vectorSub
} from "../../../General/Helpers";
import {Rope} from "./Rope";
import {PreviewRope} from "./PreviewRope";
import Tweener from "../../../General/Tweener";
import {Texture} from "@pixi/core";
import {COLOR_FLOOR_0, COLOR_FLOOR_1, COLOR_FLOOR_2, COLOR_FLOOR_3, COLOR_FLOOR_4, COLOR_FLOOR_5} from "./Colors";
import {TextureAssetID} from "../../../General/AssetManager";
import {Polygon2D} from "../../../General/Polygon2D";
import {Easing} from "@tweenjs/tween.js";

const PLAYER_HOOK_SPEED = 1/30
const HOOK_HOOK_DURATION = 100

export class GameField extends Container {
    field: Container

    blockPolygons: Polygon2D[]
    linePath: Vector2D[] = []
    polyWalls: Container

    hedgehog: Hedgehog
    rope: Rope
    previewRope: PreviewRope
    hook: Hook

    inputManager: InputManager

    drawingToHook: boolean = false
    inHookShooting: boolean = false

    constructor() {
        super()
        this.field = this.initRandomField()

        this.hedgehog = new Hedgehog()
        this.hedgehog.position.set(GAME_WIDTH / 2 - 400, GAME_HEIGHT / 2)
        this.rope = new Rope()
        this.previewRope = new PreviewRope()
        this.previewRope.alpha = 0

        this.hook = new Hook()
        this.hook.position = this.hedgehog.getGlobalPosition()

        this.blockPolygons = [
            new Polygon2D([
                {x: 200, y: 100},
                {x: GAME_WIDTH - 200, y: 300},
                {x: GAME_WIDTH - 200, y: GAME_HEIGHT - 100},
                {x: 200, y: GAME_HEIGHT - 300}
            ]),
            new Polygon2D([
                {x: 700, y: 500},
                {x: GAME_WIDTH - 700, y: 500},
                {x: GAME_WIDTH / 2, y: 700}
            ])]
        this.polyWalls = new Container()
        this.polyWalls.sortableChildren = true

        this.inputManager = new InputManager()
        this.inputManager.initMouseControls(this.field, () => this.onPointerDown(), () => this.onPointerUp())

        this.addChild(this.field, this.polyWalls, this.previewRope, this.rope, this.hook, this.hedgehog)
        this.blockPolygons.forEach(poly => this.drawPolygonWall(poly))
        this.polyWalls.cacheAsBitmap = true
    }

    update() {
        let mousePosition = this.inputManager.getMousePosition()
        this.hedgehog.update()

        if (!this.inHookShooting) {
            if (this.inputManager.isMouseDown()) {
                // This is better than using Tween
                this.previewRope.alpha = lerp(this.previewRope.alpha, 1, 0.05)
                this.updatePreviewRope(mousePosition)
            }

            let direction = vectorSub(mousePosition, this.getGlobalPosition())
            let desiredRotation = Math.atan2(direction.y, direction.x)
            let harmonizedHookRotation = harmonizeAngle(desiredRotation, this.hook.rotation)
            this.hook.rotation = lerp(this.hook.rotation, harmonizedHookRotation, 0.2)
            this.hook.position = vectorLerp(this.hook.position, this.hedgehog.position, 0.2)
        }
    }

    updatePreviewRope(mousePosition: Vector2D) {
        this.linePath = this.reflectLine([this.hedgehog.getGlobalPosition()], this.hedgehog.getGlobalPosition(), mousePosition)
        this.previewRope.update(this.linePath)
    }

    private async onPointerDown() {
        this.hedgehog.setState("PREROLLING")
        this.updatePreviewRope(this.inputManager.getMousePosition())
    }

    private async onPointerUp() {
        Tweener.of(this.previewRope).to({alpha: 0}).duration(300).start()
        if (!this.drawingToHook && !this.inHookShooting) {
            this.inHookShooting = true
            await this.hookHookTo(this.linePath)
            this.drawingToHook = true
            await this.hookPlayerTo(this.linePath)
            this.rope.setPath([])
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
        this.hedgehog.setState("ROLLING")
        let val = {x: 0}
        let distances = linePath.slideWindow(2).map((points) => vectorDistance(points[0], points[1]))
        let fullDistance = distances.reduce((a, b) => a + b, 0)
        let relativeLengths = distances.map(dist => dist/fullDistance)
        let currentIndex = 0
        let lastFullDistance = 0
        let lastRelativeDistance = 0

        let valToPosition = (val: number) => {
            if (val > (lastFullDistance + distances[currentIndex]) / fullDistance) {
                lastFullDistance += distances[currentIndex]
                lastRelativeDistance = lastFullDistance / fullDistance
                currentIndex++
                this.rope.dropFirstPoint()
            }

            let pathLerp = (val - lastRelativeDistance) / (relativeLengths[currentIndex])
            return vectorLerp(linePath[currentIndex], linePath[currentIndex + 1], pathLerp)
        }

        await Tweener.of(val)
            .to({x: 1})
            .duration(Math.sqrt(fullDistance) / PLAYER_HOOK_SPEED)
            .easing(Easing.Cubic.Out)
            .onUpdate((object) => {
                this.hedgehog.position = valToPosition(object.x)
                if (object.x > 0.8) {
                    this.hedgehog.setState("IDLE")
                }
                this.rope.setFirstPoint(this.hedgehog.position)
            })
            .start()
            .promise()
        this.rope.dropFirstPoint()
    }

    private reflectLine(startPath: Vector2D[], rayStart: Vector2D, rayEnd: Vector2D, maxReflections: number = 100): Vector2D[] {
        if (maxReflections === 0) {
            return [...startPath, rayEnd]
        }

        let result: Vector2D[] = [...startPath]
        let rayDirection = vectorSub(rayStart, rayEnd)
        let rayLength = vectorDistance(rayStart, rayEnd)

        let intersectionPoints: { point: Vector2D, lineDirection: Vector2D, cutAngle: number }[] = []

        for (let poly of this.blockPolygons) {
            poly.forEachSideDo((polySideStart, polySideEnd) => {
                // Die rechnung von unten lässt sich hier noch nicht machen. Also ruhig weit gehen
                let polySideDirection = vectorSub(polySideEnd, polySideStart)
                let cutAngle = Math.acos(Math.abs(vectorDot(rayDirection, polySideDirection)) / (rayLength * vectorLength(polySideDirection)))
                let distanceSmallerNeeded = 25 / Math.sin(cutAngle)
                let advancedEnd = vectorLerp(rayStart, rayEnd, (rayLength + distanceSmallerNeeded) / rayLength)

                let intersection = findLineIntersection(rayStart, advancedEnd, polySideStart, polySideEnd)
                if (intersection) {
                    let polyLineDirection = vectorSub(polySideEnd, polySideStart)
                    intersectionPoints.push({
                        point: intersection,
                        lineDirection: polyLineDirection,
                        cutAngle: cutAngle
                    })
                }
            })
        }

        intersectionPoints = intersectionPoints
            // Avoid reflection on same line
            .filter(point => vectorDistance(point.point, rayStart) > 1)
            .sort((a, b) => vectorDistance(a.point, rayStart) - vectorDistance(b.point, rayStart))

        if (intersectionPoints.length !== 0) {
            let finalIntersection = intersectionPoints[0].point
            let lastPoint = startPath[startPath.length - 1]
            let length = vectorDistance(lastPoint, finalIntersection)

            // Den Teil hier besser aufschreiben:
            // Idee: Gehe vom eigentlichen Schnittpunkt wieder ein Stück zurück
            // In normalenrichtung von der Schnittlinie soll dabei der Abstand konstant sein
            let distanceSmallerNeeded = 25 / Math.sin(intersectionPoints[0].cutAngle)
            let preIntersectionPoint = vectorLerp(lastPoint, finalIntersection, (length - distanceSmallerNeeded) / length)
            result.push(preIntersectionPoint)

            // Search for further reflections
            let remainingRay = vectorSub(rayEnd, preIntersectionPoint)
            let mirroredRay = mirror(remainingRay, intersectionPoints[0].lineDirection)
            result = this.reflectLine(result, preIntersectionPoint, vectorAdd(preIntersectionPoint, mirroredRay), maxReflections - 1)
        } else {
            result.push(rayEnd)
        }

        return result
    }

    private createEllipticRandomBackgroundSprites(
        minAmount: number, maxAmount: number,
        tint: number, offsetX: number, offsetY: number,
        minIndex: number, maxIndex: number,
        maxRadiusX: number, maxRadiusY: number,
        center: Vector2D = {x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2}): Sprite[] {
        let result: Sprite[] = []
        let amount = minAmount + Math.floor(Math.random() * (maxAmount - minAmount))
        for (let i = 0; i < amount; i++) {
            let bigDropIndex = minIndex + Math.floor(Math.random() * (maxIndex - minIndex))
            let bigDropTexture = ASSET_MANAGER.getTextureAsset(`floor_decor_${bigDropIndex}` as TextureAssetID)
            let bigDrop = new Sprite(bigDropTexture)
            bigDrop.anchor.set(0.5)
            let x = Math.floor((Math.random() * maxRadiusX - maxRadiusX / 2) / offsetX) * offsetX
            let y = Math.floor((Math.random() * maxRadiusY - maxRadiusY / 2) / offsetY) * offsetY
            bigDrop.position.set(center.x + x, center.y + y)
            bigDrop.scale.x = Math.random() > 0.5 ? 1 : -1
            bigDrop.tint = tint
            result.push(bigDrop)
        }
        return result
    }


    private initRandomField(): Container {
        // Start with basic background
        let container = new Container()

        let background = new Sprite(Texture.WHITE)
        background.width = GAME_WIDTH
        background.height = GAME_HEIGHT
        background.tint = COLOR_FLOOR_0
        container.addChild(background)

        // Drop Random Blobs in lighter color
        this.createEllipticRandomBackgroundSprites(
            100, 200, COLOR_FLOOR_1, 50, 40, 3, 20, GAME_WIDTH, GAME_HEIGHT
        ).forEach(sprite => {
            container.addChild(sprite)
        })

        this.createEllipticRandomBackgroundSprites(
            100, 150, COLOR_FLOOR_2, 45, 45, 3, 20, GAME_WIDTH, GAME_HEIGHT
        ).forEach(sprite => {
            container.addChild(sprite)
        })

        // Drop even lighter colors
        this.createEllipticRandomBackgroundSprites(
            70, 120, COLOR_FLOOR_3, 53, 42, 0, 15, GAME_WIDTH - 300, GAME_HEIGHT - 300
        ).forEach(sprite => {
            container.addChild(sprite)
        })

        // Drop small line drops of very light color
        this.createEllipticRandomBackgroundSprites(
            50, 90, COLOR_FLOOR_4, 49, 32, 0, 10, GAME_WIDTH - 300, GAME_HEIGHT - 300
        ).forEach(sprite => {
            container.addChild(sprite)
        })

        // Make the background easy to save and return
        container.cacheAsBitmap = true
        return container
    }

    private drawPolygonWall(poly: Polygon2D) {
        poly.forEachSideDo((start, end) => {
            let distanceX = Math.abs(end.x - start.x)
            let distanceY = Math.abs(end.y - start.y)
            let numberOfPollers = Math.sqrt(distanceX * distanceX * 0.8 + distanceY * distanceY) / 65

            for (let polIndex = 0; polIndex < numberOfPollers; polIndex++) {
                let randomIndex = Math.floor(Math.random() * 5)
                let sprite = new Sprite(ASSET_MANAGER.getTextureAsset(`poller${randomIndex}` as TextureAssetID))
                sprite.position = vectorAdd(vectorLerp(start, end, polIndex / numberOfPollers), {x: 0, y: 30})
                sprite.anchor.set(0.5, 1)
                sprite.zIndex = sprite.position.y
                sprite.scale.x = Math.random() > 0.5 ? 1 : -1
                sprite.tint = [COLOR_FLOOR_3, COLOR_FLOOR_4, COLOR_FLOOR_5][Math.floor(Math.random() * 3)]
                this.polyWalls.addChild(sprite)
            }
        })
    }
}