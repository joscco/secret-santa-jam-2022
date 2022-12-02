import {Container} from "pixi.js";
import {DialogBox} from "./DialogBox";
import {Dialog, DialogNode} from "./DialogConfig";
import { DIALOG_MANAGER, GAME_DATA, TOOLTIP_MANAGER} from "../../index";
import {FactoryScene} from "../../Scenes/FactoryScene";
import {sleep} from "../../General/Helpers";

export class DialogManager extends Container {

    dialogBox: DialogBox
    currentNode?: DialogNode
    currentLevel?: FactoryScene
    private autocloseTimer?: NodeJS.Timeout;

    constructor() {
        super();
        this.dialogBox = new DialogBox()
        this.addChild(this.dialogBox)
    }

    setLevel(level: FactoryScene) {
        this.currentLevel = level
    }

    async startDialog(dialog: Dialog) {
        TOOLTIP_MANAGER.disableTooltips()
        this.currentNode = dialog.getStartDialog()
        this.currentNode.orSkippabilaty(this.currentLevel!.level < GAME_DATA.getUnlockedLevels())

        // BERND.blendIn()
        await sleep(700)
        // Starting first node
        this.currentNode.start(this.currentLevel!)
        // this.dialogBox.setSpeeches(this.currentNode)
        await this.dialogBox.blendIn()
        // await this.dialogBox.type()

        if (this.currentNode && this.currentNode.speeches.length === 1 && this.currentNode.autoCloseDuration) {
            DIALOG_MANAGER.startAutocloseTimer()
        }
    }

    async advance(node: DialogNode) {
        if (this.currentNode) {
            this.currentNode.end(this.currentLevel!)
        }

        this.currentNode = node
        this.currentNode.orSkippabilaty(this.currentLevel!.level < GAME_DATA.getUnlockedLevels())

        // starting node
        this.currentNode.start(this.currentLevel!)
        // this.dialogBox.setSpeeches(node)
        // await this.dialogBox.type()

        if (node.speeches.length === 1 && node.autoCloseDuration) {
            DIALOG_MANAGER.startAutocloseTimer()
        }
    }

    hasNode(): boolean {
        return this.currentNode != undefined
    }

    async endDialog() {
        if (this.currentNode && this.currentLevel) {
            this.currentNode.end(this.currentLevel)
        }

        this.currentNode = undefined
        await this.dialogBox.blendOut()
        // await BERND.blendOut()
        TOOLTIP_MANAGER.enableTooltips()
    }

    hideDialog() {
        this.dialogBox.hide()
    }

    async showHint() {
        let hint = this.currentLevel?.getHint() ?? undefined
        if (hint) {
            this.startDialog(hint)
        }
    }

    removeLevel() {
        this.currentLevel = undefined
    }

    startAutocloseTimer() {
        if (this.currentNode && this.currentNode.autoCloseDuration) {
            this.autocloseTimer = setTimeout(() => this.endDialog(), this.currentNode.autoCloseDuration)
        }
    }

    killAutocloseTimer() {
        if(this.autocloseTimer) {
            clearTimeout(this.autocloseTimer)
        }
    }
}