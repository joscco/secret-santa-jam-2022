import {Enemy, ENEMY_TYPE} from "./Enemy";
import {Vector2D, vectorSub} from "../../../../General/Helpers";
import {Container} from "pixi.js";

export abstract class EnemyGroup extends Container {
    enemies: Enemy[]
    type: ENEMY_TYPE

    constructor(amount: number, type: ENEMY_TYPE) {
        super()
        this.type = type
        this.enemies = Array(amount).fill(0).map((_, __) => new Enemy(type))
        this.addChild(...this.enemies)
    }

    update(time: number, timeDelta: number) {
        this.enemies.forEach((enemy, i) => {
            let newPos = this.move(i, time, timeDelta, enemy.position)
            let direction = vectorSub(newPos, enemy.position)

            if (this.type === "ANT") {
                enemy.sprite.rotation = Math.atan2(direction.y, direction.x)
            } else {
                enemy.scale.x = direction.y > 0 ? 1 : -1
            }

            enemy.position.set(newPos.x, newPos.y)
        })
    }

    abstract move(index: number, time: number, timeDelta: number, previousPosition: Vector2D): Vector2D
}