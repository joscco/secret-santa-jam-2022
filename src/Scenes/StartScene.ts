import {Graphics, Text} from 'pixi.js';
import {CustomApp, GAME_HEIGHT, GAME_WIDTH} from "../index";
import Scene from "./Basics/Scene";
import {Player} from "../GameObjects/GameScreen/Player";
import Tweener from "../General/Tweener";
import {Easing} from "@tweenjs/tween.js";
import {Hook} from "../GameObjects/GameScreen/Hook";
import {Vector2D, vectorAdd, vectorSub} from "../General/Helpers";

export class StartScene extends Scene {

    pretitle: Text;
    started: boolean = false

    private player: Player;
    private hook: Hook;
    private drawingToHook: boolean = false
    private rope: Graphics


    constructor(app: CustomApp) {
        super();
        this.app = app

        this.pretitle = this.addPretitle()
        this.pretitle.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 2)
        this.pretitle.scale.set(0)

        this.hook = new Hook()

        this.player = new Player(this.hook)
        this.player.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 2)

        this.rope = new Graphics()

        let floor = new Graphics()
        floor.beginFill(0x00ff55)
        floor.drawRect(200, 200, 700, 700)
        floor.endFill()
        floor.interactive = true
        this.addChild(floor)

        floor.on("pointertap", async (event) => {
            if (!this.drawingToHook) {
                this.drawingToHook = true

                let mousePosition = {x: event.data.global.x, y: event.data.global.y}
                this.onPointerMove(mousePosition, true)
                let hookStart = this.player.gun.gunSprite.toGlobal({x: 100, y: 20})
                let hookOffset = vectorSub(mousePosition, hookStart)

                await this.hook.hookTo(mousePosition, () => this.updateRope(this.hook.position, vectorAdd(this.player.position, {x: 0, y:-10})))
                await this.player.hookTo(vectorAdd(this.player.position, hookOffset), () => this.updateRope(this.hook.position, vectorAdd(this.player.position, {x: 0, y:-10})))
                this.rope.clear()
                this.drawingToHook = false
            }
        })

        floor.on("pointermove", (event) => {
            this.onPointerMove(event.data.global)
        })

        this.addChild(this.rope, this.player, this.hook)
    }

    onPointerMove(mousePosition: Vector2D, force: boolean = false) {
        if (!this.drawingToHook || force) {
            this.player.rotateGunTowards(mousePosition)
            this.hook.scale.x = this.player.gun.gunSprite.scale.x
            this.hook.rotation = this.player.gun.gunSprite.rotation
            this.hook.position = this.player.gun.gunSprite.toGlobal({x: 100, y: 20})
        }
    }

    async start(): Promise<void> {
        if (!this.started) {
            await Tweener.of(this.pretitle.scale)
                .to({x: 1, y: 1}, 500)
                .easing(Easing.Back.Out)
                .start()
                .promise()
            Tweener.of(this.pretitle)
                .to({y: GAME_HEIGHT / 2 - 400}, 300)
                .easing(Easing.Quadratic.InOut)
                .start()
        }
        this.started = true
    }

    update(delta: number) {
        this.player.update(delta)
    }

    private addPretitle(): Text {
        let pretitle = new Text("Apple Grab", {
            fontFamily: "Futurahandwritten",
            fontWeight: "bold",
            fontSize: 50,
            fill: 0xffffff
        });
        pretitle.anchor.set(0.5)
        this.addChild(pretitle)
        return pretitle
    }

    private updateRope(pos1: Vector2D, pos2: Vector2D) {
        this.rope.clear()
        this.rope.lineStyle(10, 0x000)
            .moveTo(pos1.x, pos1.y)
            .lineTo(pos2.x, pos2.y);
    }
}
