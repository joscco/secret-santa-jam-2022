import {Container, Sprite} from "pixi.js";
import {Hedgehog} from "./Hedgehog";
import {Hook} from "./Hook";
import {ASSET_MANAGER, GAME_HEIGHT, GAME_WIDTH} from "../../../index";
import {InputManager} from "../../../General/InputManager";
import {
    harmonizeAngle,
    lerp,
    Vector2D,
    vectorAdd,
    vectorDistance,
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
import {Fruit} from "./Fruit/Fruit";
import {Hole} from "./Hole";
import {LineReflector} from "./LineReflector";
import {Bumper} from "./Bumper";

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

    fruits: Fruit[] = []
    holes: Hole[] = []
    bumpers: Bumper[] = []

    hedgehog: Hedgehog
    rope: Rope
    previewRope: PreviewRope
    hook: Hook

    inputManager: InputManager

    drawingToHook: boolean = false
    inHookShooting: boolean = false

    points: number = 0
    uiOverlay: GameFieldUI

    reflector: LineReflector

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
                {x: 100, y: 400},
                {x: 450, y: 400},
                {x: 450, y: 100},
                {x: GAME_WIDTH - 100, y: 100},
                {x: GAME_WIDTH - 100, y: GAME_HEIGHT - 100},
                {x: 100, y: GAME_HEIGHT - 100}
            ]),
            new Polygon2D([
                {x: 1300, y: 300},
                {x: 1300, y: 700},
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

        let hole = new Hole()
        hole.position.set(1100, 500)
        this.holes.push(hole)

        let bumper = new Bumper()
        bumper.position.set(1100, 800)
        this.bumpers.push(bumper)

        let bumper2 = new Bumper()
        bumper2.position.set(800, 800)
        this.bumpers.push(bumper2)

        this.reflector = new LineReflector(this.blockPolygons, this.bumpers)

        // Set fruits
        let apple = new Fruit("apple")
        apple.position.set(900, 600)
        this.fruits.push(apple)

        this.addChild(this.field, this.antCircle, this.antCircle2, this.polyWalls, ...this.holes, ...this.bumpers, this.rope, this.hook, this.previewRope, ...this.fruits, this.hedgehog)
        this.blockPolygons.forEach(poly => this.drawPolygonWall(poly))
        this.polyWalls.cacheAsBitmap = true

        this.uiOverlay = new GameFieldUI(1, [200, 300, 400], 0)
        this.addChild(this.uiOverlay)
    }

    addPoints(value: number) {
        this.points += value
        this.uiOverlay.stars.forEach(star => {
            if (star.points <= this.points) {
                star.fillStar()
            }
        })
        this.uiOverlay.pointsNumberText.text = `${this.points}`
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
            this.hook.position = this.hedgehog.position
        }
    }

    updatePreviewRope(mousePosition: Vector2D) {
        this.linePath = this.reflector.reflectLine([this.hedgehog.getGlobalPosition()], this.hedgehog.getGlobalPosition(), mousePosition)

        // Check if Path hits fruit and highligh those
        for (let fruit of this.fruits) {
            if (fruit.isHitByPath(this.linePath)) {
                fruit.highlight()
            } else {
                fruit.unhighlight()
            }
        }

        for (let hole of this.holes) {
            if (hole.isHitByPath(this.linePath)) {
                hole.highlight()
            } else {
                hole.unhighlight()
            }
        }

        this.previewRope.update(this.linePath)
    }

    private async onPointerDown() {
        this.slowTime = true
        this.hedgehog.setState("PREROLLING")
        this.updatePreviewRope(this.inputManager.getMousePosition())
    }

    private async onPointerUp() {
        this.slowTime = false

        // Unhighlight all fruit that might have been highlighted by rope
        for (let fruit of this.fruits) {
            fruit.unhighlight()
        }

        for (let hole of this.holes) {
            hole.unhighlight()
        }

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

        let movingObject: { position: Vector2D } | undefined = this.hedgehog

        await Tweener.of(val)
            .to({x: 1})
            .duration(Math.sqrt(fullDistance) / PLAYER_HOOK_SPEED)
            .easing(Easing.Cubic.Out)
            .onUpdate((object) => {
                if (!object || !object.x) {
                    return
                }

                if (movingObject) {
                    movingObject.position = valToPosition(object.x)

                    // Kill all enemies near enough
                    let indicesToRemove: number[] = []

                    for (let [index, enemy] of this.aliveEnemies.entries()) {
                        if (enemy.isKilledByPosition(movingObject.position)) {
                            this.addPoints(enemy.getPoints())
                            enemy.kill()
                            indicesToRemove.push(index)
                            this.deadEnemies.push(enemy)
                        }
                    }
                    this.aliveEnemies = this.aliveEnemies.filter((val, i) => !indicesToRemove.contains(i))

                    // Change to fruit near enough
                    for (let fruit of this.fruits) {
                        if (fruit.isAffectedByPosition(movingObject.position)) {
                            this.hedgehog.setState("IDLE")
                            movingObject = fruit
                            break
                        }
                    }

                    if (movingObject instanceof Fruit) {
                        for (let hole of this.holes) {
                            if (hole.isAffectedByPosition(movingObject.position)) {
                                (movingObject as Fruit).drop()
                                movingObject = undefined
                                break
                            }
                        }
                    }
                }

                if (object.x > 0.95) {
                    this.hedgehog.setState("IDLE")
                }

                if (movingObject) {
                    this.rope.setFirstPoint(movingObject.position)
                } else {
                    this.rope.setPath([])
                }


            })
            .start()
            .promise()
    }

    private initRandomField(): Container {
        // Start with basic background
        let container = new Container()

        let background = new Sprite(Texture.WHITE)
        background.width = GAME_WIDTH
        background.height = GAME_HEIGHT
        background.tint = 0x235552
        container.addChild(background)

        let scheme: number[][] = []
        for (let i = 0; i < GAME_HEIGHT / 128; i++) {
            scheme[i] = []
            for (let j = 0; j < GAME_WIDTH / 128; j++) {
                scheme[i][j] = Math.floor(Math.random() * 5)

            }
        }


        // Flatten scheme
        for (let i = 0; i < GAME_HEIGHT / 128; i++) {
            for (let j = 0; j < GAME_WIDTH / 128; j++) {
                let neighbors = [[i - 1, j], [i + 1, j], [i, j - 1], [i, j + 1]]
                    .filter(val => val[0] >= 0 && val[0] < GAME_HEIGHT / 128)
                    .filter(val => val[1] >= 0 && val[1] < GAME_WIDTH / 128)
                let flattened = Math.round(neighbors.map(n => scheme[n[0]][n[1]]).add() / neighbors.length)
                let sprite = new Sprite(ASSET_MANAGER.getTextureAsset(("filler_" + flattened) as TextureAssetID))
                sprite.position.set(j * 128, i * 128)
                container.addChild(sprite)
            }
        }

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
                let randomIndex = Math.floor(Math.random() * 100)
                if (randomIndex < 20) {
                    randomIndex = 2
                } else if (randomIndex < 40) {
                    randomIndex = 3
                } else if (randomIndex < 55) {
                    randomIndex = 7
                } else if (randomIndex < 65) {
                    randomIndex = 12
                } else {
                    randomIndex %= 14
                }

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