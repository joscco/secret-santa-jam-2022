import {ScalingButton} from "./ScalingButton";
import {Texture} from "pixi.js";
import {DIALOG_MANAGER, SCENE_MANAGER, SOUND_MANAGER} from "../../index";

export class BackToLevelScreenButton extends ScalingButton {
    getTexture(): Texture | null {
        return null //ASSET_MANAGER.getTextureAsset("backButton")
    }

    async onClick(): Promise<void> {
        SOUND_MANAGER.playBlub()
        if (DIALOG_MANAGER.currentNode && DIALOG_MANAGER.currentNode.isOnLastSpeech()) {
            DIALOG_MANAGER.currentNode!.cancelLastSpeech(DIALOG_MANAGER.currentLevel!)
        }
        DIALOG_MANAGER.killAutocloseTimer()
        await DIALOG_MANAGER.endDialog()
        SCENE_MANAGER.startWithTransition("levelChooserScene")
    }
}