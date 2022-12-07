import {Graphics} from "pixi.js";
import {Vector2D} from "../../../General/Helpers";

export class Rope extends Graphics {
    update(pos1: Vector2D, pos2: Vector2D) {
        this.clear()
        this.lineStyle(10, 0x000)
            .moveTo(pos1.x, pos1.y)
            .lineTo(pos2.x, pos2.y);
    }
}