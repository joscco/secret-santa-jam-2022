import {Graphics, LINE_CAP} from "pixi.js";
import {Vector2D, vectorDistance, vectorLerp} from "../../../General/Helpers";

declare module "pixi.js" {
    interface Graphics {
        drawDashedLine(x_0: number, y_0: number, x_1: number, y_1: number, dashLength?: number, gap?: number): void;
    }
}

Graphics.prototype.drawDashedLine = function (x_0: number, y_0: number, x_1: number, y_1: number, dashLength: number = 20, gap: number = 20) {
    const startPosition = {x: x_0, y: y_0};
    const toPosition = {x: x_1, y: y_1};
    const distance = vectorDistance(startPosition, toPosition)
    const relativeGapLength = gap / distance
    const relativeDashLength = dashLength/distance
    const dashes = 1 / (relativeDashLength + relativeGapLength)

    for (let i = 0; i < dashes; i++) {
        let dashStart = vectorLerp(startPosition, toPosition, i * (relativeDashLength + relativeGapLength))
        let dashEnd = vectorLerp(startPosition, toPosition, i * (relativeDashLength + relativeGapLength) + relativeDashLength)
        this.moveTo(dashStart.x, dashStart.y);
        this.lineTo(dashEnd.x, dashEnd.y);
    }
};

export class PreviewRope extends Graphics {
    update(pos1: Vector2D, pos2: Vector2D) {
        this.clear()
        this.lineStyle({
            width: 8,
            color: 0xffffff,
            alpha: 0.5,
            cap: LINE_CAP.ROUND
        } )
            .drawDashedLine(pos1.x, pos1.y, pos2.x, pos2.y)
    }
}