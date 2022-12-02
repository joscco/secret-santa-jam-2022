import {TooltipManager} from "./TooltipManager";
import {Container, Text} from "pixi.js";
import {Vector2D} from "../../General/Helpers";

export class Tooltip extends Container {

    private VERTICAL_PADDING = 20;
    private HORIZONTAL_PADDING = 20;
    private offsetX: number
    private offsetY: number
    private initialOffsetY: number
    private parentTooltip: TooltipManager
    // private textRectangle: NineSlicePlane
    private textObject: Text
    // private spike: Sprite

    constructor(parent: TooltipManager, offsetX: number, offsetY: number) {
        super();
        this.parentTooltip = parent

        this.offsetX = offsetX
        this.offsetY = offsetY
        this.initialOffsetY = offsetY

        // this.textRectangle = new NineSlicePlane(ASSET_MANAGER.getTextureAsset("tooltipRectangle"), 20, 20, 20, 20)
        this.textObject = new Text("", {fontFamily: "Futurahandwritten", fontSize: 30, fill: 0xffffff})
        this.textObject.anchor.set(0.5)

        // this.spike = new Sprite(ASSET_MANAGER.getTextureAsset("tooltipSpike"))
        // this.spike.anchor.set(0.5, 0)

        // this.addChild(this.textRectangle)
        // this.textRectangle.addChild(this.spike)
        // this.textRectangle.addChild(this.textObject)
        // this.scale.set(0)
    }

    // update(text: string): void {
    //     this.textObject!.text = text
    //     this.textRectangle!.width = this.textObject!.width + 2 * this.VERTICAL_PADDING
    //     this.textRectangle!.height = this.textObject!.height + 2 * this.HORIZONTAL_PADDING
    //
    //     this.textRectangle!.pivot.x = this.textRectangle!.width / 2
    //     this.textRectangle!.pivot.y = this.textRectangle!.height / 2
    //     this.textObject!.position.x = this.textRectangle!.width / 2
    //     this.textObject!.position.y = this.textRectangle!.height / 2
    //     this.spike!.position.x = this.textRectangle!.width / 2
    //     this.spike!.position.y = this.textRectangle!.height
    // }

    async show(): Promise<void> {
    }

    async hide(): Promise<void> {
    }

    repositionTo(position: Vector2D) {
        this.position = {x: position.x + this.offsetX, y: position.y + this.offsetY}
    }

    getText() {
        return this.textObject.text
    }
}