import {ScalingButton} from "./ScalingButton";
import {ASSET_MANAGER, SCENE_MANAGER, SOUND_MANAGER} from "../../index";
import {Text, Texture} from "pixi.js";
import {TextureAssetID} from "../../General/AssetManager";

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
        return ASSET_MANAGER.getTextureAsset(`level${this.level}Bug` as TextureAssetID)
    }

    constructor(n: number, enabled: boolean) {
        super();
        this.level = n

        this.text = new Text(this.level, {
            fontFamily: "Futurahandwritten",
            fontSize: 60,
            strokeThickness: 15,
            lineJoin: "round"
        })
        this.text.anchor.set(0.5)
        this.text.position.set(-10, 0)
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