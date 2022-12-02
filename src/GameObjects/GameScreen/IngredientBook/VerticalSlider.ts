import {Container, NineSlicePlane, Sprite, Texture} from "pixi.js";
import {clamp, Vector2D, vectorAdd} from "../../../General/Helpers";

export type SliderConfig = {
    increaseToBottom: boolean
    outerTexture: Texture,
    innerTexture?: Texture,
    knobTexture: Texture,

    anchorKnob?: Vector2D,
    offsetX?: number,
    marginTop?: number,
    marginBottom?: number,
    startValue?: number
}

export class VerticalSlider extends Container {
    private readonly minY: number
    private readonly maxY: number
    private readonly increaseToBottom: boolean
    private readonly outerBar: Sprite
    private readonly innerBar?: NineSlicePlane
    private readonly knob: Sprite
    private dragging: boolean = false
    private valueHandler?: (value: number) => void

    constructor(config: SliderConfig) {
        super()

        this.increaseToBottom = config.increaseToBottom

        this.outerBar = new Sprite(config.outerTexture)
        this.outerBar.anchor.set(0.5, this.increaseToBottom ? 0 : 1)

        if (config.innerTexture && Texture.EMPTY !== config.innerTexture) {
            this.innerBar = new NineSlicePlane(config.innerTexture)
            this.innerBar.pivot.set(this.innerBar.width / 2, this.increaseToBottom ? 0 : this.innerBar.height)
        }

        let marginTop = config.marginTop ?? 0
        let marginBottom = config.marginBottom ?? 0

        this.minY = this.increaseToBottom ? marginTop : -this.outerBar.height + marginTop
        this.maxY = this.increaseToBottom ? this.outerBar.height - marginBottom : -marginBottom

        this.knob = new Sprite(config.knobTexture)

        if (config.anchorKnob) {
            this.knob.anchor.set(config.anchorKnob.x, config.anchorKnob.y)
        }

        if (config.offsetX) {
            this.knob.position.set(config.offsetX, this.minY)
        }

        this.addChild(this.knob)

        this.initScrollbarDragging();

        if (this.innerBar) {
            this.addChild(this.innerBar)
        }

        this.updateValue(config.startValue ?? 0)

        this.addChild(this.outerBar, this.knob)
    }

    private initScrollbarDragging() {
        this.knob.interactive = true
        this.knob.cursor = "pointer"

        let dragOffset: Vector2D

        this.knob.on("pointerdown", (event) => {
            let mousePosition: Vector2D = event.data.global
            dragOffset = {
                x: this.knob.x - mousePosition.x,
                y: this.knob.y - mousePosition.y
            }
            this.dragging = true
        })

        this.knob.on("pointermove", (event) => {
            if (this.dragging) {
                let mousePosition = event.data.global
                this.updateKnobPosition(vectorAdd(mousePosition, dragOffset));
            }
        })

        this.knob.on("pointerup", () => {
            this.dragging = false
        })

        this.knob.on("pointerupoutside", () => {
            this.dragging = false
        })
    }

    private updateKnobPosition(vector2D: Vector2D) {
        let clampedValue = clamp(vector2D.y, this.minY, this.maxY)
        this.knob.position.y = clampedValue

        let relativeValue = this.increaseToBottom
            ? (clampedValue - this.minY) / (this.maxY - this.minY)
            : (clampedValue - this.maxY) / (this.minY - this.maxY)

        if (this.innerBar) {
            this.innerBar.scale.set(1, relativeValue)
        }

        if (this.valueHandler) {
            this.valueHandler(relativeValue)
        }
    }

    relativeValueToY(relativeValue: number) {
        return this.increaseToBottom
            ? this.minY + relativeValue * (this.maxY - this.minY)
            : this.maxY - relativeValue * (this.maxY - this.minY)
    }

    updateValue(value: number) {
        this.updateKnobPosition({x: this.x, y: this.relativeValueToY(value)})
    }

    setValueHandler(func: (value: number) => void) {
        this.valueHandler = func
        this.updateKnobPosition(this.knob.position)
    }
}