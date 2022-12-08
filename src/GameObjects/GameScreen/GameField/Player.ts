import {Container} from "pixi.js";
import {Vector2D} from "../../../General/Helpers";
import {PlayerRenderer} from "./PlayerRenderer";

export class Player extends Container {
    playerRenderer: PlayerRenderer
    verticalSpeed: number = 0.2
    horizontalSpeed: number = 0.1

    constructor() {
        super();

        this.playerRenderer = new PlayerRenderer()
        this.addChild(this.playerRenderer)
    }

    runTowards(delta: number, direction: Vector2D) {
        this.playerRenderer.update()
        // Hier wird der scale auch nochmal gesetzt, nicht gut!
        this.playerRenderer.setState(direction)
        this.x += this.verticalSpeed * delta * direction.x;
        this.y += this.horizontalSpeed * delta * direction.y
    }
}