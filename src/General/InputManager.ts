import {clamp, Vector2D} from "./Helpers";
import {Container} from "pixi.js";
import {GAME_HEIGHT, GAME_WIDTH} from "../index";

export class InputManager {
    private clickableArea?: Container
    private enabled: boolean = true
    private mousePosition: Vector2D = {x: 0, y: 0}
    private mouseDown: boolean = false

    getMousePosition(): Vector2D {
        console.log(clamp(this.mousePosition.x, 0, GAME_WIDTH),clamp(this.mousePosition.y, 0, GAME_HEIGHT))
        return {
            x: clamp(this.mousePosition.x, 0, GAME_WIDTH),
            y: clamp(this.mousePosition.y, 0, GAME_HEIGHT)
        }
    }

    setEnabled(value: boolean) {
        this.enabled = value
    }

    initMouseControls(area: Container, onPointerDown: () => void, onPointerUp: (mousePos: Vector2D) => void) {
        this.clickableArea = area
        this.clickableArea.interactive = true

        this.clickableArea.on("pointerup", async (event) => {
            this.mouseDown = false
            this.mousePosition = {x: event.data.global.x, y: event.data.global.y}
            if (this.enabled) {
                onPointerUp(this.mousePosition)
            }
        })

        this.clickableArea.on("pointerupoutside", async (event) => {
            this.mouseDown = false
            this.mousePosition = {x: event.data.global.x, y: event.data.global.y}
            if (this.enabled) {
                onPointerUp(this.mousePosition)
            }
        })

        this.clickableArea.on("pointerdown", async (event) => {
            this.mouseDown = true
            this.mousePosition = {x: event.data.global.x, y: event.data.global.y}
            if (this.enabled) {
                onPointerDown()
            }
        })

        this.clickableArea.on("pointermove", (event) => {
            this.mousePosition = {x: event.data.global.x, y: event.data.global.y}
        })
    }

    isMouseDown(): boolean {
        return this.mouseDown
    }

    isEnabled() {
        return this.enabled;
    }
}