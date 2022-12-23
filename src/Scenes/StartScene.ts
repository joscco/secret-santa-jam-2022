import {Container, Sprite, Text} from 'pixi.js';
import {ASSET_MANAGER, CustomApp, GAME_HEIGHT, GAME_WIDTH} from "../index";
import Scene from "./Basics/Scene";
import {StartButton} from "../UI/Buttons/StartButton";
import {Texture} from "@pixi/core";
import {TextureAssetID} from "../General/AssetManager";
import Tweener from "../General/Tweener";
import {Easing} from "@tweenjs/tween.js";
import {AntCircle} from "../GameObjects/GameScreen/GameField/Enemies/AntCircle";
import {GameField} from "../GameObjects/GameScreen/GameField/GameField";

export class StartScene extends Scene {

    background: Sprite;
    stones: Container;
    time: number = 0
    antCircle1: AntCircle
    antCircle2: AntCircle

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

        this.antCircle1 = new AntCircle(60, 400)
        this.antCircle1.position.set(500, GAME_HEIGHT/2)
        this.antCircle2 = new AntCircle(60, 400)
        this.antCircle2.position.set(GAME_WIDTH - 500, GAME_HEIGHT/2)

        this.stones = new Container()
        this.stones.sortableChildren = true
        for (let i = 0; i < 150; i++) {
            let randomIndex = Math.floor(28 * Math.random())
            let stone = new Sprite(ASSET_MANAGER.getTextureAsset(`rock${randomIndex}` as TextureAssetID))
            stone.anchor.set(0.5, 1)
            stone.position.set(Math.random() * GAME_WIDTH, Math.random() * GAME_HEIGHT)
            stone.zIndex = stone.y
            this.stones.addChild(stone)
        }

        this.stones.cacheAsBitmap = true
        this.addChild(GameField.initRandomField(), this.antCircle1, this.antCircle2, this.stones)

        this.pretitle = this.addPretitle()
        this.pretitle.position.set(GAME_WIDTH / 2, 100)

        this.startButton = new StartButton()
        this.startButton.position.set(GAME_WIDTH / 2, GAME_HEIGHT + 300)
        this.addChild(this.startButton)

        this.titleContainer = new Container()
        this.addChild(this.titleContainer)

        this.initLetters();
    }

    update(delta: number) {
        this.time += 1
        this.antCircle1.update(this.time, 1)
        this.antCircle2.update(this.time, 1)
    }

    private initLetters() {
        let letterX = 0
        Array.from(Array(9).keys()).map(key => {
            if (key === 5) {
                letterX = 0
            }
            let sprite = new Sprite(ASSET_MANAGER.getTextureAsset(`titleLetter${key}` as TextureAssetID))
            sprite.position.set(
                key < 5 ? 525 + letterX : 600 + letterX,
                -500
            )
            letterX += sprite.width
            this.titleContainer.addChild(sprite)
            this.titleLetters.push(sprite)
        })
    }

    afterFadeIn() {
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

    private async blendInTitle() {
        await new Promise(resolve => {
                for (let [index, letter] of this.titleLetters.entries()) {
                    Tweener.of(letter.position)
                        .to({y: index < 5 ? 180 : 430})
                        .duration(600)
                        .delay(index * 150)
                        .easing(Easing.Back.InOut)
                        .onComplete(index === this.titleLetters.length - 1 ? resolve : () => {
                        })
                        .start()
                }
            }
        )

        await Tweener.of(this.startButton)
            .to({y: GAME_HEIGHT / 2 + 300})
            .duration(500)
            .easing(Easing.Back.InOut)
            .start()
            .promise()
    }
}
