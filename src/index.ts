import SceneManager from './General/SceneManager';
import {AbstractRenderer, Container, Renderer, Ticker} from "pixi.js"
import {AssetManager} from "./General/AssetManager";
import {LevelChooserScene} from "./Scenes/LevelChooserScene";
import {TooltipManager} from "./GameObjects/Tooltip/TooltipManager";
import {GameData} from "./General/GameData";
import {SoundManager} from "./General/SoundManager";
import {MusicButton} from "./UI/Buttons/MusicButton";
import {SoundButton} from "./UI/Buttons/SoundButton";
import {EventEmitter} from "./General/EventEmitter";
import {DialogManager} from "./GameObjects/Dialog/DialogManager";
import {LanguageManager} from "./General/LanguageManager";
import Tweener from "./General/Tweener";
import {StartScene} from "./Scenes/StartScene";

// Type Change Imports
import "./General/TypeChanges/Array"
import "./General/TypeChanges/Graphics"
import { Level} from "./Scenes/Level";
import {LoadingScene} from "./Scenes/LoadingScene";
import {CONFIG_LEVEL_1, CONFIG_LEVEL_2, CONFIG_LEVEL_3, CONFIG_LEVEL_4} from "./Scenes/LevelConfigs";

export const GAME_WIDTH: number = 1920;
export const GAME_HEIGHT: number = 1080;
export const NUMBER_LEVELS: number = 4

export var App: CustomApp;
export var GAME_DATA: GameData;

export var SCENE_MANAGER: SceneManager;
export var ASSET_MANAGER: AssetManager;
export var SOUND_MANAGER: SoundManager;
export var LANGUAGE_MANAGER: LanguageManager
export var LEVEL_SCREEN: LevelChooserScene;
export var TOOLTIP_MANAGER: TooltipManager;
export var DIALOG_MANAGER: DialogManager;

export var EVENT_EMITTER: EventEmitter;

export var SOUND_BUTTON: SoundButton
export var MUSIC_BUTTON: MusicButton

export const TWEEN = require('@tweenjs/tween.js')

export type CustomApp = {
    stage: Container, ticker: Ticker, renderer: AbstractRenderer
}

const main = async () => {
    App = initApp();

    ASSET_MANAGER = new AssetManager()
    SCENE_MANAGER = new SceneManager(App);
    LANGUAGE_MANAGER = new LanguageManager()

    // Load assets
    const loadingScene = new LoadingScene(App)
    SCENE_MANAGER.add("loadingScene", loadingScene)
    await SCENE_MANAGER.startWithTransition("loadingScene")
    await loadingScene.loadAssets()

    SOUND_MANAGER = new SoundManager()
    GAME_DATA = new GameData()
    EVENT_EMITTER = new EventEmitter()

    MUSIC_BUTTON = new MusicButton()
    MUSIC_BUTTON.position.set(GAME_WIDTH - 170, 80)
    MUSIC_BUTTON.zIndex = 110
    //App.stage.addChild(MUSIC_BUTTON);

    SOUND_BUTTON = new SoundButton()
    SOUND_BUTTON.position.set(GAME_WIDTH - 310, 80)
    SOUND_BUTTON.zIndex = 110
    //App.stage.addChild(SOUND_BUTTON);

    // Finally adding Scenes:
    SCENE_MANAGER.add("startScene", new StartScene(App))
    LEVEL_SCREEN = new LevelChooserScene(App)
    SCENE_MANAGER.add("levelChooserScene", LEVEL_SCREEN)
    SCENE_MANAGER.add("level_1", new Level(CONFIG_LEVEL_1))
    SCENE_MANAGER.add("level_2", new Level(CONFIG_LEVEL_2))
    SCENE_MANAGER.add("level_3", new Level(CONFIG_LEVEL_3))
    SCENE_MANAGER.add("level_4", new Level(CONFIG_LEVEL_4))
};

function initApp() {
    const renderer = Renderer.create({
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        resolution: window.devicePixelRatio || 1,
        antialias: false,
    })

    // Display application properly
    document.body.appendChild(renderer.view);
    document.body.style.margin = '0';
    renderer.view.style!.width = "100%"
    renderer.view.style!.height = "100%"

    const stage = new Container()
    stage.sortableChildren = true

    // Init Ticker
    const ticker = new Ticker();
    ticker.maxFPS = 30
    ticker.add(() => {
        Tweener.update()
        renderer.render(stage);
    });

    // Limit all tickers to a single one
    Ticker.system.stop()
    Ticker.shared.stop()
    ticker.start()

    return {stage: stage, ticker: ticker, renderer: renderer}
}

main();
