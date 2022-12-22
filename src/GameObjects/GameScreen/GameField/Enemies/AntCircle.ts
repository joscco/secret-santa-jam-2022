import {EnemyGroup} from "./EnemyGroup";
import {Vector2D} from "../../../../General/Helpers";

export class AntCircle extends EnemyGroup {

    constructor(numberOfAnts: number) {
        super(numberOfAnts, "ANT");
    }

    move(index: number, time: number): Vector2D {
        return {
            x: 300 * Math.sin(2 * Math.PI / this.enemies.length * index + time / 500) - 10 * Math.cos(16 * Math.PI / this.enemies.length * index + time / 75),
            y: 300 * Math.cos(2 * Math.PI / this.enemies.length * index + time / 500) + 10 * Math.sin(16 * Math.PI / this.enemies.length * index + time / 75)
        };
    }

}