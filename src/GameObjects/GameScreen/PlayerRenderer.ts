import {Container, Sprite} from "pixi.js";
import {ASSET_MANAGER} from "../../index";
import {lerp, quadVectorLength, Vector2D} from "../../General/Helpers";

export class PlayerRenderer extends Container {
    state: "RUNNING" | "IDLE" = "IDLE"
    time: number = 0
    rightLeg: Sprite
    leftLeg: Sprite
    body: Sprite

    private ticksRunning: number = 0;
    private RUN_SPEED: number = 0.3;
    private WIGGLE_SPEED: number = 0.15;

    constructor() {
        super();

        this.rightLeg = new Sprite(ASSET_MANAGER.getTextureAsset("playerLeg"))
        this.rightLeg.anchor.set(0.5, 0)
        this.rightLeg.position.set(13, -20)
        this.leftLeg = new Sprite(ASSET_MANAGER.getTextureAsset("playerLeg"))
        this.leftLeg.anchor.set(0.5, 0)
        this.leftLeg.position.set(-13, -20)
        this.body = new Sprite(ASSET_MANAGER.getTextureAsset("playerBody"))
        this.body.anchor.set(0.5, 1)

        this.addChild(this.leftLeg, this.rightLeg, this.body)
    }

    update() {
        this.time++;
        this.scale.set(
            1.0 + 0.1 * this.WIGGLE_SPEED * Math.sin(this.time * this.WIGGLE_SPEED),
            1.0 - 0.1 * this.WIGGLE_SPEED * Math.sin(this.time * this.WIGGLE_SPEED))
    }

    setState(direction: Vector2D) {
        if (quadVectorLength(direction) > 0.1) {
            if (this.state === "IDLE") {
                this.state = "RUNNING"
                this.ticksRunning = 0
            } else {
                this.ticksRunning++
            }
            if (Math.abs(direction.x) > 0.1) {
                this.body.angle = 5 + 4 * Math.sin(this.ticksRunning * this.RUN_SPEED)
            } else {
                this.body.angle = 3 * Math.sin(this.ticksRunning * this.RUN_SPEED)
            }

            this.body.y = -3 + 2.5 * Math.sin(this.ticksRunning * this.RUN_SPEED)
            this.leftLeg.angle = 10 + 35 * Math.sin(this.ticksRunning * this.RUN_SPEED)
            this.rightLeg.angle = 10 + -35 * Math.sin(this.ticksRunning * this.RUN_SPEED)
        } else {
            if (this.state === "RUNNING") {
                this.state = "IDLE"
            }
            this.leftLeg.angle = lerp(this.leftLeg.angle, 0, 0.5)
            this.rightLeg.angle = lerp(this.rightLeg.angle, 0, 0.5)
            this.body.angle = lerp(this.body.angle, 0, 0.5)
            this.body.y = lerp(this.body.y, 0, 0.5)
        }

        if (direction.x > 0) {
            this.scale.x = Math.abs(this.scale.x)
        } else if (direction.x < 0) {
            this.scale.x = -Math.abs(this.scale.x)
        }
    }
}