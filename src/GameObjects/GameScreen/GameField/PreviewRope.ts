import {Graphics, LINE_CAP} from "pixi.js";
import {Vector2D, vectorDistance, vectorLerp} from "../../../General/Helpers";

declare module "pixi.js" {
    interface Graphics {
        drawDashedLine(x_0: number, y_0: number, x_1: number, y_1: number, dashLength?: number, dashes?: number): void;
    }
}

Graphics.prototype.drawDashedLine = function (x_0: number, y_0: number, x_1: number, y_1: number, dashLength: number = 3, dashes: number = 12) {
    const startPosition = {x: x_0, y: y_0};
    const toPosition = {x: x_1, y: y_1};
    const distance = vectorDistance(startPosition, toPosition)
    const relativeDashLength = dashLength/distance
    const relativeGapLength = (1 - dashes * relativeDashLength) / (dashes - 1)

    for (let i = 0; i < dashes; i++) {
        let dashStart = vectorLerp(startPosition, toPosition, i * (relativeDashLength + relativeGapLength))
        let dashEnd = vectorLerp(startPosition, toPosition, i * (relativeDashLength + relativeGapLength) + relativeDashLength)
        this.moveTo(dashStart.x, dashStart.y);
        this.lineTo(dashEnd.x, dashEnd.y);
    }
};

export class PreviewRope extends Graphics {
    update(path: Vector2D[]) {
        this.clear()
        this.lineStyle({
            width: 8,
            color: 0xffffff,
            cap: LINE_CAP.ROUND})
        for(let i = 0; i<path.length -1; i++) {
            this.drawDashedLine(path[i].x, path[i].y, path[i+1].x, path[i+1].y)
        }
    }
}