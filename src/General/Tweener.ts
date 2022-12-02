import {App, TWEEN} from "../index";
import {Tween} from "@tweenjs/tween.js";

class Tweener {
    timeInMS: number = Date.now()

    update(elapsedMS: number) {
        //this.timeInMS += elapsedMS
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