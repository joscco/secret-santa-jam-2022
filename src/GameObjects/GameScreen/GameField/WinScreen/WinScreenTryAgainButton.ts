import {ScalingButton} from "../../../../UI/Buttons/ScalingButton";
import {Texture} from "@pixi/core";
import {ASSET_MANAGER, SCENE_MANAGER, SOUND_MANAGER} from "../../../../index";

export class WinScreenTryAgainButton extends ScalingButton {
    level: number
    constructor(level: number) {
        super();
        this.level = level
    }
    getTexture(): Texture | null {
        return ASSET_MANAGER.getTextureAsset("tryAgainButton");
    }

    onClick(): void {
        SOUND_MANAGER.playBlub()
        SCENE_MANAGER.startWithTransition(`level_${this.level}`, true)
    }

}