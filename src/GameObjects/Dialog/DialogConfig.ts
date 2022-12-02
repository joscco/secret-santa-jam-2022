import {EmittableEvent} from "../../General/EventEmitter";
import {DIALOG_MANAGER, EVENT_EMITTER, LANGUAGE_MANAGER} from "../../index";
import {FactoryScene} from "../../Scenes/FactoryScene";

export type DialogNodeSpeech = { text: { en: string, de: string } }

export type DialogConfig = {
    nodes: DialogNodeConfig[];
}

export const END = -1

export type NextNodeConfig = { on: EmittableEvent, nextNodeId: string | -1 }

export type DialogNodeConfig = {
    id: string,
    speeches: DialogNodeSpeech[],
    nextNodes: NextNodeConfig[],

    canSkip?: boolean,
    durationUntilAutoClose?: number,
    continuationText?: {en: string, de: string},

    onStartDo?: (level: FactoryScene) => void,
    onEndDo?: (level: FactoryScene) => void,
    onLastSpeechDo?: (level: FactoryScene) => void,
    onLastSpeechUndo?: (level: FactoryScene) => void,
}

export class Dialog {

    nodes: DialogNode[] = []
    startNode: DialogNode

    constructor(config: DialogConfig) {
        config.nodes.forEach(nodeConfig => this.nodes.push(new DialogNode(this, nodeConfig)))
        this.startNode = this.nodes[0]
    }

    continueWith(id: string | -1) {
        if (id === -1) {
            DIALOG_MANAGER.endDialog()
            return
        }

        if (id && this.getDialogForID(id)) {
            DIALOG_MANAGER.advance(this.getDialogForID(id)!)
        }
    }


    private getDialogForID(id: string): DialogNode | undefined {
        return this.nodes.find(node => node.id === id)
    }

    getStartDialog(): DialogNode {
        return this.startNode
    }
}

export class DialogNode {
    id: string

    private onStartDo?: (currentLevel: FactoryScene) => void
    private onEndDo?: (currentLevel: FactoryScene) => void
    private onLastSpeechDo?: (currentLevel: FactoryScene) => void
    private onLastSpeechUndo?: (currentLevel: FactoryScene) => void

    speeches: DialogNodeSpeech[]
    currentIndex: number
    dialog: Dialog
    nextNodes: NextNodeConfig[]

    skippable: boolean
    autoCloseDuration?: number
    continuationText?: {en: string, de: string}

    constructor(dialog: Dialog, config: DialogNodeConfig) {
        this.id = config.id
        this.speeches = config.speeches
        this.currentIndex = 0
        this.dialog = dialog
        this.nextNodes = config.nextNodes
        this.skippable = config.canSkip ?? false
        this.autoCloseDuration = config.durationUntilAutoClose
        this.continuationText = config.continuationText

        this.onStartDo = config.onStartDo
        this.onEndDo = config.onEndDo
        this.onLastSpeechDo = config.onLastSpeechDo
        this.onLastSpeechUndo = config.onLastSpeechUndo
    }

    start(level: FactoryScene) {
        this.currentIndex = 0
        if (this.onStartDo) {
            this.onStartDo(level)
        }
    }

    increaseIndex() {
        this.currentIndex++
    }

    decreaseIndex() {
        this.currentIndex--
    }

    isOnLastSpeech(): boolean {
        return this.currentIndex === this.speeches.length - 1
    }

    isOnFirstSpeech(): boolean {
        return this.currentIndex === 0
    }

    getSpeech(): string {
        return this.speeches[this.currentIndex].text[LANGUAGE_MANAGER.getCurrentLanguage()]
    }

    end(level: FactoryScene) {
        if (this.onEndDo) {
            this.onEndDo(level)
        }
    }

    onEventResume(event: EmittableEvent, next: string | -1, level: FactoryScene) {
        this.nextNodes.forEach(successor =>
            EVENT_EMITTER.unsubscribe(successor.on))

        if (this.onLastSpeechUndo) {
            this.onLastSpeechUndo(level)
        }
        this.dialog.continueWith(next)
    }

    cancelLastSpeech(level: FactoryScene) {
        this.nextNodes.forEach(successor =>
            EVENT_EMITTER.unsubscribe(successor.on))

        if (this.onLastSpeechUndo) {
            this.onLastSpeechUndo(level)
        }
    }

    startLastSpeech(level: FactoryScene) {
        this.nextNodes.forEach(successor =>
            EVENT_EMITTER.subscribe(
                successor.on,
                () => this.onEventResume(successor.on, successor.nextNodeId, level)))

        if (this.onLastSpeechDo) {
            this.onLastSpeechDo(level)
        }
    }

    orSkippabilaty(value: boolean) {
        this.skippable ||= value
    }
}