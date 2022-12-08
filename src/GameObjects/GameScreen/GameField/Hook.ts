import {Container, Sprite} from "pixi.js";
import {ASSET_MANAGER} from "../../../index";

export class Hook extends Sprite {
    gunPoint: Container

    constructor() {
        super(ASSET_MANAGER.getTextureAsset("gunHook"));
        this.anchor.set(0.5)

        this.gunPoint = new Container()
        // Why 80 and not 100? I don't know...
        this.gunPoint.position.set(-45, -10)
        this.addChild(this.gunPoint)
    }
}