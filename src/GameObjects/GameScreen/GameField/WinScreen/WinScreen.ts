import {Container, Sprite, Text} from "pixi.js";
import Tweener from "../../../../General/Tweener";
import {GAME_HEIGHT, GAME_WIDTH} from "../../../../index";
import {Texture} from "@pixi/core";
import {Easing} from "@tweenjs/tween.js";
import {Star} from "../UI/Star";

export class WinScreen extends Container {
    background: Sprite
    title: Text
    pointsText: Text
    pointsNumberText: Text
    stars: Star[]

    // nextButton: WinScreenNextLevelButton
    // backToLevelsButton: WinScreenBackToLevelsButton

    constructor(stars: number[]) {
        super();

        this.position.set(GAME_WIDTH / 2, GAME_HEIGHT + GAME_HEIGHT / 2)

        this.background = new Sprite(Texture.WHITE)
        this.background.height = GAME_HEIGHT / 2
        this.background.width = GAME_WIDTH
        this.background.tint = 0x1f2d2f
        this.background.anchor.set(0.5)
        this.addChild(this.background)

        this.title = new Text("Great!", {fontFamily: "Futurahandwritten", fontSize: 75, fill: 0xffffff})
        this.title.anchor.set(0.5)
        this.title.position.set(0, -175)
        this.addChild(this.title)

        this.pointsText = new Text("Score:", {
            fontFamily: "Futurahandwritten",
            fontSize: 90,
            fill: 0x235552
        })
        this.pointsText.anchor.set(0.5)
        this.pointsText.position.set(-120, -50)
        this.addChild(this.pointsText)

        this.pointsNumberText = new Text("0", {
            fontFamily: "Futurahandwritten",
            fontSize: 90,
            fill: 0xa5d671
        })
        this.pointsNumberText.anchor.set(0.5)
        this.pointsNumberText.position.set(140, -50)
        this.addChild(this.pointsNumberText)

        this.stars = [0, 1, 2].map((index) => {
            let star = new Star(stars[index])
            star.position.set(-150 + index * 150, 80)
            star.scale.set(2)
            this.addChild(star)
            return star
        })
    }

    setPointsAndStars(points: number) {
        this.pointsNumberText.text = points
        for (let star of this.stars) {
            if (points >= star.points) {
                star.fillStar()
            }
        }
    }

    async blendIn() {
        await Tweener.of(this)
            .to({y: GAME_HEIGHT / 2})
            .duration(500)
            .easing(Easing.Back.InOut)
            .start()
            .promise()
    }
}