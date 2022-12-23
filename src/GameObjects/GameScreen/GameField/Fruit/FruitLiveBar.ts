import {Container, Sprite, Text, TextStyle} from "pixi.js";
import {ASSET_MANAGER} from "../../../../index";

export class FruitLiveBar extends Container {
    innerBar: Sprite
    outerBar: Sprite
    pointsText: Text

    constructor() {
        super();

        this.innerBar = new Sprite(ASSET_MANAGER.getTextureAsset("innerFruitBar"))
        this.innerBar.anchor.set(0, 0.5)
        this.outerBar = new Sprite(ASSET_MANAGER.getTextureAsset("outerFruitBar"))
        this.outerBar.anchor.set(0, 0.5)
        this.pointsText = new Text("0", new TextStyle({
            fontFamily: "Futurahandwritten",
            fill: "#ffffff",
            fontSize: 30
        }))
        this.pointsText.anchor.set(0.5)
        this.pointsText.position.set(42, -25)
        this.addChild(this.innerBar, this.outerBar, this.pointsText)
    }

    setPoints(points: number) {
        this.pointsText.text = Math.ceil(points)
    }

    setRatio(ratio: number) {
        this.innerBar.scale.x = ratio
    }
}