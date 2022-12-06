import {Container, Sprite} from "pixi.js";
import {ASSET_MANAGER} from "../../index";
import Tweener from "../../General/Tweener";
import {Easing} from "@tweenjs/tween.js";
import {vectorDistance} from "../../General/Helpers";

export class Hook extends Sprite {
    gunPoint: Container

    constructor() {
        super(ASSET_MANAGER.getTextureAsset("gunHook"));
        this.anchor.set(0.5)

        this.gunPoint = new Container()
        // Why 80 and not 100? I don't know...
        this.gunPoint.position.set(-80, 0)
        this.addChild(this.gunPoint)
    }

    async hookTo(mousePosition: any, onUpdate: () => void) {
        await Tweener.of(this.position)
            .to({x: mousePosition.x, y: mousePosition.y})
            .duration(vectorDistance(mousePosition, this.position) / 3)
            .easing(Easing.Cubic.Out)
            .onUpdate(onUpdate)
            .start()
            .promise()
    }
}