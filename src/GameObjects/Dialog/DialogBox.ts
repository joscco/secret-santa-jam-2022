import {Container} from "pixi.js";
import {GAME_HEIGHT, GAME_WIDTH} from "../../index";
import {DialogNode} from "./DialogConfig";
import Tweener from "../../General/Tweener";
import {Easing} from "@tweenjs/tween.js";

export class DialogBox extends Container {

    // background: Sprite
    // spike: Sprite
    // textObject: DialogTextBox

    private currentNode?: DialogNode

    // previousButton: ScalingButtonImpl
    // nextButton: ScalingButtonImpl
    // cancelButton: ScalingButtonImpl
    // understoodButton: UnderstoodButton

    constructor() {
        super();
        // this.background = new Sprite(ASSET_MANAGER.getTextureAsset("dialog_box"))
        // this.spike = new Sprite(ASSET_MANAGER.getTextureAsset("dialog_spike"))
        // this.background.tint = 0x000000
        // this.spike.tint = 0x000000

        // this.textObject = new DialogTextBox(this.background.width, this.background.height)

        // this.previousButton = new ScalingButtonImpl(ASSET_MANAGER.getTextureAsset("dialog_previous_button"), () => this.previousSpeech())
        // this.nextButton = new ScalingButtonImpl(ASSET_MANAGER.getTextureAsset("dialog_next_button"), () => this.nextSpeech())
        // this.cancelButton = new ScalingButtonImpl(ASSET_MANAGER.getTextureAsset("dialog_cross"), () => {
        //     if (this.currentNode && this.currentNode.isOnLastSpeech()) {
        //         DIALOG_MANAGER.currentNode!.cancelLastSpeech(DIALOG_MANAGER.currentLevel!)
        //     }
        //     DIALOG_MANAGER.killAutocloseTimer()
        //     DIALOG_MANAGER.endDialog()
        // })
        // this.understoodButton = new UnderstoodButton()

        this.hide()

        // this.background.anchor.set(0.5)
        //
        // this.spike.anchor.set(0.5, 1)
        // this.spike.position.set(575, -50)
        // this.spike.angle = 20
        //
        // this.previousButton.position.set(-this.background.width / 2 + 20, 0)
        // this.nextButton.position.set(this.background.width / 2 - 20, 0)
        // this.cancelButton.position.set(this.background.width / 2, -this.background.height / 2)
        // this.understoodButton.position.set(this.background.width / 2, 0)
        //
        // this.background.addChild(this.spike, this.textObject)
        // this.addChild(this.background, this.previousButton, this.nextButton, this.cancelButton, this.understoodButton)
    }

    async blendIn() {
        await Tweener.of(this.position)
            .to({y: GAME_HEIGHT - 150}, 0.5)
            .easing(Easing.Back.InOut)
    }

    async blendOut() {
        let relDistance = Math.abs(GAME_HEIGHT + 300 - this.position.y) / 450
        Tweener.of(this.position)
            .to({y: GAME_HEIGHT + 300}, 0.5 * relDistance)
            .easing(Easing.Back.InOut)
    }

    hide() {
        this.position.set(GAME_WIDTH / 2, GAME_HEIGHT + 300)
        // this.previousButton.hide()
        // this.nextButton.hide()
        // this.cancelButton.hide()
    }

    show() {
        this.position.set(GAME_WIDTH / 2, GAME_HEIGHT - 200)
    }

    // setSpeeches(node: DialogNode) {
    //     this.currentNode = node
    //     this.textObject.setFullText(this.currentNode.getSpeech())
    //
    //     this.previousButton.blendOut()
    //     this.understoodButton.blendOut()
    //
    //     this.understoodButton.setText(node.continuationText
    //         ? node.continuationText[LANGUAGE_MANAGER.getCurrentLanguage()]
    //         : "")
    //
    //     if (!this.currentNode.isOnLastSpeech()) {
    //         this.nextButton.blendIn()
    //     } else {
    //         this.nextButton.blendOut()
    //         // Handle last Speech
    //         node.startLastSpeech(DIALOG_MANAGER.currentLevel!)
    //         if (node.continuationText) {
    //             this.understoodButton.blendIn()
    //         }
    //     }
    //
    //     if (node.skippable) {
    //         this.cancelButton.blendIn()
    //     } else {
    //         this.cancelButton.blendOut()
    //     }
    // }
    //
    // private async nextSpeech() {
    //     if (this.currentNode && !this.currentNode.isOnLastSpeech()) {
    //         this.currentNode.increaseIndex()
    //         this.textObject.setFullText(this.currentNode.getSpeech())
    //
    //         if (this.currentNode.isOnLastSpeech()) {
    //             this.nextButton.blendOut()
    //             DIALOG_MANAGER.currentNode!.startLastSpeech(DIALOG_MANAGER.currentLevel!)
    //             if (DIALOG_MANAGER.currentNode!.continuationText) {
    //                 this.understoodButton.blendIn()
    //             }
    //         }
    //
    //         this.previousButton.blendIn()
    //         await this.type()
    //
    //         if (this.currentNode.isOnLastSpeech() && DIALOG_MANAGER.currentNode!.autoCloseDuration) {
    //             DIALOG_MANAGER.startAutocloseTimer()
    //         }
    //     }
    // }
    //
    // private async previousSpeech() {
    //     if (this.currentNode && !this.currentNode.isOnFirstSpeech()) {
    //         if (this.currentNode.isOnLastSpeech()) {
    //             DIALOG_MANAGER.currentNode!.cancelLastSpeech(DIALOG_MANAGER.currentLevel!)
    //             this.understoodButton.blendOut()
    //         }
    //
    //         DIALOG_MANAGER.killAutocloseTimer()
    //
    //         this.currentNode.decreaseIndex()
    //         this.textObject.setFullText(this.currentNode.getSpeech())
    //
    //         if (this.currentNode.isOnFirstSpeech()) {
    //             this.previousButton.blendOut()
    //         }
    //
    //         this.nextButton.blendIn()
    //         this.type()
    //     }
    // }
    //
    // async type() {
    //     await this.textObject.type()
    // }
}