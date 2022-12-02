import {IPointData} from "pixi.js";
import {Vector2D} from "./Helpers";
import {CustomApp} from "../index";

export class MousewheelListener {
    eventHandler: (e: any) => void
    action?: (delta: number, mousePosition: Vector2D) => any
    app: CustomApp

    constructor(app: CustomApp) {
        this.app = app

        this.eventHandler = (e: WheelEvent) => this.onMouseWheel(e)
        this.app.renderer.view.addEventListener('mousewheel', this.eventHandler, {passive: false})
        this.app.renderer.view.addEventListener('DOMMouseScroll', this.eventHandler, {passive: false})
        this.app.renderer.view.addEventListener('wheel', this.eventHandler, {passive: false})
    }

    setAction(action: (deltaY: number, position: Vector2D) => any) {
        this.action = action
    }

    onMouseWheel(e: WheelEvent) {
        // The whole app is scaled by 1/2
        let mousePosition = {x: 2 * e.offsetX, y: 2 * e.offsetY}
        let target = this.findScrollTarget(mousePosition)
        if (target) {
            e.preventDefault()
            if (this.action) {
                this.action(this.deriveNormalizedWheelDelta(e), mousePosition)
            }
        }
    }

    findScrollTarget(pos: IPointData) {
        return this.app.renderer.plugins.interaction.hitTest(pos)
    }

    deriveNormalizedWheelDelta(e: any) {
        if (e.detail) {
            if (e.wheelDelta)
                return e.wheelDelta / e.detail / 40 * (e.detail > 0 ? 1 : -1) // Opera
            else
                return -e.detail / 3 // Firefox
        } else
            return e.wheelDelta / 120 // IE,Safari,Chrome
    }

    destroy() {
        this.app.renderer.view.removeEventListener('mousewheel', this.eventHandler)
        this.app.renderer.view.removeEventListener('DOMMouseScroll', this.eventHandler)
    }
}