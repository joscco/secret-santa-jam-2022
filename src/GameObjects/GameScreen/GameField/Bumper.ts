import {Container, Sprite} from "pixi.js";
import {OutlineFilter} from "@pixi/filter-outline";
import {ASSET_MANAGER} from "../../../index";

export class Bumper extends Container {

    topPoint: Container
    bottomPoint: Container
    sprite: Sprite

    constructor() {
        super()
        this.sprite = new Sprite(ASSET_MANAGER.getTextureAsset("bumper"))
        this.sprite.anchor.set(0.5)
        this.topPoint = new Container()
        this.topPoint.position.set(0, -60)
        this.bottomPoint = new Container()
        this.bottomPoint.position.set(0, 60)
        this.addChild(this.sprite, this.topPoint, this.bottomPoint)
    }

    highlight() {
        this.sprite.filters = [new OutlineFilter(5, 0xf9f871)]
    }

    unhighlight() {
        this.sprite.filters = []
    }
}