import {Container, Sprite, Text, TextStyle} from "pixi.js";
import {ASSET_MANAGER} from "../../../../index";
import Tweener from "../../../../General/Tweener";
import {Easing} from "@tweenjs/tween.js";
import {Vector2D, vectorDistance} from "../../../../General/Helpers";

export type ENEMY_TYPE = "ANT" | "BUG"

export class Enemy extends Container {
    killRadius = 40
    private points: number = 100;
    sprite: Sprite;
    private deadpointText: Text;
    private type: ENEMY_TYPE = "ANT";

    constructor() {
        super();

        this.sprite = new Sprite(ASSET_MANAGER.getTextureAsset("ant"))
        this.sprite.anchor.set(0.5)
        this.deadpointText = new Text(`${this.points}`, new TextStyle({
            fontFamily: "Futurahandwritten",
            fill: "#ffffff",
            fontSize: 50
        }))
        this.deadpointText.anchor.set(0.5)
        this.deadpointText.scale.set(0)

        this.addChild(this.sprite, this.deadpointText)
    }

    isKilledByPosition(playerPosition: Vector2D) {
        return vectorDistance(this.getGlobalPosition(), playerPosition) <= this.killRadius
    }


    setType(type: ENEMY_TYPE) {
        this.type = type
    }

    spawn() {

    }

    kill() {
        this.scaleOut()
        this.blendInText()
    }

    private scaleOut() {
        Tweener.of(this.sprite.scale)
            .to({x: 0})
            .duration(300)
            .easing(Easing.Back.In)
            .start()
    }

    private blendInText() {
        let scaleInTween = Tweener.of(this.deadpointText.scale)
            .to({x: 1, y: 1})
            .duration(300)
            .easing(Easing.Back.Out)
        let moveUpTween = Tweener.of(this.deadpointText.position)
            .to({y: -100})
            .duration(300)
            .easing(Easing.Back.In)
        let alphaOutTween = Tweener.of(this.deadpointText)
            .to({alpha: 0})
            .duration(300)
            .easing(Easing.Back.In)

        scaleInTween.chain(moveUpTween, alphaOutTween)
            .start()
    }
}