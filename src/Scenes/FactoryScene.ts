import Scene from "./Basics/Scene";
import {CustomApp, DIALOG_MANAGER, TOOLTIP_MANAGER} from "../index";
import {isRectangularArray} from "../General/Helpers";
import {Dialog} from "../GameObjects/Dialog/DialogConfig";
import {BackToLevelScreenButton} from "../UI/Buttons/BackToLevelScreenButton";

export type FactorySceneOptions = {
    app: CustomApp,
    level: number,
    conveyorBeltPattern: string,
    dialog?: Dialog,
    hints?: Dialog[],
    lastWords?: Dialog
}

export class FactoryScene extends Scene {

    level: number

    private dialog?: Dialog
    private hints: Dialog[]
    private lastWords?: Dialog

    // UI
    private backToLevelScreenButton: BackToLevelScreenButton;
    private timeInterval?: NodeJS.Timer
    private lastHintIndex;

    constructor(opts: FactorySceneOptions) {
        super();
        this.app = opts.app;
        this.level = opts.level
        this.sortableChildren = true

        this.dialog = opts.dialog
        this.hints = opts.hints ?? []
        this.lastWords = opts.lastWords

        this.lastHintIndex = 0

        let patternArr = opts.conveyorBeltPattern.split("\n").map(row => row.split("|").map(el => el.trim()))

        if (!isRectangularArray(patternArr)) {
            throw Error("Conveyor Belt Pattern is not rectangular!")
        }


        this.backToLevelScreenButton = new BackToLevelScreenButton()
        this.backToLevelScreenButton.position.set(80, 125)
        this.backToLevelScreenButton.zIndex = 5
        this.addChild(this.backToLevelScreenButton)

    }

    start() {
        DIALOG_MANAGER.setLevel(this)

        if (this.dialog) {
            DIALOG_MANAGER.startDialog(this.dialog);
        }
    }

    async beforeFadeOut() {
        DIALOG_MANAGER.removeLevel()
        if (DIALOG_MANAGER.hasNode()) {
            await DIALOG_MANAGER.endDialog()
        }
        await TOOLTIP_MANAGER.disableTooltips()
    }

    async afterFadeOut() {
    }


    private isUpperLetter(str: String) {
        return str.length === 1 && str.match(/[A-Z]/);
    }

    private isNumber(str: String) {
        return str.length === 1 && str.match(/[0-9]+/);
    }

    getHint(): Dialog | null {
        if (this.hints.length > 0) {
            this.lastHintIndex = (this.lastHintIndex + 1) % this.hints.length
            return this.hints[this.lastHintIndex]
        }
        return null
    }
}