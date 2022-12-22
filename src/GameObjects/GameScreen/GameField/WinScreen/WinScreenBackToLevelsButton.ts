import {ScalingButton} from "../../../../UI/Buttons/ScalingButton";
import {Texture} from "@pixi/core";
import {ASSET_MANAGER, SCENE_MANAGER, SOUND_MANAGER} from "../../../../index";

export class WinScreenBackToLevelsButton extends ScalingButton {
    getTexture(): Texture | null {
        return ASSET_MANAGER.getTextureAsset("backArrowButton");
    }

    onClick(): void {
        SOUND_MANAGER.playBlub()
        SCENE_MANAGER.startWithTransition("levelChooserScene")
    }

}