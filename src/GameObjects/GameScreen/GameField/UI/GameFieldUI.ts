import {Container, Text} from "pixi.js";
import {Star} from "./Star";

export class GameFieldUI extends Container {
    levelText: Text
    pointsText: Text
    pointsNumberText: Text
    stars: Star[]

    constructor(level: number, starPoints: number[], startPoints: number) {
        super();
        this.levelText = new Text(`LEVEL ${level}`, {fontFamily: "Futurahandwritten", fontSize: 60, fill: 0xffffff})
        this.levelText.position.set(50, 40)

        this.pointsText = new Text("POINTS:", {fontFamily: "Futurahandwritten", fontSize: 50, fill: 0x000000})
        this.pointsText.position.set(50, 110)

        this.pointsNumberText = new Text(`${startPoints}`, {fontFamily: "Futurahandwritten", fontSize: 50, fill: 0xffffff})
        this.pointsNumberText.position.set(250, 110)

        this.stars = starPoints.map((points, index) => {
            let star = new Star(points)
            star.position.set(85 + index * 75, 200)
            this.addChild(star)
            return star
        })

        this.addChild(this.levelText, this.pointsText, this.pointsNumberText, ...this.stars)
    }

}