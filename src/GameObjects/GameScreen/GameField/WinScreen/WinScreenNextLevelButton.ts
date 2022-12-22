import {ScalingButton} from "../../../../UI/Buttons/ScalingButton";
import {Texture} from "@pixi/core";
import {ASSET_MANAGER, SCENE_MANAGER, SOUND_MANAGER} from "../../../../index";

export class WinScreenNextLevelButton extends ScalingButton {

    nextLevel: number
    constructor(nextLevel: number) {
        super();
        this.nextLevel = nextLevel
    }
    getTexture(): Texture | null {
        return ASSET_MANAGER.getTextureAsset("arrowButton");
    }

    onClick(): void {
        SOUND_MANAGER.playBlub()
        SCENE_MANAGER.startWithTransition(`level_${this.nextLevel}`)
    }

}