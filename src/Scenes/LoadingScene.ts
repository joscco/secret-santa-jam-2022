import {Sprite, Text, TextStyle} from 'pixi.js';
import {ASSET_MANAGER, CustomApp, GAME_HEIGHT, GAME_WIDTH, SCENE_MANAGER} from "../index";
import Scene from "./Basics/Scene";
import {Texture} from "@pixi/core";
import Tweener from "../General/Tweener";
import {Easing} from "@tweenjs/tween.js";
import {sleep} from "../General/Helpers";

export class LoadingScene extends Scene {

    loadingComplete: boolean = false
    background: Sprite;
    loadingText?: Text;

    constructor(app: CustomApp) {
        super();
        this.app = app

        this.background = new Sprite(Texture.WHITE)
        this.background.alpha = 0
        this.background.width = GAME_WIDTH
        this.background.height = GAME_HEIGHT
        this.background.interactive = true
        this.background.cursor = "pointer"
        this.background.on("pointertap", () => {
            if (this.loadingComplete) {
                SCENE_MANAGER.startWithTransition("startScene")
            }
        })
        this.addChild(this.background)
    }

    async setProgress(number: number) {
        if(!this.loadingComplete) {
            this.loadingText!.text = `${number * 100}%`
            if (number >= 1) {
                this.loadingComplete = true
                await this.blendOutLoadingText()
                this.loadingText!.text = "> Click to focus <"
                await sleep(500)
                this.blendInLoadingText()
            }
        }
    }

    async loadAssets() {
        await ASSET_MANAGER.loadLoadingScreenAssets()
        this.loadingText = this.initText()
        this.addChild(this.loadingText)
        await this.blendInLoadingText()
        await ASSET_MANAGER.loadMainAssets(this)
    }

    private initText(): Text {
        let loadingText = new Text("0%", new TextStyle({
            fontFamily: "Futurahandwritten",
            fill: "#ffffff",
            fontSize: 50
        }))
        loadingText.anchor.set(0.5)
        loadingText.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40)
        loadingText.alpha = 0
        return loadingText
    }

    private async blendInLoadingText() {
        await Tweener.of(this.loadingText!)
            .to({y: GAME_HEIGHT/2, alpha: 1})
            .duration(500)
            .easing(Easing.Quadratic.Out)
            .start()
            .promise()
    }

    private async blendOutLoadingText() {
        await Tweener.of(this.loadingText!)
            .to({y: GAME_HEIGHT/2 + 40, alpha: 0})
            .duration(500)
            .easing(Easing.Quadratic.In)
            .start()
            .promise()
    }
}
