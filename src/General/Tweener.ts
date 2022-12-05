import {App, TWEEN} from "../index";
import {Tween} from "@tweenjs/tween.js";

class Tweener {
    update() {
        TWEEN.update()
    }

    of(target: any): Tween<any> {
        return new Tween(target)
            .onUpdate(() => {
                App.registerChange()
            })
    }
}

export default new Tweener()

declare module "@tweenjs/tween.js" {
    interface Tween<T> {
        promise(): Promise<T>;
    }
}

Tween.prototype.promise = function() {
    return new Promise(resolve => this.onComplete(resolve))
}