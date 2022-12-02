import {Container, Sprite, Texture} from "pixi.js";


export abstract class Button extends Container {
    private clicked: boolean = false;
    sprite: Sprite

    constructor() {
        super();

        this.sprite = new Sprite(this.getTexture() ?? undefined)
        // Since we might want scaling, setting the anchor in the middle is better
        this.sprite.anchor.set(0.5)
        this.addChild(this.sprite)

        this.interactive = true;
        this.cursor = "pointer";
        this.on("pointertap", () => this.onPointerTap())
    }

    // Needed in case the texture depends on values set in child constructors
    updateTexture() {
        if (this.getTexture()) {
            this.sprite.texture = this.getTexture()!
        }

    }

    async onPointerTap() {
        if (!this.clicked) {
            this.clicked = true;
            await this.preClick();
            await this.onClick();
            this.clicked = false;
        }
    }

    preClick(): void {
        // do nothing per default
    }

    abstract onClick(): void

    abstract getTexture(): Texture | null
}

