import {Container, Sprite} from "pixi.js";
import {FruitLiveBar} from "./FruitLiveBar";
import {ASSET_MANAGER} from "../../../../index";
import {TextureAssetID} from "../../../../General/AssetManager";
import {distanceSegmentToPoint, Vector2D, vectorDistance} from "../../../../General/Helpers";
import {OutlineFilter} from "@pixi/filter-outline";
import Tweener from "../../../../General/Tweener";
import {Easing} from "@tweenjs/tween.js";
import {Enemy} from "../Enemies/Enemy";

export type FruitType = "pear" | "apple" | "ruebe" | "banana"

const POINTMAP = {
    "pear": 50,
    "apple": 100,
    "ruebe": 200,
    "banana": 500
}

export class Fruit extends Container {
    type: FruitType
    sprite: Sprite
    liveBar: FruitLiveBar
    eaters: Enemy[] = []
    hitRadius = 40
    initialPoints: number
    points: number
    dead: boolean = false

    constructor(type: FruitType) {
        super();

        this.type = type
        this.initialPoints = POINTMAP[type]
        this.points = this.initialPoints
        this.sprite = new Sprite(ASSET_MANAGER.getTextureAsset(this.type as TextureAssetID))
        this.sprite.anchor.set(0.5)

        this.liveBar = new FruitLiveBar()
        this.liveBar.position.set(-this.liveBar.width / 2, -65)

        this.addChild(this.sprite, this.liveBar)
    }

    update(removeFunction: (fruit: Fruit) => void) {
        this.points = Math.max(this.points - this.eaters.length * 0.05, 0)
        this.liveBar.setPoints(this.points)
        this.liveBar.setRatio(this.points / this.initialPoints)
        if (this.points === 0 && !this.dead) {
            this.moveToAndBlendOut({x: this.position.x, y: this.position.y})
            this.eaters.forEach(eater => eater.setEater(false))
            this.eaters = []
            removeFunction(this)
        }
    }

    isAffectedByPosition(hedgeHogPosition: Vector2D): boolean {
        return vectorDistance(hedgeHogPosition, this.position) <= this.hitRadius + 2
    }

    isHitByPath(linePath: Vector2D[]): boolean {
        for (let [start, end] of linePath.slideWindow(2)) {
            if (this.isHitByLine(start, end)) {
                return true
            }
        }
        return false
    }

    private isHitByLine(start: Vector2D, end: Vector2D): boolean {
        let distance = distanceSegmentToPoint(start, end, this.getGlobalPosition())
        return distance <= this.hitRadius
    }

    async moveToAndBlendOut(position: Vector2D) {
        this.dead = true
        Tweener.of(this)
            .to({x: position.x, y: position.y})
            .duration(200)
            .easing(Easing.Back.Out)
            .start()
        Tweener.of(this.liveBar.scale)
            .to({y: 0})
            .duration(300)
            .easing(Easing.Quadratic.InOut)
            .start()
        await Tweener.of(this)
            .to({scale: {x: 0, y: 0}, alpha: 0})
            .duration(300)
            .easing(Easing.Back.In)
            .start()
            .promise()
    }

    highlight() {
        this.sprite.filters = [new OutlineFilter(5, 0xf9f871)]
    }

    unhighlight() {
        this.sprite.filters = []
    }

    isDead() {
        return this.dead
    }

    addEater(enemy: Enemy) {
        if (!enemy.isEater()) {
            this.eaters.push(enemy)
            enemy.setEater(true)
        }
    }
}