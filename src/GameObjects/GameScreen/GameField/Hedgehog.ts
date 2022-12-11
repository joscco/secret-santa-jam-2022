import {AnimatedSprite, Container} from "pixi.js";
import {ASSET_MANAGER} from "../../../index";
import {Texture} from "@pixi/core";
import {BlinkingEyes} from "../../Characters/BlinkingEyes";

export type HedgehogState = "ROLLING" | "IDLE" | "PREROLLING"

export class Hedgehog extends Container {
    state: HedgehogState = "IDLE"
    eyes: BlinkingEyes
    body: AnimatedSprite
    rollTextures: Texture[]
    idleTextures: Texture[]
    betweenTextures: Texture[]

    private time: number = 0
    private readonly WIGGLE_SPEED: number = 0.15;

    constructor() {
        super();

        this.idleTextures = [ASSET_MANAGER.getTextureAsset("hedgehog_idle")]
        this.rollTextures = [ASSET_MANAGER.getTextureAsset("hedgehog_roll_0"),
            ASSET_MANAGER.getTextureAsset("hedgehog_roll_1"),
            ASSET_MANAGER.getTextureAsset("hedgehog_roll_2")]
        this.betweenTextures = [ASSET_MANAGER.getTextureAsset("hedgehog_between")]

        this.body = new AnimatedSprite(this.idleTextures)
        this.body.animationSpeed = 1 / 6
        this.body.play()
        this.body.anchor.set(0.5)

        this.eyes = new BlinkingEyes(ASSET_MANAGER.getTextureAsset("hedgehog_eyes_open"), ASSET_MANAGER.getTextureAsset("hedgehog_eyes_closed"))
        this.eyes.startBlinking()
        this.eyes.position.set(7, 13)

        this.body.addChild(this.eyes)

        this.addChild(this.body)
    }

    setState(state: HedgehogState) {
        this.state = state

        if (this.state === "IDLE") {
            this.body.textures = this.idleTextures
            this.eyes.alpha = 1
        }

        if (this.state === "ROLLING") {
            this.body.textures = this.rollTextures
            this.eyes.alpha = 0
        }

        if (this.state === "PREROLLING") {
            this.body.textures = this.betweenTextures
            this.eyes.alpha = 0
        }

        this.body.play()
    }

    update() {
        this.time++;
        this.scale.set(
            1.0 + 0.1 * this.WIGGLE_SPEED * Math.sin(this.time * this.WIGGLE_SPEED),
            1.0 - 0.1 * this.WIGGLE_SPEED * Math.sin(this.time * this.WIGGLE_SPEED))
    }
}