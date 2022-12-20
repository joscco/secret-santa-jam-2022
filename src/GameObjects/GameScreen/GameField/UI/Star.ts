import {Container, Sprite, Text} from "pixi.js";
import {ASSET_MANAGER} from "../../../../index";

export class Star extends Container {
    pointsText: Text
    sprite: Sprite
    points: number

    constructor(points: number) {
        super();

        this.points = points

        this.sprite = new Sprite(ASSET_MANAGER.getTextureAsset("emptyStar"))
        this.sprite.anchor.set(0.5)
        this.pointsText = new Text(`${points}`, {fontFamily: "Futurahandwritten", fontSize: 30, fill: 0x000000})
        this.pointsText.anchor.set(0.5)
        this.pointsText.position.set(0, 50)
        this.addChild(this.sprite, this.pointsText)
    }

    fillStar() {
        this.sprite.texture = ASSET_MANAGER.getTextureAsset("fullStar")
    }
}