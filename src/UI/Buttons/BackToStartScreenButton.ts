import {ScalingButton} from "./ScalingButton";
import {Texture} from "pixi.js";
import {SCENE_MANAGER, SOUND_MANAGER} from "../../index";

export class BackToStartScreenButton extends ScalingButton {
    getTexture(): Texture | null {
        return null //ASSET_MANAGER.getTextureAsset("backButton")
    }

    onClick(): void {
        SOUND_MANAGER.playBlub()
        SCENE_MANAGER.startWithTransition("startScene")
    }
}``