import {Container, Sprite} from "pixi.js";
import {FruitLiveBar} from "./FruitLiveBar";
import {ASSET_MANAGER} from "../../../../index";
import {TextureAssetID} from "../../../../General/AssetManager";
import {distanceSegmentToPoint, Vector2D, vectorDistance} from "../../../../General/Helpers";
import {OutlineFilter} from "@pixi/filter-outline";

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
        return vectorDistance(hedgeHogPosition, this.position) <= this.hitRadius
    }


    isHitByPath(linePath: Vector2D[]): boolean {
        for (let [start, end] of linePath.slideWindow(2)) {
            if (this.isHitByLine(start, end)) {
                return true
            }
        }
        return false
    }

    highlight() {
        this.sprite.filters = [new OutlineFilter(5, 0xf9f871)]
    }

    unhighlight() {
        this.sprite.filters = []
    }

    private isHitByLine(start: Vector2D, end: Vector2D): boolean {
        let distance = distanceSegmentToPoint(start, end, this.getGlobalPosition())
        return distance <= this.hitRadius
    }
}