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
import {TextureAssetID} from "../../../General/AssetManager";
import {Polygon2D} from "../../../General/Polygon2D";
import {Easing} from "@tweenjs/tween.js";
import {Enemy} from "./Enemies/Enemy";
import {AntCircle} from "./Enemies/AntCircle";
import {GameFieldUI} from "./UI/GameFieldUI";

const PLAYER_HOOK_SPEED = 1 / 30
const HOOK_HOOK_DURATION = 100

export class GameField extends Container {
    time: number = 0
    slowTime: boolean = false
    field: Container

    blockPolygons: Polygon2D[]
    linePath: Vector2D[] = []
    polyWalls: Container

    aliveEnemies: Enemy[] = []
    deadEnemies: Enemy[] = []
    antCircle: AntCircle
    antCircle2: AntCircle

    hedgehog: Hedgehog
    rope: Rope
    previewRope: PreviewRope
    hook: Hook

    inputManager: InputManager

    drawingToHook: boolean = false
    inHookShooting: boolean = false

    points: number = 0
    uiOverlay: GameFieldUI

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
                {x: 100, y: 200},
                {x: 300, y: 200},
                {x: 300, y: 100},
                {x: GAME_WIDTH - 100, y: 100},
                {x: GAME_WIDTH - 100, y: GAME_HEIGHT - 100},
                {x: 100, y: GAME_HEIGHT - 100}
            ]),
            new Polygon2D([
                {x: 300, y: 300},
                {x: 500, y: 300},
                {x: 400, y: 700}
            ])]
        this.polyWalls = new Container()
        this.polyWalls.sortableChildren = true

        this.inputManager = new InputManager()
        this.inputManager.initMouseControls(this.field, () => this.onPointerDown(), () => this.onPointerUp())

        this.aliveEnemies = Array(120).fill(0).map(() => new Enemy())
        this.antCircle = new AntCircle(this.aliveEnemies.slice(0, 60))
        this.antCircle.position.set(GAME_WIDTH / 2 + 150, GAME_HEIGHT / 2)

        this.antCircle2 = new AntCircle(this.aliveEnemies.slice(60, 120))
        this.antCircle2.position.set(GAME_WIDTH / 2 - 150, GAME_HEIGHT / 2)

        this.addChild(this.field, this.polyWalls, this.antCircle, this.antCircle2, this.rope, this.hook, this.previewRope, this.hedgehog)
        this.blockPolygons.forEach(poly => this.drawPolygonWall(poly))
        this.polyWalls.cacheAsBitmap = true

        this.uiOverlay = new GameFieldUI()
        this.addChild(this.uiOverlay)
    }

    addPoints(value: number) {
        this.points += value
        this.uiOverlay.pointBar.pointTextObject.text = `${this.points}`
    }

    update() {
        this.updateTime()
        let mousePosition = this.inputManager.getMousePosition()
        this.hedgehog.update()
        this.antCircle.update(this.time)
        this.antCircle2.update(this.time * 1.1 + 0.8)

        if (!this.inHookShooting) {
            if (this.inputManager.isMouseDown()) {
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
        this.slowTime = true
        this.hedgehog.setState("PREROLLING")
        this.updatePreviewRope(this.inputManager.getMousePosition())
    }

    private async onPointerUp() {
        this.slowTime = false
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
        let relativeLengths = distances.map(dist => dist / fullDistance)
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
                if (!object || !object.x) {
                    return
                }

                this.hedgehog.position = valToPosition(object.x)

                // Kill all enemies near enough
                let indicesToRemove: number[] = []
                for (let [index, enemy] of this.aliveEnemies.entries()) {
                    if (enemy.isKilledByPosition(this.hedgehog.position)) {
                        this.addPoints(enemy.getPoints())
                        enemy.kill()
                        indicesToRemove.push(index)
                        this.deadEnemies.push(enemy)
                    }
                }
                this.aliveEnemies = this.aliveEnemies.filter((val, i) => !indicesToRemove.contains(i))

                if (object.x > 0.95) {
                    this.hedgehog.setState("IDLE")
                }
                this.rope.setFirstPoint(this.hedgehog.position)
            })
            .start()
            .promise()
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
            // Idee: Gehe vom eigentlichen Schnittpunkt wieder ein Stück zurück,
            // in Normalenrichtung von der Schnittlinie soll dabei der Abstand konstant sein.
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

    private initRandomField(): Container {
        // Start with basic background
        let container = new Container()

        let background = new Sprite(Texture.WHITE)
        background.width = GAME_WIDTH
        background.height = GAME_HEIGHT
        background.tint = 0x235552
        container.addChild(background)

        // Make the background easy to save and return
        container.cacheAsBitmap = true
        return container
    }

    private drawPolygonWall(poly: Polygon2D) {
        poly.forEachSideDo((start, end) => {
            let distanceX = Math.abs(end.x - start.x)
            let distanceY = Math.abs(end.y - start.y)
            let numberOfRocks = Math.sqrt(distanceX * distanceX * 0.8 + distanceY * distanceY) / 30

            for (let polIndex = 0; polIndex < numberOfRocks; polIndex++) {
                let randomIndex = Math.floor(Math.random() * 14)
                // if (randomIndex < 15) {
                //     randomIndex = 2
                // } else if(randomIndex < 40) {
                //     randomIndex = 3
                // } else if(randomIndex < 55) {
                //     randomIndex = 8
                // } else {
                //     randomIndex %= 14
                // }

                let sprite = new Sprite(ASSET_MANAGER.getTextureAsset(`rock${randomIndex}` as TextureAssetID))
                sprite.position = vectorAdd(vectorLerp(start, end, polIndex / numberOfRocks), {
                    x: -15 + Math.random() * 30,
                    y: Math.random() * 30
                })
                sprite.anchor.set(0.5, 0.95)
                sprite.zIndex = sprite.position.y
                sprite.scale.x = Math.random() > 0.5 ? 1 : -1
                this.polyWalls.addChild(sprite)
            }
        })
    }

    private updateTime() {
        this.time += this.slowTime ? 0.3 : 1
    }
}