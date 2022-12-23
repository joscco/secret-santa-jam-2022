import {ScalingButton} from "./ScalingButton";
import {Texture} from "pixi.js";
import {ASSET_MANAGER, SCENE_MANAGER, SOUND_MANAGER} from "../../index";

export class BackToLevelScreenButton extends ScalingButton {
    getTexture(): Texture | null {
        return ASSET_MANAGER.getTextureAsset("backButtonSymbol")
    }

    async onClick(): Promise<void> {
        SOUND_MANAGER.playBlub()
        SCENE_MANAGER.startWithTransition("levelChooserScene")
    }
}