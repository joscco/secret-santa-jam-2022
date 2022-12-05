import {Sprite} from "pixi.js";
import {ASSET_MANAGER} from "../../index";
import Tweener from "../../General/Tweener";
import {Easing} from "@tweenjs/tween.js";
import {vectorDistance} from "../../General/Helpers";

export class Hook extends Sprite {
    constructor() {
        super(ASSET_MANAGER.getTextureAsset("gunHook"));
        this.anchor.set(0.5)
    }

    async hookTo(mousePosition: any, onUpdate: () => void) {
        await Tweener.of(this.position)
            .to({x: mousePosition.x, y: mousePosition.y})
            .duration(vectorDistance(mousePosition, this.position) / 2)
            .easing(Easing.Cubic.Out)
            .onUpdate(onUpdate)
            .start()
            .promise()
    }
}