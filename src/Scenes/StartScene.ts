import {Text} from 'pixi.js';
import {CustomApp, GAME_HEIGHT, GAME_WIDTH} from "../index";
import Scene from "./Basics/Scene";
import {Player} from "../GameObjects/GameScreen/Player";
import Tweener from "../General/Tweener";
import {Easing} from "@tweenjs/tween.js";

export class StartScene extends Scene {

    pretitle: Text;
    started: boolean = false
    private player: Player;

    constructor(app: CustomApp) {
        super();
        this.app = app

        this.pretitle = this.addPretitle()
        this.pretitle.position.set(GAME_WIDTH / 2, GAME_HEIGHT /2)
        this.pretitle.scale.set(0)

        this.player = new Player()
        this.player.position.set(GAME_WIDTH/2, GAME_HEIGHT/2)
        this.addChild(this.player)
    }

    async start(): Promise<void> {
        if (!this.started) {
            await new Promise(resolve => Tweener.of(this.pretitle.scale)
                .to({x: 1, y: 1}, 500)
                .easing(Easing.Back.Out)
                .onComplete(resolve)
                .start())
            Tweener.of(this.pretitle)
                .to({y: GAME_HEIGHT/2 - 400}, 300)
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
}
