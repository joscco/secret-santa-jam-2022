import {Container, Sprite, Texture} from "pixi.js";
import {ASSET_MANAGER, SOUND_MANAGER} from "../../index";
import {OutlineFilter} from "@pixi/filter-outline";
import {VerticalSlider} from "../../GameObjects/GameScreen/IngredientBook/VerticalSlider";
import {CenteredSprite} from "../../General/CenteredSprite";

export class SoundButton extends Container {

    enabled: boolean = true
    sprite: Sprite
    slider: VerticalSlider

    constructor() {
        super();
        this.sprite = new CenteredSprite(ASSET_MANAGER.getTextureAsset("soundSymbol"))

        this.slider = new VerticalSlider({
            increaseToBottom: false,
            innerTexture: ASSET_MANAGER.getTextureAsset("sliderInner"),
            outerTexture: ASSET_MANAGER.getTextureAsset("sliderOuter"),
            knobTexture: ASSET_MANAGER.getTextureAsset("sliderKnob"),
            anchorKnob: {x: 0.5, y: 0.5},
            startValue: 1,
            marginTop: 15,
            marginBottom: 15
        })

        this.slider.setValueHandler(val => this.onValueChange(val))
        this.slider.position.set(70, 47)

        this.addChild(this.sprite, this.slider)
    }

    getTexture(): Texture {
        return ASSET_MANAGER.getTextureAsset("soundSymbol")
    }

    onValueChange(newValue: number) {
        SOUND_MANAGER.setSoundVolume(newValue)
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
        this.sprite.texture = this.getTexture()
    }
}