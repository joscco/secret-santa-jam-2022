import {Container, Sprite} from "pixi.js";
import {FruitLiveBar} from "./FruitLiveBar";
import {ASSET_MANAGER} from "../../../../index";
import {TextureAssetID} from "../../../../General/AssetManager";
import {distanceSegmentToPoint, Vector2D, vectorDistance} from "../../../../General/Helpers";
import {OutlineFilter} from "@pixi/filter-outline";
import Tweener from "../../../../General/Tweener";
import {Easing} from "@tweenjs/tween.js";

export type FruitType = "pear" | "apple" | "ruebe" | "banana"

export class Fruit extends Container {
    type: FruitType
    sprite: Sprite
    liveBar: FruitLiveBar
    hitRadius = 40

    constructor(type: FruitType) {
        super();

        this.type = type
        this.sprite = new Sprite(ASSET_MANAGER.getTextureAsset(this.type as TextureAssetID))
        this.sprite.anchor.set(0.5)

        this.liveBar = new FruitLiveBar()
        this.liveBar.position.set(-this.liveBar.width / 2, -65)

        this.addChild(this.sprite, this.liveBar)
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

    async drop() {
        await Tweener.of(this.liveBar.scale)
            .to({y: 0})
            .duration(300)
            .easing(Easing.Quadratic.InOut)
            .start()
            .promise()
        await Tweener.of(this.scale)
            .to({x: 0, y: 0})
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

}