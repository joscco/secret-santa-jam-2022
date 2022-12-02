import Scene from "./Basics/Scene";
import {Text} from "pixi.js";
import {LevelButton} from "../UI/Buttons/LevelButton";
import {CustomApp, GAME_DATA, GAME_WIDTH, LANGUAGE_MANAGER} from "../index";
import {ScalingButton} from "../UI/Buttons/ScalingButton";
import {BackToStartScreenButton} from "../UI/Buttons/BackToStartScreenButton";
import {LEVEL_MANIFEST} from "./Basics/LevelInitiator";
import {Language, LanguageDependantItem} from "../General/LanguageManager";
import {Tween} from "@tweenjs/tween.js";
import {Vector2D} from "../General/Helpers";

export class LevelChooserScene extends Scene implements LanguageDependantItem {

    title: Text
    levelButtons: LevelButton[]
    backButton: ScalingButton
    backgroundMoveTween?: Tween<Vector2D>

    constructor(app: CustomApp) {
        super();
        this.app = app

        this.setupBackground()
        this.title = this.setUpTitle()
        this.levelButtons = this.setUpLevelButtons()
        this.backButton = this.setUpBackButton()

        LANGUAGE_MANAGER.addLanguageItem(this)
    }

    setLanguage(newLanguage: Language): void {
        this.title.text = newLanguage === "en" ? "Choose a level" : "Wähle ein Level"
    }

    private setupBackground() {
        // let texture = ASSET_MANAGER.getTextureAsset("startScreenBackgroundPatternBrown")
        // let scrollingBackground = new TilingSprite(texture)
        // scrollingBackground.width = 2 * GAME_WIDTH
        // scrollingBackground.height = 2 * GAME_HEIGHT
        // scrollingBackground.texture.baseTexture.mipmap = MIPMAP_MODES.OFF
        // scrollingBackground.clampMargin = 0.5
        //
        // this.backgroundMoveTween = gsap.to(scrollingBackground.tilePosition, {
        //     x: -texture.width,
        //     y: -texture.height,
        //     duration: 15,
        //     repeat: -1,
        //     ease: Linear.easeNone
        // })
        // this.addChild(scrollingBackground);
    }

    private setUpTitle(): Text {
        let title = new Text("Choose a level", {fontFamily: "Futurahandwritten", fontWeight: "bold", fontSize: 75, fill: 0x000000})
        title.anchor.set(0.5)
        title.position.set(GAME_WIDTH / 2, 125)
        this.addChild(title)
        return title
    }

    beforeFadeIn() {
        this.backgroundMoveTween?.resume()
    }

    afterFadeOut() {
        this.backgroundMoveTween?.pause()
    }

    private setUpLevelButtons(): LevelButton[] {
        let buttons = []

        for (let element of LEVEL_MANIFEST) {
            let n = element.level
            let button = new LevelButton(n, n <= GAME_DATA.getUnlockedLevels())
            button.x = 200 + ((n - 1) % 8) * 215
            button.y = 325 + Math.floor((n - 1) / 8) * 240
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

    private setUpBackButton(): ScalingButton {
        let backToStartScreenButton = new BackToStartScreenButton()
        backToStartScreenButton.position.set(80, 125)
        this.addChild(backToStartScreenButton)
        return backToStartScreenButton
    }
}