// Tooltip which gets a Sprite that it attaches to and a method of that sprite delivering the text

import {Container} from "pixi.js";
import {Tooltip} from "./Tooltip";
import {Vector2D} from "../../General/Helpers";

export interface Tooltipable extends Container {
    getTooltipText(): string

    isTooltipEnabled(): boolean
}

export class TooltipManager extends Container {

    private readonly TOOLTIP_DELAY: number = 500
    private tooltipTimer?: NodeJS.Timer
    private tooltip: Tooltip
    private enabled: boolean = true
    private currentBearer?: Tooltipable
    private pointerDown: boolean = false
    private offsetX: number = 0
    private offsetY: number = -110
    private lastMousePosition: Vector2D = {x: -100, y: -100}

    constructor() {
        super()
        this.tooltip = new Tooltip(this, this.offsetX, this.offsetY)
        this.zIndex = 100
        this.addChild(this.tooltip)
    }

    registerTooltipFor(bearer: Tooltipable) {
        bearer.interactive = true

        bearer.on("pointerdown", () => this.pointerDown = true)

        bearer.on("pointerup", () => this.pointerDown = false)

        bearer.on("pointerupoutside", () => this.pointerDown = false)

        bearer.on("pointerover", async (event) => {
            this.lastMousePosition = event.global
            this.currentBearer = bearer
            if (this.enabled && this.currentBearer.isTooltipEnabled()) {
                clearTimeout(this.tooltipTimer)
                this.tooltipTimer = setTimeout(() => {
                    // If we still hover the same thing, show the tooltip
                    if (this.enabled && this.currentBearer === bearer && !this.pointerDown) {
                        let currentMousePosition = this.currentBearer.getGlobalPosition()
                        this.showTooltip(currentMousePosition, this.currentBearer.getTooltipText())
                    }
                }, this.TOOLTIP_DELAY)
            }
        })

        bearer.on("pointerout", (event) => {
            this.lastMousePosition = event.global
            this.currentBearer = undefined
            this.hideTooltip()
        })
    }

    async updateText() {
        if (this.currentBearer
            && this.enabled
            && this.currentBearer.isTooltipEnabled()) {
            let newText = this.currentBearer.getTooltipText()

            if (this.tooltip.getText() !== newText) {

                this.showTooltip(this.currentBearer.position, newText)
            }
        }
    }

    async showTooltip(position: Vector2D, text: string): Promise<void> {
            await this.tooltip.hide()
            this.tooltip.repositionTo(position)
            // this.tooltip.update(text)
            this.tooltip.show()
    }

    async hideTooltip(): Promise<void> {
        clearTimeout(this.tooltipTimer)
        await this.tooltip.hide()
    }

    disableTooltips() {
        this.tooltip.hide()
        this.enabled = false
    }

    enableTooltips() {
        this.enabled = true
    }
}