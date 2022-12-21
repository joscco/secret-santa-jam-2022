import Scene from "./Basics/Scene";
import {Sprite, Text} from "pixi.js";
import {LevelButton} from "../UI/Buttons/LevelButton";
import {CustomApp, GAME_DATA, GAME_HEIGHT, GAME_WIDTH} from "../index";
import {Texture} from "@pixi/core";

export class LevelChooserScene extends Scene {

    background: Sprite
    title: Text
    levelButtons: LevelButton[]
    // backButton: ScalingButton

    constructor(app: CustomApp) {
        super();
        this.app = app

        this.background = new Sprite(Texture.WHITE)
        this.background.tint = 0x1f2d2f
        this.background.height = GAME_HEIGHT
        this.background.width = GAME_WIDTH
        this.addChild(this.background)

        this.title = this.setUpTitle()
        this.levelButtons = this.setUpLevelButtons()
        // this.backButton = this.setUpBackButton()
    }

    private setUpTitle(): Text {
        let title = new Text("Choose a level", {fontFamily: "Futurahandwritten", fontWeight: "bold", fontSize: 75, fill: 0xffffff})
        title.anchor.set(0.5)
        title.position.set(GAME_WIDTH / 2, 125)
        this.addChild(title)
        return title
    }

    private setUpLevelButtons(): LevelButton[] {
        let buttons = []

        for (let n of [1, 2, 3, 4]) {
            let button = new LevelButton(n, n <= GAME_DATA.getUnlockedLevels())
            button.x = 300 + ((n - 1) % 4) * 400
            button.y = GAME_HEIGHT/2
            this.addChild(button)
            buttons.push(button)
        }
        return buttons
    }

    updateLevelButtons() {
        this.levelButtons.forEach(button => {
            button.setEnabled(button.level <= GAME_DATA.getUnlockedLevels())
            button.updateTexture()
        })
    }
}