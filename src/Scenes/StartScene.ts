import {Text} from 'pixi.js';
import {CustomApp, GAME_HEIGHT, GAME_WIDTH} from "../index";
import Scene from "./Basics/Scene";
import Tweener from "../General/Tweener";
import {Easing} from "@tweenjs/tween.js";
import {GameField} from "../GameObjects/GameScreen/GameField/GameField";

export class StartScene extends Scene {

    pretitle: Text;
    started: boolean = false
    gameField: GameField

    constructor(app: CustomApp) {
        super();
        this.app = app

        this.pretitle = this.addPretitle()
        this.pretitle.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 2)
        this.pretitle.scale.set(0)

        this.gameField = new GameField()
        this.addChild(this.gameField)
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
        this.gameField.update()
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
