import {Graphics, LINE_CAP} from "pixi.js";
import {Vector2D, vectorDistance} from "../../../General/Helpers";

export class PreviewRope extends Graphics {
    readonly NUMBER_DASHES = 50
    update(path: Vector2D[]) {
        this.clear()
        this.lineStyle({
            width: 8,
            color: 0xffffff,
            cap: LINE_CAP.ROUND
        })

        let segmentLengths = path.slideWindow(2).map(tuple => vectorDistance(tuple[0], tuple[1]))
        let wholeLength = segmentLengths.add()
        let dashes = segmentLengths.multiply(this.NUMBER_DASHES / wholeLength).ceil()
        for (let i = 0; i < path.length - 1; i++) {
            this.drawDashedLine(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y, dashes[i])
        }
    }
}