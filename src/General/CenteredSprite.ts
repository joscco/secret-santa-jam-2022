import {Sprite} from "pixi.js";
import {Texture} from "@pixi/core";

export class CenteredSprite extends Sprite {
    constructor(texture: Texture) {
        super(texture);
        this.anchor.set(0.5)
    }
}