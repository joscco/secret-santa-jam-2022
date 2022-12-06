import {Container, Sprite} from "pixi.js";
import {Player} from "./Player";
import {HookGun} from "./HookGun";
import {Hook} from "./Hook";
import {ASSET_MANAGER, GAME_HEIGHT, GAME_WIDTH} from "../../index";
import {InputManager} from "../../General/InputManager";
import {sleep, Vector2D} from "../../General/Helpers";
import {HookGunRope} from "./HookGunRope";

export class GameField extends Container {

    field: Sprite
    player: Player
    gun: HookGun
    rope: HookGunRope
    hook: Hook

    inputManager: InputManager

    drawingToHook: boolean = false
    inHookShooting: boolean = false

    constructor() {
        super()
        this.field = new Sprite(ASSET_MANAGER.getTextureAsset("field"))
        this.field.anchor.set(0.5)
        this.field.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 2)

        this.player = new Player()
        this.rope = new HookGunRope()
        this.gun = new HookGun()
        this.hook = new Hook()

        this.inputManager = new InputManager()
        this.inputManager.initMouseControls(this.field, (pos) => this.onPointerTap(pos))

        this.addChild(this.field, this.player, this.rope, this.gun, this.hook)
    }

    update(delta: number) {
        this.inputManager.update()
        let mousePosition = this.inputManager.getMousePosition()
        let runningDirection = this.inputManager.getRunningDirection()

        if(!this.drawingToHook) {
            this.player.runTowards(delta, runningDirection)
            this.rotateGun(mousePosition, delta);
        }

        this.gun.position = this.player.position

        if (!this.inHookShooting) {
            this.hook.scale.x = this.gun.gunSprite.scale.x
            this.hook.rotation = this.gun.gunSprite.rotation
            this.hook.position = this.gun.gunSprite.toGlobal({x: 100, y: 20})
        }
    }

    private rotateGun(mousePosition: Vector2D, delta: number) {
        this.gun.rotateTowards(mousePosition, delta)
    }

    updateRope() {
        this.rope.update(this.hook.position, this.gun.gunSprite.toGlobal({x: 100, y: 20}))
    }

    private async onPointerTap(mousePosition: Vector2D) {
        if (!this.drawingToHook && !this.inHookShooting) {
            this.inHookShooting = true
            await this.hook.hookTo(mousePosition, () => this.updateRope())
            this.drawingToHook = true
            this.player.hookTo(this.hook, () => this.updateRope())
            await sleep(200)
            this.drawingToHook = false
            this.rope.clear()

            // Wait a small time so that the hook can rotate back
            this.inHookShooting = false
        }
    }
}