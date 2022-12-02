import {Container, Sprite} from "pixi.js";
import {ASSET_MANAGER} from "../../index";
import {quadVectorDistance, Vector2D} from "../../General/Helpers";

function quadVectorLength(direction: Vector2D) {
    return quadVectorDistance({x: 0, y: 0}, direction)
}

export class Player extends Container {
    time: number = 0
    state: "RUNNING" | "IDLE" = "IDLE"
    direction: Vector2D = {x: 0, y: 0}
    smoothing: number = 0.15
    rightLeg: Sprite
    leftLeg: Sprite
    body: Sprite

    moveLeft: number = 0
    moveRight: number = 0
    moveUp: number = 0
    moveDown: number = 0

    verticalSpeed: number = 0.5
    horizontalSpeed: number = 0.3
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

        this.initKeyControls()
    }

    update(delta: number) {
        this.time++
        let newDirection = {
            x: (-this.moveLeft + this.moveRight),
            y: (-this.moveUp + this.moveDown)
        }

        this.direction = vectorLerp(this.direction, newDirection, this.smoothing)
        let limited = limit(this.direction)

        this.scale.set(
            1.0 + 0.1 * this.WIGGLE_SPEED * Math.sin(this.time * this.WIGGLE_SPEED),
            1.0 - 0.1 * this.WIGGLE_SPEED * Math.sin(this.time * this.WIGGLE_SPEED))

        // Hier wird der scale auch nochmal gesetzt, nicht gut!
        this.setState(limited)

        this.x += this.verticalSpeed * delta * limited.x;
        this.y += this.horizontalSpeed * delta * limited.y


    }

    private initKeyControls() {
        let left = new KeyHandler([37, 65]);
        let up = new KeyHandler([38, 87]);
        let right = new KeyHandler([39, 68]);
        let down = new KeyHandler([40, 83]);

        left.press = () => {
            this.moveLeft = 1;
        };

        left.release = () => {
            this.moveLeft = 0
        };

        up.press = () => {
            this.moveUp = 1;
        };

        up.release = () => {
            this.moveUp = 0
        };

        right.press = () => {
            this.moveRight = 1;
        };

        right.release = () => {
            this.moveRight = 0
        };

        //Down
        down.press = () => {
            this.moveDown = 1
        };

        down.release = () => {
            this.moveDown = 0
        };
    }

    private setState(direction: Vector2D) {
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

class KeyHandler {
    codes: number[]
    isDown: boolean
    isUp: boolean

    constructor(keyCodes: number[]) {
        this.codes = keyCodes;
        this.isDown = false;
        this.isUp = true

        window.addEventListener("keydown", this.downHandler.bind(this), false);
        window.addEventListener("keyup", this.upHandler.bind(this), false);
    }

    downHandler(event: any) {
        if (this.codes.indexOf(event.keyCode) > -1) {
            if (this.isUp) {
                this.press();
            }
            this.isDown = true;
            this.isUp = false;
        }
        event.preventDefault();
    }

    upHandler(event: any) {
        if (this.codes.indexOf(event.keyCode) > -1) {
            if (this.isDown) {
                this.release();
            }
            this.isDown = false;
            this.isUp = true;
        }
        event.preventDefault();
    };

    press() {

    }

    release() {

    }
}

function vectorMultiply(scalar: number, v: Vector2D) {
    return {x: v.x * scalar, y: v.y * scalar};
}

function limit(v: Vector2D): Vector2D {
    if (v.x === 0 && v.y === 0) {
        return v
    }

    let dist = quadVectorDistance({x: 0, y: 0}, v)
    return vectorMultiply(Math.min(1, 1 / Math.sqrt(dist)), v)
}

function vectorLerp(vec1: Vector2D, vec2: Vector2D, amount: number) {
    return {x: lerp(vec1.x, vec2.x, amount), y: lerp(vec1.y, vec2.y, amount)}
}

function lerp(value: number, to: number, amount: number) {
    return value + amount * (to - value);
}