import {EnemyGroup} from "./EnemyGroup";
import {Vector2D} from "../../../../General/Helpers";
import {Enemy} from "./Enemy";

export class AntCircle extends EnemyGroup {

    numberOfAnts: number

    constructor(enemies: Enemy[]) {
        super(enemies);

        this.numberOfAnts = enemies.length
    }

    move(index: number, time: number): Vector2D {
        return {
            x: 300 * Math.sin(2 * Math.PI / this.numberOfAnts * index + time / 500) - 20 * Math.cos(16 * Math.PI / this.numberOfAnts * index + time / 75),
            y: 300 * Math.cos(2 * Math.PI / this.numberOfAnts * index + time / 500) + 20 * Math.sin(16 * Math.PI / this.numberOfAnts * index + time / 75)
        };
    }

}