import {Container, Sprite} from "pixi.js";
import {Vector2D, vectorSub} from "../../General/Helpers";
import {ASSET_MANAGER} from "../../index";

export class HookGun extends Container {

    gunSprite: Sprite

    constructor() {
        super();

        this.gunSprite = new Sprite(ASSET_MANAGER.getTextureAsset("playerGun"))
        this.gunSprite.pivot.set(20, 20)
        this.addChild(this.gunSprite)
    }

    rotateTowards(point: Vector2D) {
        let direction = vectorSub(point, this.getGlobalPosition())
        let scale = direction.x > 0 ? 1 : -1
        let rotation = Math.atan2(Math.sign(direction.x) * direction.y, Math.max(50, Math.abs(direction.x)))
        this.gunSprite.scale.x = scale
        this.gunSprite.rotation = rotation
    }
}