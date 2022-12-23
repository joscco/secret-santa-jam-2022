import {EnemyGroup} from "./EnemyGroup";
import {Vector2D} from "../../../../General/Helpers";

export class AntCircle extends EnemyGroup {

    radius: number

    constructor(numberOfAnts: number, radius: number) {
        super(numberOfAnts, "ANT");
        this.radius = radius
        this.enemies.forEach(enemy => enemy.isHome = false)
    }

    move(index: number, time: number): Vector2D {
        return {
            x: this.radius * Math.sin(2 * Math.PI / this.enemies.length * index + time / 500) - this.radius / 30 * Math.cos(16 * Math.PI / this.enemies.length * index + time / 75),
            y: this.radius * Math.cos(2 * Math.PI / this.enemies.length * index + time / 500) + this.radius / 30 * Math.sin(16 * Math.PI / this.enemies.length * index + time / 75)
        };
    }

}