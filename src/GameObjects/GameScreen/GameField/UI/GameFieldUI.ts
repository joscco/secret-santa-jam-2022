import {Container, Text} from "pixi.js";
import {Star} from "./Star";
import {BackToLevelScreenButton} from "../../../../UI/Buttons/BackToLevelScreenButton";

export class GameFieldUI extends Container {
    levelText: Text
    pointsText: Text
    pointsNumberText: Text
    stars: Star[]
    backButton: BackToLevelScreenButton

    constructor(level: number, starPoints: number[], startPoints: number) {
        super();
        this.levelText = new Text(`LEVEL ${level}`, {fontFamily: "Futurahandwritten", fontSize: 60, fill: 0xffffff})
        this.levelText.anchor.set(0.5)
        this.levelText.position.set(230, 80)

        this.pointsText = new Text("POINTS:", {fontFamily: "Futurahandwritten", fontSize: 50, fill: 0x000000})
        this.pointsText.position.set(50, 120)

        this.pointsNumberText = new Text(`${startPoints}`, {fontFamily: "Futurahandwritten", fontSize: 50, fill: 0xffffff})
        this.pointsNumberText.position.set(250, 120)

        this.stars = starPoints.map((points, index) => {
            let star = new Star(points)
            star.position.set(85 + index * 75, 210)
            this.addChild(star)
            return star
        })

        this.backButton = new BackToLevelScreenButton()
        this.backButton.position.set(70, 80)

        this.addChild(this.backButton, this.levelText, this.pointsText, this.pointsNumberText, ...this.stars)
    }

}