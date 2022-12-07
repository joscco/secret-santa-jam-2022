import {Container} from "pixi.js";
import {Vector2D, vectorLerp} from "../../../General/Helpers";
import {PlayerRenderer} from "./PlayerRenderer";
import Tweener from "../../../General/Tweener";
import {Easing} from "@tweenjs/tween.js";
import {Hook} from "./Hook";

export class Player extends Container {
    playerRenderer: PlayerRenderer
    verticalSpeed: number = 0.2
    horizontalSpeed: number = 0.1
    HOOK_SPEED = 500

    constructor() {
        super();

        this.playerRenderer = new PlayerRenderer()
        this.addChild(this.playerRenderer)
    }

    async hookTo(dynamicPoint: Hook, onUpdate: () => void): Promise<any> {
        let val = {x: 0}
        await Tweener.of(val)
            .to({x: 1})
            .duration(this.HOOK_SPEED)
            .easing(Easing.Quartic.InOut)
            .onUpdate((object) => {
                onUpdate()
                this.position = vectorLerp(this.position, dynamicPoint.gunPoint.getGlobalPosition(), object.x)
            })
            .start()
            .promise()
    }

    runTowards(delta: number, direction: Vector2D) {
        this.playerRenderer.update()
        // Hier wird der scale auch nochmal gesetzt, nicht gut!
        this.playerRenderer.setState(direction)
        this.x += this.verticalSpeed * delta * direction.x;
        this.y += this.horizontalSpeed * delta * direction.y
    }
}