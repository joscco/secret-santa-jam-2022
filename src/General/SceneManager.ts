import * as PIXI from 'pixi.js';
import {Container, Graphics} from 'pixi.js';
import IScene from "../Scenes/Basics/IScene";
import {CustomApp, GAME_HEIGHT, GAME_WIDTH} from "../index";
import Tweener from "./Tweener";
import {Easing} from "@tweenjs/tween.js";

/**
 * Manages numerous Scenes and makes sure they function as they should.
 * @param {PIXI.Application} app The pixi application the scenes will be bound to.
 */
export default class SceneManager extends Container{

    private app: CustomApp;
    private scenes: {[name: string]: IScene};
    private current: string|null;
    private overlay: Graphics

    constructor(app: CustomApp) {
        super()
        this.app = app;

        this.scenes = {};
        this.current = null;
        app.ticker.add(this.update.bind(this));
        this.overlay = this.initOverlay();

        this.app.stage.addChild(this)
    }

    private initOverlay(): Graphics {
        this.zIndex = 100
        this.alpha = 0

        let overlay = new Graphics()
        overlay.beginFill(0x000000)
        overlay.drawRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
        overlay.endFill()

        this.addChild(overlay)
        return overlay
    }

    /**
     * Adds the scene instance to function under this manager.
     * * If the name is already taken, it won't be added.
     * @param {string} name The name you give to this scene instance.
     * @param {Scene} scene Instance of the scene you want to add.
     */
    public add(name: string, scene: IScene): void {
        // TODO: Remove from previous manager if set
        if (!name || this.contains(name)) {
            return;
        }
        this.scenes[name] = scene;
        scene.app = this.app;
        scene.scenes = this;
    }

    /**
     * Removed a scene from this manager.
     * * If this scene is currently active, it will be stopped first.
     * @param {string} name Name given to this scene instance.
     */
    public remove(name: string): boolean {
        if (!name || !this.contains(name)) {
            return false;
        }
        if (this.current === name) {
            this.stop();
        }
        const scene = this.scenes[name];
        scene.app = null;
        scene.scenes = null;
        if (scene.hasRun) {
            scene.destroy();
            scene.hasRun = false;
        }
        delete this.scenes[name];
        return true;
    }

    private update(delta: number): void {
        let active: IScene|null = this.active;
        if (active) {
            active.update(delta / PIXI.settings.TARGET_FPMS!);
        }
    }

    /**
     * Checks there is a scene with this name in this manager.
     * @param {string} name
     * @returns {boolean}
     */
    public contains(name: string): boolean {
        return name in this.scenes;
    }

    /**
     * Starts a scene and set's it to be the active scene of this manager.
     * * Stops the previous active scene first if defined.
     * @param {string} name
     */
    public async start(name: string): Promise<void> {
        if (!this.contains(name) || name === this.current) {
            return;
        }

        this.stop();

        // Start new
        this.current = name;
        const active = this.active;
        if (active) {
            if (!active.hasRun) {
                active.init();
                active.hasRun = true;
            }
            this.app.stage.addChild(active);
            await active.start();
        }
    }

    public async startWithTransition(name: string): Promise<void> {
        if (!this.contains(name) || name === this.current) {
            return;
        }

        await this.beforeFadeOut()
        await Tweener.of(this)
            .to({alpha: 1}, 800)
            .easing(Easing.Quadratic.InOut)
            .start()
            .promise()
        this.stop();

        // Start new
        this.current = name;
        const active = this.active;
        if (active) {
            if (!active.hasRun) {
                active.init();
                active.hasRun = true;
            }
            this.app.stage.addChild(active);
            active.start();
        }

        await this.beforeFadeIn()
        await Tweener.of(this)
            .to({alpha: 0}, 800)
            .easing(Easing.Quadratic.InOut)
            .start()
            .promise()
        await this.afterFadeIn()
    }

    /**
     * Stops the scene and unsets it as the active scene in this manager.
     */
    async stop(): Promise<void> {
        let active: IScene|null = this.active;
        if (active) {
            this.current = null;
            active.stop();
            this.app.stage.removeChild(active);
        }
    }

    private async beforeFadeOut() {
        let active: IScene|null = this.active;
        if (active) {
            await active.beforeFadeOut();
        }
    }

    private async afterFadeOut() {
        let active: IScene|null = this.active;
        if (active) {
            await active.afterFadeOut()
        }
    }

    private async beforeFadeIn() {
        let active: IScene|null = this.active;
        if (active) {
            await active.beforeFadeIn();
        }
    }

    private async afterFadeIn() {
        let active: IScene|null = this.active;
        if (active) {
            await active.afterFadeIn()
        }
    }

    /**
     * Getting the active scene in this manager.
     * @returns {Scene|null}
     */
    public get active(): IScene|null {
        return this.current ? this.scenes[this.current] : null;
    }

    /**
     * Getting the name of the active scene in this manager.
     * @returns {Scene|null}
     */
    public get activeName(): string|null {
        return this.current;
    }

    /**
     * Getting the names of all the scenes in this manager.
     * @returns {string[]}
     */
    public get sceneNames(): string[] {
        return Object.keys(this.scenes);
    }

}