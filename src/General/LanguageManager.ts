import {GAME_DATA} from "../index";

export type Language = "en" | "de"

export interface LanguageDependantItem {
    setLanguage(newLanguage: Language): void
}

export class LanguageManager {

    private languageDependantItems: Set<LanguageDependantItem> = new Set<LanguageDependantItem>()

    addLanguageItem(item: LanguageDependantItem) {
        this.languageDependantItems.add(item)
        item.setLanguage(GAME_DATA.getPreferredLanguage())
    }

    removeLanguageItem(item: LanguageDependantItem) {
        this.languageDependantItems.delete(item)
    }

    getCurrentLanguage(): Language {
        return GAME_DATA.getPreferredLanguage()
    }

    swapLanguage() {
        let currentLanguage = GAME_DATA.getPreferredLanguage()
        if (currentLanguage === "en") {
            this.setLanguage("de")
        } else {
            this.setLanguage("en")
        }
    }

    private setLanguage(newLanguage: Language) {
        GAME_DATA.savePreferredLanguage(newLanguage)
        this.languageDependantItems.forEach(item => item.setLanguage(newLanguage))
    }
}