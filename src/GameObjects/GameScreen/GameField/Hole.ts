import {Container, Sprite} from "pixi.js";
import {ASSET_MANAGER} from "../../../index";
import {distanceSegmentToPoint, Vector2D, vectorDistance} from "../../../General/Helpers";
import {OutlineFilter} from "@pixi/filter-outline";

export class Hole extends Container {

    sprite: Sprite
    private readonly hitRadius: number = 55

    constructor() {
        super();
        this.sprite = new Sprite(ASSET_MANAGER.getTextureAsset("hole"))
        this.sprite.anchor.set(0.5)
        this.addChild(this.sprite)
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

    highlight() {
        this.sprite.filters = [new OutlineFilter(5, 0xf9f871)]
    }

    unhighlight() {
        this.sprite.filters = []
    }
}