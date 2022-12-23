import Scene from "./Basics/Scene";
import {GameField} from "../GameObjects/GameScreen/GameField/GameField";
import {GameFieldUI} from "../GameObjects/GameScreen/GameField/UI/GameFieldUI";
import {WinScreen} from "../GameObjects/GameScreen/GameField/WinScreen/WinScreen";
import {Fruit, FruitType} from "../GameObjects/GameScreen/GameField/Fruit/Fruit";
import {Bumper} from "../GameObjects/GameScreen/GameField/Bumper";
import {Hole} from "../GameObjects/GameScreen/GameField/Hole";
import {Polygon2D} from "../General/Polygon2D";
import {AntCircle} from "../GameObjects/GameScreen/GameField/Enemies/AntCircle";
import {GAME_DATA} from "../index";
import {AntMountain} from "../GameObjects/GameScreen/GameField/Enemies/AntMountain";
import {EnemyGroup} from "../GameObjects/GameScreen/GameField/Enemies/EnemyGroup";

export type FruitConfig = {
    position: number[],
    type: FruitType
}

export type AntMountainConfig = {
    ants: number,
    position: number[],
    offset: number,
    delay: number,
    speed: number
}

export type AntCircleConfig = {
    ants: number,
    position: number[],
    radius: number
}

export type BumperConfig = {
    position: number[],
    angle: number
}

export type LevelConfig = {
    level: number,
    stars: number[]
    fruits: FruitConfig[],
    startPosition: number[],
    holes: number[][],
    polygons: Polygon2D[],
    antMountains: AntMountainConfig[],
    antCircles: AntCircleConfig[],
    bumpers: BumperConfig[]
}

export class Level extends Scene {
    levelConfig: LevelConfig
    level: number
    stars: number[]
    points: number
    gameField?: GameField

    winScreen?: WinScreen
    uiOverlay?: GameFieldUI

    enemyGroups?: EnemyGroup[]
    fruits: Fruit[] = []
    holes: Hole[] = []
    bumpers: Bumper[] = []

    blockPolygons?: Polygon2D[]

    constructor(levelConfig: LevelConfig) {
        super();
        this.points = 0
        this.levelConfig = levelConfig
        this.level = levelConfig.level
        this.stars = levelConfig.stars
    }

    beforeFadeIn() {
        this.points = 0
        this.initLevel()
    }

    private initLevel() {
        // Set fruits
        for (let fruitConfig of this.levelConfig.fruits) {
            let fruit = new Fruit(fruitConfig.type)
            fruit.position.set(fruitConfig.position[0], fruitConfig.position[1])
            this.fruits.push(fruit)
        }

        for (let holeConfig of this.levelConfig.holes) {
            let hole = new Hole()
            hole.position.set(holeConfig[0], holeConfig[1])
            this.holes.push(hole)
        }

        this.blockPolygons = this.levelConfig.polygons

        for(let bumperConfig of this.levelConfig.bumpers) {
            let bumper = new Bumper()
            bumper.position.set(...bumperConfig.position)
            bumper.angle = bumperConfig.angle
            this.bumpers.push(bumper)
        }

        this.enemyGroups = []

        for (let antCircleConfig of this.levelConfig.antCircles) {
            let antCircle = new AntCircle(antCircleConfig.ants, antCircleConfig.radius)
            antCircle.position.set(...antCircleConfig.position)
            this.enemyGroups?.push(antCircle)
        }

        for (let antMountainConfig of this.levelConfig.antMountains) {
            let position = {x: antMountainConfig.position[0], y: antMountainConfig.position[1]}
            let antMountain = new AntMountain(position, this.fruits, antMountainConfig.ants, antMountainConfig.delay, antMountainConfig.offset, antMountainConfig.speed)
            this.enemyGroups?.push(antMountain)
        }

        this.gameField = new GameField(
            this.blockPolygons, this.bumpers, this.holes, this.enemyGroups, this.fruits,
            (fruit: Fruit) => this.removeFruit(fruit), (amount: number) => this.addPoints(amount)
        )

        this.gameField.hedgehog.position.set(...this.levelConfig.startPosition)

        this.uiOverlay = new GameFieldUI(this.level, this.stars, 0)
        this.winScreen = new WinScreen(this.level, this.stars)

        this.addChild(this.gameField, this.uiOverlay, this.winScreen)
    }

    update(delta: number) {
        this.gameField!.update()
    }

    removeFruit(fruit: Fruit) {
        this.fruits.remove(fruit)
        if (this.fruits.length === 0) {
            this.gameField!.disableInput()
            this.winScreen!.setPointsAndStars(this.points)
            this.winScreen!.blendIn()
            GAME_DATA.saveStars(this.level, this.stars, this.points)
            GAME_DATA.saveUnlockedLevel(this.level + 1)
        }
    }

    addPoints(value: number) {
        this.points += value
        this.uiOverlay!.stars.forEach(star => {
            if (star.points <= this.points) {
                star.fillStar()
            }
        })
        this.uiOverlay!.pointsNumberText.text = `${this.points}`
    }
}