import Scene from "./Basics/Scene";
import {Text} from "pixi.js";
import {CustomApp, GAME_HEIGHT, GAME_WIDTH} from "../index";
import {Easing} from "@tweenjs/tween.js";
import Tweener from "../General/Tweener";

export class LoadingScene extends Scene {
    loadingText: Text

    constructor(app: CustomApp) {
        super();
        this.app = app

        this.loadingText = new Text("Loading...",
            {fontFamily: "Futurahandwritten", fontSize: 60, fill: 0xffffff})
        this.loadingText.anchor.set(0.5)
        this.loadingText.scale.set(0)
        this.loadingText.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 300)

        this.addChild(this.loadingText)
    }

    async start() {
        await this.blendInLoadingText()
    }

    private async blendInLoadingText() {
        await Tweener.of(this.loadingText.scale)
            .to({x: 1, y: 1}, 300)
            .easing(Easing.Back.InOut)
            .start()
            .promise()
    }

    setProgress(percent: number) {
        this.loadingText.text = `Loading... ${percent * 100}%`
    }
}