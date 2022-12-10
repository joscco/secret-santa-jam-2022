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
    hedgehog_eyes_open: "gameScreen/hedgehog/eyes/hedgeHogEyesOpen",
    hedgehog_eyes_closed: "gameScreen/hedgehog/eyes/hedgeHogEyesClosed",

    // floor fillers
    full_filler_0: "gameScreen/fillers/full_filler_0",
    full_filler_1: "gameScreen/fillers/full_filler_1",
    full_filler_2: "gameScreen/fillers/full_filler_2",
    full_filler_3: "gameScreen/fillers/full_filler_3",
    full_filler_4: "gameScreen/fillers/full_filler_4",
    full_filler_5: "gameScreen/fillers/full_filler_5",
    full_filler_6: "gameScreen/fillers/full_filler_6",
    full_filler_7: "gameScreen/fillers/full_filler_7",
    line_filler_0: "gameScreen/fillers/line_filler_0",
    line_filler_1: "gameScreen/fillers/line_filler_1",
    line_filler_2: "gameScreen/fillers/line_filler_2",
    line_filler_3: "gameScreen/fillers/line_filler_3",
    line_filler_4: "gameScreen/fillers/line_filler_4",
    line_filler_5: "gameScreen/fillers/line_filler_5",
    line_filler_6: "gameScreen/fillers/line_filler_6",

    // floor decoration
    floor_decor_0: "gameScreen/floor_decoration/floor_decor_0",
    floor_decor_1: "gameScreen/floor_decoration/floor_decor_1",
    floor_decor_2: "gameScreen/floor_decoration/floor_decor_2",
    floor_decor_3: "gameScreen/floor_decoration/floor_decor_3",
    floor_decor_4: "gameScreen/floor_decoration/floor_decor_4",
    floor_decor_5: "gameScreen/floor_decoration/floor_decor_5",
    floor_decor_6: "gameScreen/floor_decoration/floor_decor_6",
    floor_decor_7: "gameScreen/floor_decoration/floor_decor_7",
    floor_decor_8: "gameScreen/floor_decoration/floor_decor_8",
    floor_decor_9: "gameScreen/floor_decoration/floor_decor_9",
    floor_decor_10: "gameScreen/floor_decoration/floor_decor_10",
    floor_decor_11: "gameScreen/floor_decoration/floor_decor_11",
    floor_decor_12: "gameScreen/floor_decoration/floor_decor_12",
    floor_decor_13: "gameScreen/floor_decoration/floor_decor_13",
    floor_decor_14: "gameScreen/floor_decoration/floor_decor_14",
    floor_decor_15: "gameScreen/floor_decoration/floor_decor_15",
    floor_decor_16: "gameScreen/floor_decoration/floor_decor_16",
    floor_decor_17: "gameScreen/floor_decoration/floor_decor_17",
    floor_decor_18: "gameScreen/floor_decoration/floor_decor_18",
    floor_decor_19: "gameScreen/floor_decoration/floor_decor_19",
    floor_decor_20: "gameScreen/floor_decoration/floor_decor_20",

    // items
    ruebe: "gameScreen/items/rübe",

    // enemies
    ant: "gameScreen/enemies/ant",

    // pollers
    poller0: "gameScreen/poller/poller0",
    poller1: "gameScreen/poller/poller1",
    poller2: "gameScreen/poller/poller2",
    poller3: "gameScreen/poller/poller3",
    poller4: "gameScreen/poller/poller4",

    // misc
    arrow: "gameScreen/player/arrow"
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