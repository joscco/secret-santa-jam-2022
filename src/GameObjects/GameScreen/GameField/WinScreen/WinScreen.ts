import {Container, Sprite, Text} from "pixi.js";
import Tweener from "../../../../General/Tweener";
import {GAME_HEIGHT, GAME_WIDTH, NUMBER_LEVELS} from "../../../../index";
import {Texture} from "@pixi/core";
import {Easing} from "@tweenjs/tween.js";
import {Star} from "../UI/Star";
import {WinScreenNextLevelButton} from "./WinScreenNextLevelButton";
import {WinScreenBackToLevelsButton} from "./WinScreenBackToLevelsButton";
import {WinScreenTryAgainButton} from "./WinScreenTryAgainButton";
import {sleep} from "../../../../General/Helpers";

export class WinScreen extends Container {
    level: number
    background: Sprite
    pointsText: Text
    pointsNumberText: Text
    stars: Star[]

    nextButton: WinScreenNextLevelButton
    backToLevelsButton: WinScreenBackToLevelsButton
    tryAgainButton: WinScreenTryAgainButton

    constructor(level: number, stars: number[]) {
        super();

        this.level = level
        this.position.set(GAME_WIDTH / 2, GAME_HEIGHT + GAME_HEIGHT / 2)

        this.background = new Sprite(Texture.WHITE)
        this.background.height = GAME_HEIGHT / 2
        this.background.width = GAME_WIDTH
        this.background.tint = 0x1f2d2f
        this.background.anchor.set(0.5)
        this.addChild(this.background)

        this.pointsText = new Text("Score:", {
            fontFamily: "Futurahandwritten",
            fontSize: 70,
            fill: 0x576678
        })
        this.pointsText.anchor.set(0.5)
        this.pointsText.position.set(0, -175)
        this.addChild(this.pointsText)

        this.pointsNumberText = new Text("0", {
            fontFamily: "Futurahandwritten",
            fontSize: 140,
            fill: 0xffffff
        })
        this.pointsNumberText.anchor.set(0.5)
        this.pointsNumberText.position.set(0, -50)
        this.addChild(this.pointsNumberText)

        this.stars = [0, 1, 2].map((index) => {
            let star = new Star(stars[index])
            star.position.set(-150 + index * 150, 80)
            star.scale.set(2)
            star.pointsText.style.fill = 0x235552
            this.addChild(star)
            return star
        })

        this.nextButton = new WinScreenNextLevelButton(level + 1)
        this.nextButton.position.set(550, 0)
        this.nextButton.scale.set(0)

        this.tryAgainButton = new WinScreenTryAgainButton(level)
        this.tryAgainButton.position.set(550, -40)
        this.tryAgainButton.scale.set(0)

        this.backToLevelsButton = new WinScreenBackToLevelsButton()
        this.backToLevelsButton.position.set(-550, 0)

        this.addChild(this.nextButton, this.backToLevelsButton, this.tryAgainButton)
    }

    setPointsAndStars(points: number) {
        this.pointsNumberText.text = points
        for (let star of this.stars) {
            if (points >= star.points) {
                star.fillStar()
            }
        }
        if (points >= this.stars[0].points) {
            if (this.level < NUMBER_LEVELS) {
                this.nextButton.scale.set(1)
            } else {
                this.nextButton.scale.set(0)
            }

            this.tryAgainButton.scale.set(0)
        } else {
            this.tryAgainButton.scale.set(1)
            this.nextButton.scale.set(0)
        }
    }

    async blendIn() {
        await sleep(200)
        await Tweener.of(this)
            .to({y: GAME_HEIGHT / 2})
            .duration(500)
            .easing(Easing.Back.InOut)
            .start()
            .promise()
    }
}