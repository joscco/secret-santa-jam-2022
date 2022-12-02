import {FactoryScene} from "../FactoryScene";
import {App} from "../../index";
import SceneManager from "../../General/SceneManager";
import {Dialog} from "../../GameObjects/Dialog/DialogConfig";
import {
    DIALOG_DAY_1,
    DIALOG_DAY_2,
    DIALOG_DAY_3,
    DOUBLE_MACHINES_HINT,
    HINT_DAY_1,
    HINT_DAY_2,
    LAST_WORDS_DAY_1,
    LAST_WORDS_DAY_2,
    LAST_WORDS_DAY_3
} from "../../GameObjects/Dialog/DialogData";

type LevelConfig = {
    level: number;
    conveyorBeltPattern: string;
    hasStepButton?: boolean,
    dialog?: Dialog,
    hints?: Dialog[],
    lastWords?: Dialog
}

type LevelConfigManifest = LevelConfig[]

export const LEVEL_MANIFEST: LevelConfigManifest = [
    {
        level: 1,
        conveyorBeltPattern:
            "A2|A1|A0\n" +
            "A3|  |B3\n" +
            "B0|B1|B2",
        dialog: new Dialog(DIALOG_DAY_1),
        hints: [new Dialog(HINT_DAY_1)],
        lastWords: new Dialog(LAST_WORDS_DAY_1)
    }, {
        level: 2,
        conveyorBeltPattern:
            "A2|A1|A0|B0\n" +
            "A3|  |  |B1\n" +
            "C3|  |  |B2\n" +
            "C2|C1|C0|B3",
        dialog: new Dialog(DIALOG_DAY_2),
        hints: [new Dialog(HINT_DAY_2)],
        lastWords: new Dialog(LAST_WORDS_DAY_2)
    }, {
        level: 3,
        conveyorBeltPattern:
            "A0|B3|C0|D3\n" +
            "A1|B2|C1|D2\n" +
            "A2|B1|C2|D1\n" +
            "A3|B0|C3|D0",
        dialog: new Dialog(DIALOG_DAY_3),
        hints: [new Dialog(DOUBLE_MACHINES_HINT)],
        lastWords: new Dialog(LAST_WORDS_DAY_3)
    }
]

export class LevelInitiator {
    static addLevels(sceneManager: SceneManager) {
        LEVEL_MANIFEST.forEach(config => {
            sceneManager.add("level_" + config.level,
                new FactoryScene(
                    {
                        app: App,
                        level: config.level,
                        conveyorBeltPattern: config.conveyorBeltPattern,
                        dialog: config.dialog,
                        hints: config.hints,
                        lastWords: config.lastWords
                    }
                ))
        })
    }
}
