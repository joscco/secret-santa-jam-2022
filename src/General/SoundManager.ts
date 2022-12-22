import {Howl} from "howler";

export class SoundManager {
    private mainMusic: Howl
    private blubs: Howl[]
    private talkSounds: Howl[]
    private moveSounds: Howl[]
    private soundVolume: number = 1;
    private musicVolume: number = 1;

    constructor() {
        this.mainMusic = SoundManager.createHowl("music/main.wav", true)

        this.blubs = SoundManager.createHowls(["click/Blub1.ogg", "click/Blub2.ogg"])
        this.talkSounds = SoundManager.createHowls([
            "talk/talk-01.ogg",
            "talk/talk-02.ogg",
            "talk/talk-03.ogg",
            "talk/talk-04.ogg",
            "talk/talk-05.ogg",
            "talk/talk-06.ogg",
            "talk/talk-07.ogg",
            "talk/talk-08.ogg",
            "talk/talk-09.ogg"
        ])
        this.moveSounds = SoundManager.createHowls([
            "move/move-01.ogg",
            "move/move-02.ogg",
            "move/move-03.ogg",
            "move/move-04.ogg"])
    }

    static createHowls(sources: string[]): Howl[] {
        return sources.map(source => {
            return SoundManager.createHowl(source, false)
        })
    }

    static createHowl(source: string, loop: boolean = false): Howl {
        return new Howl({
            src: "assets/sounds/" + source,
            loop: loop
        })
    }

    playMusic() {
        if(!this.mainMusic.playing()) {
            this.mainMusic.play()
        }
    }

    stopMusic() {
        this.mainMusic.stop()
    }

    // TypeSound

    playBlub(): void {
        this.playAnyOf(this.blubs)
    }

    playTalkSound(): void {
        this.playAnyOf(this.talkSounds)
    }

    playMoveSound(): void {
        this.playAnyOf(this.moveSounds)
    }

    private playAnyOf(howlArr: Howl[]) {
        if (this.soundVolume > 0) {
            let howl = howlArr[Math.floor(Math.random() * howlArr.length)]
            howl.volume(this.soundVolume)
            howl.play()
        }
    }

    setSoundVolume(newValue: number) {
        this.soundVolume = newValue
    }

    setMusicVolume(newValue: number) {
        let oldValue = this.musicVolume
        this.musicVolume = newValue

        this.mainMusic.fade(this.mainMusic.volume(), this.musicVolume, 200)

        if (oldValue === 0 && newValue > 0) {
            this.playMusic()
        } else if (oldValue > 0 && newValue === 0) {
            this.stopMusic()
        }
    }
}