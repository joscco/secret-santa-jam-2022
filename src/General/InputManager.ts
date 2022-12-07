import {limit, Vector2D, vectorLerp} from "./Helpers";
import {KeyHandler} from "./KeyHandler";
import {Sprite} from "pixi.js";

export class InputManager {
    private clickableArea?: Sprite
    private mousePosition: Vector2D = {x: 0, y: 0}
    private mouseDown: boolean = false

    private moveLeft: number = 0
    private moveRight: number = 0
    private moveUp: number = 0
    private moveDown: number = 0

    private direction: Vector2D = {x: 0, y: 0}
    private smoothing: number = 0.15

    constructor() {
        this.initKeyControls()
    }

    update() {
        let newDirection = {
            x: (-this.moveLeft + this.moveRight),
            y: (-this.moveUp + this.moveDown)
        }

        let preDirection = vectorLerp(this.direction, newDirection, this.smoothing)
        this.direction = limit(preDirection, 1)
    }

    getRunningDirection(): Vector2D {
        return this.direction
    }

    getMousePosition(): Vector2D {
        return this.mousePosition
    }

    initMouseControls(area: Sprite, onPointerDown: ()=> void, onPointerUp: (mousePos: Vector2D) => void) {
        this.clickableArea = area
        this.clickableArea.interactive = true

        this.clickableArea.on("pointerup", async (event) => {
            this.mouseDown = false
            this.mousePosition = {x: event.data.global.x, y: event.data.global.y}
            onPointerUp(this.mousePosition)
        })

        this.clickableArea.on("pointerupoutside", async (event) => {
            this.mouseDown = false
            this.mousePosition = {x: event.data.global.x, y: event.data.global.y}
            onPointerUp(this.mousePosition)
        })

        this.clickableArea.on("pointerdown", async (event) => {
            this.mouseDown = true
            this.mousePosition = {x: event.data.global.x, y: event.data.global.y}
            onPointerDown()
        })

        this.clickableArea.on("pointermove", (event) => {
            this.mousePosition = {x: event.data.global.x, y: event.data.global.y}
        })
    }

    private initKeyControls() {
        let left = new KeyHandler([37, 65]);
        let up = new KeyHandler([38, 87]);
        let right = new KeyHandler([39, 68]);
        let down = new KeyHandler([40, 83]);

        left.press = () => this.moveLeft = 1;
        left.release = () => this.moveLeft = 0;
        up.press = () => this.moveUp = 1;
        up.release = () => this.moveUp = 0;
        right.press = () => this.moveRight = 1;
        right.release = () => this.moveRight = 0;
        down.press = () => this.moveDown = 1;
        down.release = () => this.moveDown = 0;
    }

    isMouseDown(): boolean {
        return this.mouseDown
    }
}