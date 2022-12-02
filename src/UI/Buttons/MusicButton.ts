import {Container, Texture} from "pixi.js";
import {SOUND_MANAGER} from "../../index";
import {OutlineFilter} from "@pixi/filter-outline";

export class MusicButton extends Container {

    enabled: boolean = true
    // sprite: Sprite
    // slider: VerticalSlider

    constructor() {
        super();
        // this.sprite = new CenteredSprite(ASSET_MANAGER.getTextureAsset("musicButton"))
        //
        // this.slider = new VerticalSlider({
        //     increaseToBottom: false,
        //     innerTexture: ASSET_MANAGER.getTextureAsset("sliderInner"),
        //     outerTexture: ASSET_MANAGER.getTextureAsset("sliderOuter"),
        //     knobTexture: ASSET_MANAGER.getTextureAsset("sliderKnob"),
        //     anchorKnob: {x: 0.5, y: 0.5},
        //     startValue: 0,
        //     marginTop: 12,
        //     marginBottom: 15
        // })

        // this.slider.setValueHandler(val => this.onValueChange(val))
        // this.slider.position.set(60, 47)
        //
        // this.addChild(this.sprite, this.slider)
    }

    getTexture(): Texture {
        // return this.enabled
        //     ? ASSET_MANAGER.getTextureAsset("musicButton")
        //     : ASSET_MANAGER.getTextureAsset("noMusicButton");
        return Texture.EMPTY
    }

    onValueChange(newValue: number) {
        SOUND_MANAGER.setMusicVolume(newValue)
        this.enabled = newValue !== 0
        this.updateTexture()
    }

    highlight() {
        this.filters = [new OutlineFilter(10, 0xfd4343, 0.2)]
    }

    unhighlight() {
        this.filters = []
    }

    private updateTexture() {
        // this.sprite.texture = this.getTexture()
    }
}