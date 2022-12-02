import {ScalingButton} from "./ScalingButton";
import {Texture} from "@pixi/core";
import {ASSET_MANAGER, GAME_DATA, LANGUAGE_MANAGER, SOUND_MANAGER} from "../../index";

export class LanguageButton extends ScalingButton {

    getTexture(): Texture | null {
        // return GAME_DATA.getPreferredLanguage() === "en"
        //     ? ASSET_MANAGER.getTextureAsset("english_flag")
        //     : ASSET_MANAGER.getTextureAsset("german_flag");
        return null
    }

    onClick(): void {
        LANGUAGE_MANAGER.swapLanguage()
        SOUND_MANAGER.playBlub()
        this.updateTexture()
    }

}