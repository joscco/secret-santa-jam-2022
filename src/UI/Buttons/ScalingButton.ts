import {Button} from "./Button";
import {Texture} from "@pixi/core";
import {SOUND_MANAGER} from "../../index";
import Tweener from "../../General/Tweener";
import {Easing} from "@tweenjs/tween.js";

export abstract class ScalingButton extends Button {
    constructor() {
        super();
        this.on("pointerover", () => {
                if (this.isScalingEnabled()) {
                    this.scaleUp();
                }
            })
        this.on("pointerout", () => {
                if (this.isScalingEnabled()) {
                    this.scaleDown()
                }
        })
    }

    isScalingEnabled(): boolean {
        return true;
    }

    async scaleUpTo(value: number, duration: number) {
        await Tweener.of(this.scale)
            .to({x: value, y: value})
            .duration(duration)
            .easing(Easing.Back.Out)
            .start()
            .promise()
    }

    scaleUp() {
        this.scaleUpTo(1.2, 300)
    }

    scaleDown() {
        this.scaleUpTo(1, 300)
    }
}

export class ScalingButtonImpl extends ScalingButton{
    active: boolean = true
    private texture: Texture

    constructor(texture: Texture, private onClickAction: () => void) {
        super()
        this.texture = texture
        this.updateTexture()
    }

    getTexture(): Texture | null {
        return this.texture;
    }

    onClick(): void {
        if (this.active) {
            SOUND_MANAGER.playBlub()
            this.onClickAction()
        }
    }

    async blendOut(): Promise<void> {
        this.interactive = false
        this.active = false
    }

    async blendIn(): Promise<void> {
        this.active = true
        this.interactive = true
    }

    hide() {
        this.scale.set(0)
    }

    show() {
        this.scale.set(1)
    }
}