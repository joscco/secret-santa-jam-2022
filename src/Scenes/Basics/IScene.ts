import * as PIXI from 'pixi.js';
import SceneManager from "../../General/SceneManager";
import {CustomApp} from "../../index";

export default interface IScene extends PIXI.Container {
    app: CustomApp|null;
    scenes: SceneManager|null;
    hasRun: boolean;
    init(): void;
    destroy(): void;
    start(): void;
    stop(): void;
    beforeFadeIn(): void;
    afterFadeIn(): void;
    beforeFadeOut(): void;
    afterFadeOut(): void;
    update(delta: number): void;
}