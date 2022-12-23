import {Container, Sprite} from "pixi.js";
import {Hedgehog} from "./Hedgehog";
import {Hook} from "./Hook";
import {ASSET_MANAGER, GAME_HEIGHT, GAME_WIDTH, SOUND_MANAGER} from "../../../index";
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
import {Fruit} from "./Fruit/Fruit";
import {LineReflector} from "./LineReflector";
import {EnemyGroup} from "./Enemies/EnemyGroup";
import {Bumper} from "./Bumper";
import {Hole} from "./Hole";

const PLAYER_HOOK_SPEED = 1 / 30
const HOOK_HOOK_DURATION = 100

export class GameField extends Container {
    addPoints: (amount: number) => void
    removeFruit: (fruit: Fruit) => void
    time: number = 0
    slowTime: boolean = false
    field: Container

    fruits: Fruit[]
    holes: Hole[]
    linePath: Vector2D[] = []
    polyWalls: Container

    enemyGroups: EnemyGroup[]
    aliveEnemies: Enemy[]
    deadEnemies: Enemy[]

    hedgehog: Hedgehog
    rope: Rope
    previewRope: PreviewRope
    hook: Hook

    inputManager: InputManager

    drawingToHook: boolean = false
    inHookShooting: boolean = false

    reflector: LineReflector

    constructor(
        blockPolygons: Polygon2D[], bumpers: Bumper[], holes: Hole[], enemyGroups: EnemyGroup[], fruits: Fruit[],
        removeFruit: (fruit: Fruit) => void, addPoints: (amount: number) => void) {
        super()

        this.removeFruit = removeFruit
        this.addPoints = addPoints

        this.fruits = fruits
        this.holes = holes
        this.field = GameField.initRandomField()

        this.hedgehog = new Hedgehog()
        this.hedgehog.position.set(GAME_WIDTH / 2 - 400, GAME_HEIGHT / 2)
        this.rope = new Rope()
        this.previewRope = new PreviewRope()
        this.previewRope.alpha = 0

        this.hook = new Hook()
        this.hook.position = this.hedgehog.getGlobalPosition()

        this.polyWalls = new Container()
        this.polyWalls.sortableChildren = true

        this.inputManager = new InputManager()
        this.inputManager.initMouseControls(this.field, () => this.onPointerDown(), () => this.onPointerUp())

        this.enemyGroups = enemyGroups
        this.aliveEnemies = [...this.enemyGroups.map(group => group.enemies).flat()]
        this.deadEnemies = []

        this.reflector = new LineReflector(blockPolygons, bumpers)

        this.addChild(this.field, ...holes, ...enemyGroups, this.polyWalls, ...bumpers, this.rope, this.hook, this.previewRope, ...fruits, this.hedgehog)
        blockPolygons.forEach(poly => this.drawPolygonWall(poly))
        this.polyWalls.cacheAsBitmap = true
    }

    killEaters(fruit: Fruit) {
        this.aliveEnemies = this.aliveEnemies.filter((val) => !fruit.eaters.contains(val))
        fruit.eaters.forEach(enemy => {
            this.addPoints(enemy.getPoints())
            this.deadEnemies.push(enemy)
            enemy.kill()
        })
        fruit.eaters = []
    }

    update() {
        let mousePosition = this.inputManager.getMousePosition()

        let timeDelta = this.slowTime ? 0.3 : 1
        this.time += timeDelta
        this.hedgehog.update(timeDelta)
        this.fruits.forEach(fruit =>
            fruit.update(timeDelta, (fruit: Fruit) => this.removeFruit(fruit))
        )

        this.enemyGroups.map((enemy, index) => enemy.update(this.time + index * 0.6, timeDelta))

        if (!this.inHookShooting) {
            if (this.inputManager.isMouseDown() && this.inputManager.isEnabled()) {
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

        // Check if Path hits fruit and highlight those
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
        if (linePath.length <= 1) {
            return
        }

        this.hedgehog.setState("ROLLING")
        let val = {x: 0}
        let distances = linePath.slideWindow(2).map((points) => vectorDistance(points[0], points[1]))
        let fullDistance = distances.reduce((a, b) => a + b, 0)
        let relativeLengths = distances.map(dist => dist / fullDistance)
        let currentIndex = 0
        let lastFullDistance = 0
        let lastRelativeDistance = 0
        let offset = {x: 0, y: 0}

        let valToPosition = (val: number) => {
            if (val > (lastFullDistance + distances[currentIndex]) / fullDistance) {
                lastFullDistance += distances[currentIndex]
                lastRelativeDistance = lastFullDistance / fullDistance
                currentIndex++
                SOUND_MANAGER.playBlub()
                this.rope.dropFirstPoint()
            }

            let pathLerp = (val - lastRelativeDistance) / (relativeLengths[currentIndex])
            if (currentIndex + 1 <= linePath.length) {
                return vectorLerp(linePath[currentIndex], linePath[currentIndex + 1], pathLerp)
            } else {
                return linePath[currentIndex]
            }
        }

        let movingObject: { position: Vector2D } | undefined = this.hedgehog

        await Tweener.of(val)
            .to({x: 1})
            .duration(Math.sqrt(fullDistance) / PLAYER_HOOK_SPEED)
            .easing(Easing.Cubic.Out)
            .onUpdate((object) => {
                    if (!object || !object.x || !movingObject) {
                        return
                    }

                    movingObject.position = vectorAdd(valToPosition(object.x), offset)

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
                        if (movingObject != fruit && fruit.isAffectedByPosition(movingObject.position)) {
                            offset = vectorSub(fruit.position, movingObject.position)
                            this.killEaters(fruit)
                            SOUND_MANAGER.playBlub()
                            this.hedgehog.setState("IDLE")
                            movingObject = fruit
                            break
                        }
                    }

                    if (movingObject instanceof Fruit) {
                        let fruit = (movingObject as Fruit)
                        for (let hole of this.holes) {
                            if (hole.isAffectedByPosition(movingObject.position)) {
                                this.addPoints(Math.ceil(fruit.points))
                                this.removeFruit(fruit)
                                fruit.moveToAndBlendOut(hole.position)
                                movingObject = undefined
                                break
                            }
                        }
                    }

                    if (object.x > 0.95) {
                        this.hedgehog.setState("IDLE")
                    }

                    if (movingObject) {
                        this.rope.setFirstPoint(vectorSub(movingObject.position, offset))
                    } else {
                        this.rope.setPath([])
                    }
                }
            )
            .start()
            .promise()
    }

    static initRandomField(): Container {
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
            let stones = Math.floor(vectorDistance(start, end) / 20)
            for (let i = 0; i < stones; i++) {
                let randomIndex = Math.floor(Math.random() * 35)

                let sprite = new Sprite(ASSET_MANAGER.getTextureAsset(`rock${randomIndex}` as TextureAssetID))
                sprite.position = vectorAdd(vectorLerp(start, end, i / stones), {
                    x: -10 + Math.random() * 20,
                    y: Math.random() * 30
                })
                sprite.anchor.set(0.5, 1)
                sprite.zIndex = sprite.position.y - 15
                sprite.scale.x = Math.random() > 0.5 ? 1 : -1
                this.polyWalls.addChild(sprite)
            }
        })
    }

    disableInput() {
        this.inputManager.setEnabled(false)
    }
}