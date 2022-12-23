import {EnemyGroup} from "./EnemyGroup";
import {limit, Vector2D, vectorAdd, vectorDistance, vectorSub} from "../../../../General/Helpers";
import {Sprite} from "pixi.js";
import {ASSET_MANAGER} from "../../../../index";
import {Fruit} from "../Fruit/Fruit";

export class AntMountain extends EnemyGroup {
    sprite: Sprite
    fruits: Fruit[]
    nearestFruit?: Fruit
    offset: number = 50
    delay: number = 50
    speed: number = 1

    constructor(position: Vector2D, fruits: Fruit[], ants: number, delay: number, offset: number, speed: number) {
        super(ants, "ANT");

        this.delay = delay
        this.offset = offset
        this.speed = speed

        this.enemies.forEach(enemy => enemy.position = position)
        this.fruits = fruits
        this.sprite = new Sprite(ASSET_MANAGER.getTextureAsset("antMountain"))
        this.sprite.anchor.set(0.5, 0.8)
        this.sprite.position.set(position.x, position.y)
        this.addChild(this.sprite)
    }

    move(index: number, time: number, timeDelta: number, prevPosition: Vector2D): Vector2D {
        if (time > index * this.offset + this.delay) {
            this.enemies[index].isHome = false
            if (!this.nearestFruit || this.nearestFruit.isDead()) {
                this.nearestFruit = this.fruits.filter(fruit => !fruit.isDead()).sort((a, b) => vectorDistance(a, prevPosition) - vectorDistance(b, prevPosition))[0]
                if (!this.nearestFruit) {
                    return prevPosition
                }
            }
            if (vectorDistance(this.nearestFruit.position, prevPosition) > 40) {
                return vectorAdd(prevPosition, limit(vectorSub(this.nearestFruit.position, prevPosition), this.speed * timeDelta))
            } else {
                if (!this.enemies[index].isEater()) {
                    this.nearestFruit.addEater(this.enemies[index])
                }
            }
        }
        return prevPosition
    }
}