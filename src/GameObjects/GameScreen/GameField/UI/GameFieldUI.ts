import {Container} from "pixi.js";
import {RoundBar} from "./RoundBar";
import {EnergyBar} from "./EnergyBar";
import {PointBar} from "./PointBar";

export class GameFieldUI extends Container {
    roundSymbols: RoundBar
    pointBar: PointBar
    energyBar: EnergyBar

    constructor() {
        super();
        this.roundSymbols = new RoundBar()

        this.pointBar = new PointBar()
        this.pointBar.position.set(100, 50)
        this.addChild(this.pointBar)

        this.energyBar = new EnergyBar()
    }

}