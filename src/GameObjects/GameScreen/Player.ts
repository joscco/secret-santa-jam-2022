import {Container} from "pixi.js";
import {limit, Vector2D, vectorDistance, vectorLerp} from "../../General/Helpers";
import {HookGun} from "./HookGun";
import {PlayerRenderer} from "./PlayerRenderer";
import {KeyHandler} from "../../General/KeyHandler";
import Tweener from "../../General/Tweener";
import {Easing} from "@tweenjs/tween.js";
import {Hook} from "./Hook";

export class Player extends Container {
    direction: Vector2D = {x: 0, y: 0}
    smoothing: number = 0.15

    private playerRenderer: PlayerRenderer
    gun: HookGun
    private hook: Hook

    moveLeft: number = 0
    moveRight: number = 0
    moveUp: number = 0
    moveDown: number = 0

    verticalSpeed: number = 0.5
    horizontalSpeed: number = 0.3

    constructor(hook: Hook) {
        super();

        this.hook = hook;

        this.playerRenderer = new PlayerRenderer()
        this.addChild(this.playerRenderer)

        this.initKeyControls()

        this.gun = new HookGun()
        this.gun.position.set(0, -10)

        this.addChild(this.gun)
    }

    update(delta: number) {
        let newDirection = {
            x: (-this.moveLeft + this.moveRight),
            y: (-this.moveUp + this.moveDown)
        }

        this.direction = vectorLerp(this.direction, newDirection, this.smoothing)
        let limited = limit(this.direction)

        this.playerRenderer.update()
        // Hier wird der scale auch nochmal gesetzt, nicht gut!
        this.playerRenderer.setState(limited)

        this.x += this.verticalSpeed * delta * limited.x;
        this.y += this.horizontalSpeed * delta * limited.y
    }

    private initKeyControls() {
        let left = new KeyHandler([37, 65]);
        let up = new KeyHandler([38, 87]);
        let right = new KeyHandler([39, 68]);
        let down = new KeyHandler([40, 83]);

        left.press = () => {
            this.moveLeft = 1;
        };

        left.release = () => {
            this.moveLeft = 0
        };

        up.press = () => {
            this.moveUp = 1;
        };

        up.release = () => {
            this.moveUp = 0
        };

        right.press = () => {
            this.moveRight = 1;
        };

        right.release = () => {
            this.moveRight = 0
        };

        //Down
        down.press = () => {
            this.moveDown = 1
        };

        down.release = () => {
            this.moveDown = 0
        };
    }

    async hookTo(mousePosition: any, onUpdate: () => void): Promise<any> {
        await Tweener.of(this.position)
            .to({x: mousePosition.x, y: mousePosition.y})
            .duration(vectorDistance(mousePosition, this.position) / 2)
            .easing(Easing.Cubic.Out)
            .onUpdate(onUpdate)
            .start()
            .promise()
    }

    rotateGunTowards(point: Vector2D) {
        this.gun.rotateTowards(point)
    }
}