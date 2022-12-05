export class KeyHandler {
    codes: number[]
    isDown: boolean
    isUp: boolean

    constructor(keyCodes: number[]) {
        this.codes = keyCodes;
        this.isDown = false;
        this.isUp = true

        window.addEventListener("keydown", this.downHandler.bind(this), false);
        window.addEventListener("keyup", this.upHandler.bind(this), false);
    }

    downHandler(event: any) {
        if (this.codes.indexOf(event.keyCode) > -1) {
            if (this.isUp) {
                this.press();
            }
            this.isDown = true;
            this.isUp = false;
        }
        event.preventDefault();
    }

    upHandler(event: any) {
        if (this.codes.indexOf(event.keyCode) > -1) {
            if (this.isDown) {
                this.release();
            }
            this.isDown = false;
            this.isUp = true;
        }
        event.preventDefault();
    };

    press() {

    }

    release() {

    }
}