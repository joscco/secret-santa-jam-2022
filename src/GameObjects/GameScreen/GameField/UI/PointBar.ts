import {Container, Text, TextStyle} from "pixi.js";

export class PointBar extends Container {
    pointTextObject: Text

    constructor() {
        super();
        this.pointTextObject = new Text("0", new TextStyle({
            fontFamily: "Futurahandwritten",
            fill: "#ffffff",
            fontSize: 60
        }))
        this.addChild(this.pointTextObject)
    }
}