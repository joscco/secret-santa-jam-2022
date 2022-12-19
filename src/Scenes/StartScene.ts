import {Container, Sprite, Text} from 'pixi.js';
import {ASSET_MANAGER, CustomApp, GAME_HEIGHT, GAME_WIDTH} from "../index";
import Scene from "./Basics/Scene";
import {StartButton} from "../UI/Buttons/StartButton";
import {Texture} from "@pixi/core";
import {TextureAssetID} from "../General/AssetManager";
import Tweener from "../General/Tweener";
import {Easing} from "@tweenjs/tween.js";

export class StartScene extends Scene {

    background: Sprite;
    // stones: Sprite[]

    pretitle: Text;
    titleContainer: Container;
    titleLetters: Sprite[] = []

    startButton: StartButton

    started: boolean = false

    constructor(app: CustomApp) {
        super();
        this.app = app

        this.background = new Sprite(Texture.WHITE)
        this.background.tint = 0x235552
        this.background.width = GAME_WIDTH
        this.background.height = GAME_HEIGHT
        this.addChild(this.background)

        this.pretitle = this.addPretitle()
        this.pretitle.position.set(GAME_WIDTH / 2, 300)
        this.pretitle.scale.set(0)

        this.startButton = new StartButton()
        this.startButton.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 300)
        this.addChild(this.startButton)

        this.titleContainer = new Container()
        this.addChild(this.titleContainer)

        let letterX = 0
        Array.from(Array(9).keys()).map(key => {
            if (key === 5) {
                letterX = 0
            }
            let sprite = new Sprite(ASSET_MANAGER.getTextureAsset(`titleLetter${key}` as TextureAssetID))
            sprite.position.set(
                key < 5 ? 525 + letterX : 600 + letterX,
                key < 5 ? GAME_HEIGHT + 150 : GAME_HEIGHT + 400
            )
            letterX += sprite.width
            this.titleContainer.addChild(sprite)
            this.titleLetters.push(sprite)
        })
    }

    async start(): Promise<void> {
        if (!this.started) {
            this.blendInTitle()
        }
        this.started = true
    }

    private addPretitle(): Text {
        let pretitle = new Text("joscco presents", {
            fontFamily: "Futurahandwritten",
            fontWeight: "bold",
            fontSize: 50,
            fill: 0xffffff
        });
        pretitle.anchor.set(0.5)
        this.addChild(pretitle)
        return pretitle
    }

    private blendInTitle() {
        this.titleLetters.forEach(async (letter, index) => {
            await Tweener.of(letter.position)
                .to({y: index < 5 ? 150 : 400})
                .duration(1000)
                .delay(index * 200)
                .easing(Easing.Back.InOut)
                .start()
                .promise()
        })
    }
}
