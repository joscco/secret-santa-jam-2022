import {Sprite} from "pixi.js";
import {ASSET_MANAGER} from "../../../index";

export class Hook extends Sprite {

    constructor() {
        super(ASSET_MANAGER.getTextureAsset("arrow"));
        this.anchor.set(0.5)
    }
}