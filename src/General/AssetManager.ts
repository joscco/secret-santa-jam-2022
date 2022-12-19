import {Texture} from "@pixi/core";
import {Assets} from "@pixi/assets";
import {App, SCENE_MANAGER} from "../index";
import {LoadingScene} from "../Scenes/LoadingScene";
import {Spritesheet} from "pixi.js";

export class AssetManager {
    NUMBER_SPRITE_SHEETS = 1
    private MAIN_FONT?: FontFace
    LOADING_SCENE_ASSETS?: LoadingSceneAssets
    private ASSETS?: Spritesheet[]

    loadingScene?: LoadingScene

    constructor() {
        this.addAssets()
    }

    getTextureAsset(id: TextureAssetID): Texture {
        let textureID = TEXTURE_MANIFEST[id]
        let sheet = this.ASSETS?.find(sheet => sheet.textures && sheet.textures[textureID])!
        if (!sheet) {
            return Texture.EMPTY
        }
        return sheet.textures[textureID]
    }

    getTextureAssets(...ids: TextureAssetID[]): Texture[] {
        return ids.map(id => this.getTextureAsset(id))
    }

    private addAssets() {
        Assets.add("font", "assets/fonts/FuturaHandwritten.ttf")
    }

    async startLoadingScreen() {
        this.MAIN_FONT = await Assets.load("font") as FontFace
        this.loadingScene = new LoadingScene(App)
        SCENE_MANAGER.add("loadingScene", this.loadingScene)
    }

    async startLoadingOtherAssets() {
        Assets.loader.reset()
        this.ASSETS = []
        for (let i = 0; i < this.NUMBER_SPRITE_SHEETS; i++) {
            let sheet = await Assets.load(`assets/spritesheets/sheet-${i}.json`)
            this.loadingScene!.setProgress((i + 1) / this.NUMBER_SPRITE_SHEETS)
            this.ASSETS.push(sheet)
        }
    }
}

const TEXTURE_MANIFEST = {
    // hedgeHog
    hedgehog_idle: "gameScreen/hedgehog/hedgehog_idle",
    hedgehog_between: "gameScreen/hedgehog/hedgehog_between",
    hedgehog_roll_0: "gameScreen/hedgehog/hedgehog_roll_0",
    hedgehog_roll_1: "gameScreen/hedgehog/hedgehog_roll_1",
    hedgehog_roll_2: "gameScreen/hedgehog/hedgehog_roll_2",

    // floor fillers
    filler_0: "gameScreen/fillers/filler_0",
    filler_1: "gameScreen/fillers/filler_1",
    filler_2: "gameScreen/fillers/filler_2",
    filler_3: "gameScreen/fillers/filler_3",

    // fruits
    ruebe: "gameScreen/fruits/rübe",
    apple: "gameScreen/fruits/apple",
    banana: "gameScreen/fruits/banana",
    pear: "gameScreen/fruits/pear",

    // enemies
    ant: "gameScreen/enemies/ant",
    bug: "gameScreen/enemies/bug",
    bombBug: "gameScreen/enemies/bombBug",

    // rocks
    rock0: "gameScreen/rocks/rock_0",
    rock1: "gameScreen/rocks/rock_1",
    rock2: "gameScreen/rocks/rock_2",
    rock3: "gameScreen/rocks/rock_3",
    rock4: "gameScreen/rocks/rock_4",
    rock5: "gameScreen/rocks/rock_5",
    rock6: "gameScreen/rocks/rock_6",
    rock7: "gameScreen/rocks/rock_7",
    rock8: "gameScreen/rocks/rock_8",
    rock9: "gameScreen/rocks/rock_9",
    rock10: "gameScreen/rocks/rock_10",
    rock11: "gameScreen/rocks/rock_11",
    rock12: "gameScreen/rocks/rock_12",
    rock13: "gameScreen/rocks/rock_13",

    // misc
    antMountain: "gameScreen/antMountain",
    bumper: "gameScreen/bumper",
    hole: "gameScreen/hole",
    arrow: "gameScreen/arrow"
} as const

export type TextureAssetID = keyof typeof TEXTURE_MANIFEST

export interface LoadingSceneAssets {
    closedOven: Texture,
    openOven: Texture,
    innerLoadingBar: Texture,
    outerLoadingBar: Texture,
    redder: Texture,
    steam: Texture
}