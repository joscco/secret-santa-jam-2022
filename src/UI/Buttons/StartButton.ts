import {ScalingButton} from "./ScalingButton";
import {SCENE_MANAGER, SOUND_MANAGER} from "../../index";
import {Texture} from "pixi.js";

export class StartButton extends ScalingButton {
    getTexture(): Texture {
        return Texture.EMPTY //ASSET_MANAGER.getTextureAsset("startScreenStartButton")
    }

    onClick(): void {
        SOUND_MANAGER.playBlub()
        SCENE_MANAGER.startWithTransition("levelChooserScene")
    }

}
