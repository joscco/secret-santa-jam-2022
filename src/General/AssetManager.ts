import {Texture} from "@pixi/core";
import {Assets} from "@pixi/assets";
import {LoadingScene} from "../Scenes/LoadingScene";
import {Spritesheet} from "pixi.js";

export class AssetManager {
    NUMBER_SPRITE_SHEETS = 1
    private MAIN_FONT?: FontFace
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

    async loadLoadingScreenAssets() {
        this.MAIN_FONT = await Assets.load("font") as FontFace
    }

    async loadMainAssets(loadingScene: LoadingScene) {
        Assets.loader.reset()
        this.ASSETS = []
        for (let i = 0; i < this.NUMBER_SPRITE_SHEETS; i++) {
            let sheet = await Assets.load(`assets/spritesheets/sheet-${i}.json`, (i) => loadingScene.setProgress(i))
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

    // ui
    innerFruitBar: "gameScreen/ui/energyBarInner",
    outerFruitBar: "gameScreen/ui/energyBarOuter",
    emptyStar: "gameScreen/ui/star_empty",
    fullStar: "gameScreen/ui/star_full",

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
    rock14: "gameScreen/rocks/rock_14",
    rock15: "gameScreen/rocks/rock_15",
    rock16: "gameScreen/rocks/rock_16",
    rock17: "gameScreen/rocks/rock_17",
    rock18: "gameScreen/rocks/rock_18",
    rock19: "gameScreen/rocks/rock_19",
    rock20: "gameScreen/rocks/rock_20",
    rock21: "gameScreen/rocks/rock_21",
    rock22: "gameScreen/rocks/rock_22",
    rock23: "gameScreen/rocks/rock_23",
    rock24: "gameScreen/rocks/rock_24",
    rock25: "gameScreen/rocks/rock_25",
    rock26: "gameScreen/rocks/rock_26",
    rock27: "gameScreen/rocks/rock_27",
    rock28: "gameScreen/rocks/rock_28",
    rock29: "gameScreen/rocks/rock_29",
    rock30: "gameScreen/rocks/rock_30",
    rock31: "gameScreen/rocks/rock_31",
    rock32: "gameScreen/rocks/rock_32",
    rock33: "gameScreen/rocks/rock_33",
    rock34: "gameScreen/rocks/rock_34",
    rock35: "gameScreen/rocks/rock_35",

    // misc
    antMountain: "gameScreen/antMountain",
    bumper: "gameScreen/bumper",
    hole: "gameScreen/hole",
    arrow: "gameScreen/arrow",

    // startScene
    startButton: "startScreen/startButton",
    titleLetter0: "startScreen/title_0",
    titleLetter1: "startScreen/title_1",
    titleLetter2: "startScreen/title_2",
    titleLetter3: "startScreen/title_3",
    titleLetter4: "startScreen/title_4",
    titleLetter5: "startScreen/title_5",
    titleLetter6: "startScreen/title_6",
    titleLetter7: "startScreen/title_7",
    titleLetter8: "startScreen/title_8",

    // Level Screen
    level1Bug: "levelScreen/level1Bug",
    level2Bug: "levelScreen/level2Bug",
    level3Bug: "levelScreen/level3Bug",
    level4Bug: "levelScreen/level4Bug"

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