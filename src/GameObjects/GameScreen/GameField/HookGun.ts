import {Container, Sprite} from "pixi.js";
import {harmonizeAngle, lerpAbs, Vector2D, vectorSub} from "../../../General/Helpers";
import {ASSET_MANAGER} from "../../../index";

export class HookGun extends Container {

    gunSprite: Sprite
    ROTATION_SPEED = 0.02

    constructor() {
        super();

        this.gunSprite = new Sprite(ASSET_MANAGER.getTextureAsset("playerGun"))
        this.gunSprite.pivot.set(20, 20)
        this.addChild(this.gunSprite)
    }

    rotateTowards(point: Vector2D, delta: number) {
        let direction = vectorSub(point, this.getGlobalPosition())
        let desiredRotation = Math.atan2(direction.y, direction.x)
        let harmonizedGunRotation = harmonizeAngle(desiredRotation, this.gunSprite.rotation)
        this.gunSprite.rotation = lerpAbs(this.gunSprite.rotation, harmonizedGunRotation, this.ROTATION_SPEED * delta)
    }
}