import {Sprite} from "pixi.js";
import {Texture} from "@pixi/core";
import {sleep} from "../../General/Helpers";

export class BlinkingEyes extends Sprite {
    private readonly eyesOpenTexture: Texture;
    private readonly eyesClosedTexture: Texture;
    private blinkingDisabled: boolean = false;

    constructor(eyesOpenTexture: Texture, eyesClosedTexture: Texture) {
        super(eyesOpenTexture);

        this.eyesOpenTexture = eyesOpenTexture
        this.eyesClosedTexture = eyesClosedTexture
    }

    private async blink(): Promise<void> {
        if (!this.blinkingDisabled) {
            let blinkTime = Math.random() * 500
            let unblinkTime = Math.random() * 8000

            this.closeEyes()
            await sleep(blinkTime)

            this.openEyes()
            await sleep(unblinkTime)

            this.blink()
        }
    }

    startBlinking() {
        this.blinkingDisabled = false
        this.blink()
    }

    stopBlinking() {
        this.blinkingDisabled = true
    }

    private closeEyes() {
        this.texture = this.eyesClosedTexture
    }

    private openEyes() {
        this.texture = this.eyesOpenTexture
    }
}