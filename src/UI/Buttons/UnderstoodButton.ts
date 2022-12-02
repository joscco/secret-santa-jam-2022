import {Text} from "pixi.js";
import {ScalingButton} from "./ScalingButton";
import {Texture} from "@pixi/core";
import {ASSET_MANAGER, EVENT_EMITTER, SOUND_MANAGER} from "../../index";

export class UnderstoodButton extends ScalingButton {

    private textObject: Text

    constructor(initialText?: string) {
        super();

        this.textObject = new Text(initialText ?? "", {
            fontFamily: "Futurahandwritten", fontSize: 50, fill: 0xffffff
        })
        this.textObject.anchor.set(0.5)
        this.addChild(this.textObject)
    }

    setText(text: string) {
        this.textObject.text = text;
    }

    getTexture(): Texture | null {
        return null //ASSET_MANAGER.getTextureAsset("dialog_understood_button");
    }

    async onClick(): Promise<void> {
        await this.blendOut()
        EVENT_EMITTER.emit("clicked_continuation_button")
        SOUND_MANAGER.playBlub()
    }

    hide() {
        this.interactive = false
        this.scale.set(0)
    }

    show() {
        this.interactive = true
        this.scale.set(1)
    }

    async blendOut(): Promise<void> {
        this.interactive = false
    }

    async blendIn(): Promise<void> {
        this.interactive = true
    }
}