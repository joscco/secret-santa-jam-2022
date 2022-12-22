import Scene from "./Basics/Scene";
import {GameField} from "../GameObjects/GameScreen/GameField/GameField";
import {GameFieldUI} from "../GameObjects/GameScreen/GameField/UI/GameFieldUI";
import {WinScreen} from "../GameObjects/GameScreen/GameField/WinScreen/WinScreen";
import {Fruit} from "../GameObjects/GameScreen/GameField/Fruit/Fruit";
import {Bumper} from "../GameObjects/GameScreen/GameField/Bumper";
import {Hole} from "../GameObjects/GameScreen/GameField/Hole";
import {Polygon2D} from "../General/Polygon2D";
import {AntCircle} from "../GameObjects/GameScreen/GameField/Enemies/AntCircle";
import {GAME_HEIGHT, GAME_WIDTH} from "../index";

export class Level extends Scene {
    level: number
    points: number = 0
    gameField: GameField

    winScreen: WinScreen
    uiOverlay: GameFieldUI

    fruits: Fruit[] = []
    holes: Hole[] = []
    bumpers: Bumper[] = []

    blockPolygons: Polygon2D[]
    antCircle: AntCircle
    antCircle2: AntCircle

    constructor(level: number) {
        super();
        this.level = level

        // Set fruits
        let apple = new Fruit("apple")
        apple.position.set(900, 600)
        let pear = new Fruit("pear")
        pear.position.set(1700, 600)
        this.fruits.push(apple, pear)

        let hole = new Hole()
        hole.position.set(1100, 500)
        this.holes.push(hole)

        let bumper = new Bumper()
        bumper.position.set(1100, 800)
        let bumper2 = new Bumper()
        bumper2.position.set(800, 800)
        this.bumpers.push(bumper, bumper2)

        this.blockPolygons = [
            new Polygon2D([
                {x: 100, y: 400},
                {x: 450, y: 400},
                {x: 450, y: 100},
                {x: GAME_WIDTH - 450, y: 100},
                {x: GAME_WIDTH - 450, y: 250},
                {x: GAME_WIDTH - 100, y: 250},
                {x: GAME_WIDTH - 100, y: GAME_HEIGHT - 100},
                {x: 100, y: GAME_HEIGHT - 100}
            ]),
            new Polygon2D([
                {x: 1300, y: 300},
                {x: 1300, y: 700},
            ])]

        this.antCircle = new AntCircle(60)
        this.antCircle.position.set(GAME_WIDTH / 2 + 150, GAME_HEIGHT / 2)

        this.antCircle2 = new AntCircle(60)
        this.antCircle2.position.set(GAME_WIDTH / 2 - 150, GAME_HEIGHT / 2)

        this.gameField = new GameField(
            this.blockPolygons, this.bumpers, this.holes, [this.antCircle, this.antCircle2], this.fruits,
            (fruit: Fruit) => this.removeFruit(fruit), (amount: number) => this.addPoints(amount)
        )

        this.uiOverlay = new GameFieldUI(1, [200, 300, 400], 0)
        this.winScreen = new WinScreen(this.level, [200, 300, 400])

        this.addChild(this.gameField, this.uiOverlay, this.winScreen)
    }

    update(delta: number) {
        this.gameField.update()
    }

    removeFruit(fruit: Fruit) {
        this.fruits.remove(fruit)
        this.addPoints(fruit.points)
        if (this.fruits.length === 0) {
            this.gameField.disableInput()
            this.winScreen.setPointsAndStars(this.points)
            this.winScreen.blendIn()
        }
    }

    addPoints(value: number) {
        this.points += value
        this.uiOverlay.stars.forEach(star => {
            if (star.points <= this.points) {
                star.fillStar()
            }
        })
        this.uiOverlay.pointsNumberText.text = `${this.points}`
    }
}