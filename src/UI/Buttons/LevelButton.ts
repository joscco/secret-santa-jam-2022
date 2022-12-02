import {ScalingButton} from "./ScalingButton";
import {SCENE_MANAGER, SOUND_MANAGER} from "../../index";
import {Text, Texture} from "pixi.js";

export class LevelButton extends ScalingButton {

    level: number
    private text: Text
    private enabled: boolean = false

    onClick(): void {
        SOUND_MANAGER.playBlub()
        SCENE_MANAGER.startWithTransition("level_" + this.level)
    }

    isScalingEnabled(): boolean {
        return this.enabled
    }

    getTexture(): Texture | null {
        return null//ASSET_MANAGER.getTextureAsset(LevelInitiator.getRecipeForDay(this.level))
    }

    constructor(n: number, enabled: boolean) {
        super();
        this.level = n
        this.sprite.scale.set(0.43)

        this.text = new Text(this.level, {
            fontFamily: "Futurahandwritten",
            fontSize: 100,
            strokeThickness: 15,
            lineJoin: "round"
        })
        this.text.anchor.set(0.5)
        this.addChild(this.text)
        this.updateTexture()

        this.setEnabled(enabled)
    }

    setEnabled(value: boolean) {
        this.enabled = value
        this.interactive = value
        if (!this.enabled) {
            this.text.style.fill = 0xffffff;
            this.text.style.stroke = 0x000000;
            this.sprite.tint = 0x000000
        } else {
            this.text.style.fill = 0x000000;
            this.text.style.stroke = 0xffffff;
            this.sprite.tint = 0xFFFFFF
        }
    }
}