import {Container, Sprite} from "pixi.js";
import {ASSET_MANAGER} from "../../../../index";

export class FruitLiveBar extends Container {
    innerBar: Sprite
    outerBar: Sprite

    constructor() {
        super();

        this.innerBar = new Sprite(ASSET_MANAGER.getTextureAsset("innerFruitBar"))
        this.innerBar.anchor.set(0, 0.5)
        this.outerBar = new Sprite(ASSET_MANAGER.getTextureAsset("outerFruitBar"))
        this.outerBar.anchor.set(0, 0.5)
        this.addChild(this.innerBar, this.outerBar)
    }

    setRatio(ratio: number) {
        this.innerBar.scale.x = ratio
    }
}