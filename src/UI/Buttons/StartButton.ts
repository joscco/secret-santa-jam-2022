import {ScalingButton} from "./ScalingButton";
import {ASSET_MANAGER, SCENE_MANAGER, SOUND_MANAGER} from "../../index";
import {Texture} from "pixi.js";

export class StartButton extends ScalingButton {
    getTexture(): Texture {
        return ASSET_MANAGER.getTextureAsset("startButton")
    }

    onClick(): void {
        SOUND_MANAGER.playBlub()
        SCENE_MANAGER.startWithTransition("levelChooserScene")
    }
}
