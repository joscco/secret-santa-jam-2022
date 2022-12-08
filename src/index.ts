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

export const GAME_WIDTH: number = 1920;
export const GAME_HEIGHT: number = 1080;

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
    stage: Container, ticker: Ticker, renderer: AbstractRenderer, registerChange(): void
}

const main = async () => {
    let renderer = Renderer.create({
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        resolution: window.devicePixelRatio || 1,
        antialias: false,
        backgroundColor: 0x06a94d
    })

    // Display application properly
    document.body.appendChild(renderer.view);
    document.body.style.margin = '0';
    renderer.view.style!.width = GAME_WIDTH / 2 + "px"
    renderer.view.style!.height = GAME_HEIGHT / 2 + "px"

    let stage = new Container()
    stage.sortableChildren = false
    // Init Main App

    let dirty: boolean = true
    var ticker = new Ticker();
    ticker.add(() => {
        Tweener.update()
            dirty = false
            renderer.render(stage);
    });

    App = {stage: stage, ticker: ticker, renderer: renderer, registerChange: () => dirty = true}

    // Add all loading bundles
    // Synchronize tickers by using the gsap one
    Ticker.system.stop()
    Ticker.shared.stop()
    ticker.start()

    ASSET_MANAGER = new AssetManager()
    SCENE_MANAGER = new SceneManager(App);
    LANGUAGE_MANAGER = new LanguageManager()
    App.stage.addChild(SCENE_MANAGER)

    // Load assets
    await ASSET_MANAGER.startLoadingScreen()
    await SCENE_MANAGER.startWithTransition("loadingScene")
    await ASSET_MANAGER.startLoadingOtherAssets()

    SOUND_MANAGER = new SoundManager()
    GAME_DATA = new GameData()
    EVENT_EMITTER = new EventEmitter()

    // DIALOG_MANAGER = new DialogManager()
    // DIALOG_MANAGER.zIndex = 110
    // App.stage.addChild(DIALOG_MANAGER)

    // MUSIC_BUTTON = new MusicButton()
    // MUSIC_BUTTON.position.set(170, 125)
    // MUSIC_BUTTON.zIndex = 110
    // App.stage.addChild(MUSIC_BUTTON);
    //
    // SOUND_BUTTON = new SoundButton()
    // SOUND_BUTTON.position.set(310, 125)
    // SOUND_BUTTON.zIndex = 110
    // App.stage.addChild(SOUND_BUTTON);

    // Finally adding Scenes:
    SCENE_MANAGER.add("startScene", new StartScene(App))
    // LEVEL_SCREEN = new LevelChooserScene(App)
    // SCENE_MANAGER.add("levelChooserScene", LEVEL_SCREEN)
    //
    // LevelInitiator.addLevels(SCENE_MANAGER)

    SCENE_MANAGER.startWithTransition("startScene")
};

main();
