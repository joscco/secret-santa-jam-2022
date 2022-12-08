import {Graphics} from "pixi.js";
import {vectorDistance, vectorLerp} from "../Helpers";

declare module "pixi.js" {
    interface Graphics {
        drawDashedLine(x_0: number, y_0: number, x_1: number, y_1: number, dashLength?: number, dashes?: number): void;
    }
}

Graphics.prototype.drawDashedLine = function (x_0: number, y_0: number, x_1: number, y_1: number, dashes: number = 12, dashLength: number = 3) {
    const startPosition = {x: x_0, y: y_0};
    const toPosition = {x: x_1, y: y_1};
    const distance = vectorDistance(startPosition, toPosition)
    const relativeDashLength = dashLength / distance
    const relativeGapLength = (1 - dashes * relativeDashLength) / (dashes - 1)

    for (let i = 0; i < dashes; i++) {
        let dashStart = vectorLerp(startPosition, toPosition, i * (relativeDashLength + relativeGapLength))
        let dashEnd = vectorLerp(startPosition, toPosition, i * (relativeDashLength + relativeGapLength) + relativeDashLength)
        this.moveTo(dashStart.x, dashStart.y);
        this.lineTo(dashEnd.x, dashEnd.y);
    }
};