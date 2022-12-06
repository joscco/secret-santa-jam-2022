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
    // player
    field: "gameScreen/playerField",
    playerBody: "gameScreen/player/playerBody",
    playerLeg: "gameScreen/player/playerLeg",
    playerGun: "gameScreen/player/playerGun",
    gunRope: "gameScreen/player/playerRope",
    gunHook: "gameScreen/player/playerHook"
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