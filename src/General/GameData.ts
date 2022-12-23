import {Language} from "./LanguageManager";
import {LEVEL_SCREEN} from "../index";

export type GameState = {
    unlockedLevel: number,
    preferredLanguage: Language,
    starsPerLevel: number[]
}

const INITIAL_GAMESTATE: GameState = {
    unlockedLevel: 1,
    preferredLanguage: "en",
    starsPerLevel: [0, 0, 0, 0]
}

export class GameData {
    private GAME_STATE_KEY: string = "hedgeHurl"
    private currentState: GameState

    constructor() {
        this.currentState = this.loadGame()
    }

    private unite(newState: GameState, oldState: GameState): GameState {
        return {
            preferredLanguage: newState.preferredLanguage,
            unlockedLevel: Math.max(newState.unlockedLevel, oldState.unlockedLevel),
            starsPerLevel: [0, 0, 0, 0].map((val, index) => Math.max(val, newState.starsPerLevel[index] ?? 0, oldState.starsPerLevel[index] ?? 0))
        }
    }

    saveUnlockedLevel(unlockedLevel: number): void {
        this.currentState.unlockedLevel = unlockedLevel
        this.saveGame(this.currentState)

        // Update Game
        LEVEL_SCREEN.updateLevelButtons()
    }

    savePreferredLanguage(newLanguage: Language) {
        this.currentState.preferredLanguage = newLanguage
        this.saveGame(this.currentState)
    }

    saveStars(level: number, stars: number[], points: number) {
        this.currentState.starsPerLevel[level - 1] = Math.max(...stars.map((point, index) => points >= point ? index + 1 : 0))
        this.saveGame(this.currentState)

        // Update Game
        LEVEL_SCREEN.updateStars()
    }

    private saveGame(newState: GameState): void {
        let finalState = this.unite(newState, this.loadGame())
        try {
            localStorage.setItem(this.GAME_STATE_KEY, JSON.stringify(finalState))
        } catch (err) {
            console.error("You must allow localStorage access in order for HedgeHurl to remember your levels!", err)
        }

        this.currentState = finalState
    }

    getUnlockedLevels(): number {
        return this.currentState.unlockedLevel;
    }

    getPreferredLanguage() {
        return this.currentState.preferredLanguage;
    }

    getStars() {
        return this.currentState.starsPerLevel
    }

    private loadGame(): GameState {
        try {
            // If we do not have localStorage access, this will fail
            let lastGameStateRaw = localStorage.getItem(this.GAME_STATE_KEY)
            if (!lastGameStateRaw) {
                // No stored game state found, return to initial one
                return INITIAL_GAMESTATE
            }

            let parsedGameState = JSON.parse(lastGameStateRaw)
            if (parsedGameState && this.isGameState(parsedGameState)) {
                // Game State found and parsed
                return parsedGameState as GameState
            }
        } catch (err) {
            console.error("You must allow localStorage access in order for Bernd to remember your levels!", err)
        }

        // Game State was found but could not be parsed
        return INITIAL_GAMESTATE
    }

    private isGameState(state: any): state is GameState {
        return (state as GameState).unlockedLevel !== undefined
            && (state as GameState).preferredLanguage !== undefined;
    }
}