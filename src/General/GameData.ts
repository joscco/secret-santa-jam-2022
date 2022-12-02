import {Language} from "./LanguageManager";
import {LEVEL_SCREEN} from "../index";

export type GameState = {
    unlockedLevel: number,
    preferredLanguage: Language
}

const INITIAL_GAMESTATE: GameState = {
    unlockedLevel: 1,
    preferredLanguage: "en"
}

export class GameData {
    private GAME_STATE_KEY: string = "berndsBakeryGame"
    private currentState: GameState

    constructor() {
        this.currentState = this.loadGame()
    }

    private unite(newState: GameState, oldState: GameState): GameState {
        return {
            preferredLanguage: newState.preferredLanguage,
            unlockedLevel: Math.max(newState.unlockedLevel, oldState.unlockedLevel),
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

    private saveGame(newState: GameState): void {
        let finalState = this.unite(newState, this.loadGame())
        try {
            localStorage.setItem(this.GAME_STATE_KEY, JSON.stringify(finalState))
        } catch (err) {
            console.error("You must allow localStorage access in order for Bernd to remember your levels!", err)
        }

        this.currentState = finalState
    }

    getUnlockedLevels(): number {
        return this.currentState.unlockedLevel;
    }

    getPreferredLanguage() {
        return this.currentState.preferredLanguage;
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