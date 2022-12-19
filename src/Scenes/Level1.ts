import Scene from "./Basics/Scene";
import {GameField} from "../GameObjects/GameScreen/GameField/GameField";

export class Level1 extends Scene {

    gameField: GameField

    constructor() {
        super();
        this.gameField = new GameField()
        this.addChild(this.gameField)
    }

    update(delta: number) {
        this.gameField.update()
    }

}