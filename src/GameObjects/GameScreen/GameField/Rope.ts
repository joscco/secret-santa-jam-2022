import {Graphics, LINE_CAP, LINE_JOIN} from "pixi.js";
import {Vector2D} from "../../../General/Helpers";

export class Rope extends Graphics {
    private path: Vector2D[] = []

    dropFirstPoint() {
        this.path.shift()
        this.update()
    }

    addPoint(point: Vector2D) {
        if(point) {
            this.path.push({x: point.x, y: point.y})
            this.update()
        }
    }

    setFirstPoint(first: Vector2D) {
        this.path[0] = {x: first.x, y: first.y}
        this.update()
    }

    setLast(last: Vector2D) {
        this.path[this.path.length - 1] = {x: last.x, y: last.y}
        this.update()
    }

    setPath(path: Vector2D[]) {
        this.path = path
        this.update()
    }

    private update() {
        this.clear()
        this.lineStyle({
            width: 10,
            color: 0x000,
            cap: LINE_CAP.ROUND,
            join: LINE_JOIN.ROUND
        })
        if (this.path.length > 0) {
            this.moveTo(this.path[0].x, this.path[0].y)
            for (let i = 1; i < this.path.length; i++) {
                this.lineTo(this.path[i].x, this.path[i].y)
            }
        }
    }
}