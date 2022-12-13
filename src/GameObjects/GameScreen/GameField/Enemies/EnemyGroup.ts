import {Enemy} from "./Enemy";
import {Vector2D, vectorSub} from "../../../../General/Helpers";
import {Container} from "pixi.js";

export abstract class EnemyGroup extends Container {
    enemies: Enemy[]
    time: number = 0

    constructor(enemies: Enemy[]) {
        super()
        this.enemies = enemies
        this.addChild(...enemies)
    }

    update() {
        this.time++
        this.enemies.forEach((enemy, i) => {
            let newPos = this.move(i, this.time)
            let direction = vectorSub(newPos, enemy.position)
            enemy.sprite.rotation = Math.atan2(direction.y, direction.x)
            enemy.position.set(newPos.x, newPos.y)
        })
    }

    abstract move(index: number, time: number): Vector2D
}