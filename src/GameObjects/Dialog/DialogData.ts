import {DialogConfig, END} from "./DialogConfig";
import {sleep} from "../../General/Helpers";
import {DIALOG_MANAGER, MUSIC_BUTTON, SOUND_BUTTON} from "../../index";

export const DIALOG_DAY_1: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "Oh hello! I am Bernd and this is my small Christmas bakery.",
                        de: "Oh hey! Ich bin Bernd und das hier ist meine kleine Weihnachtsbäckerei."
                    }
                }, {
                    text: {
                        en: "It's nice that you responded to my advertisement, I really need your help urgently...",
                        de: "Toll, dass du auf meine Ausschreibung reagiert hast, ich brauche dringend deine Hilfe..."
                    }
                }, {
                    text: {
                        en: "Short and sweet: 24 different recipes have to be made before Christmas - it's family tradition.",
                        de: "Kurz und knapp: Wir müssen 24 Rezepte vor Weihnachten fertig stellen - Familientradition halt."
                    }
                }, {
                    text: {
                        en: "However, this year I've lost track of time a bit and am running late.",
                        de: "Aber dieses Jahr habe ich etwas die Zeit aus den Augen verloren und bin spät dran."
                    }
                }, {
                    text: {
                        en: "Damn Netflix and its constant supply of high quality and addictive series...",
                        de: "Verdammtes Netflix und sein konstanter Nachschub an hochqualitativen Serien..."
                    }
                }, {
                    text: {
                        en: "Well anyway... Your first recipe is Santa's Milk. Let's start, shall we?",
                        de: "Naja, wie auch immer ... Dein erstes Rezept ist Weihnachtsmilch. Sollen wir anfangen?"
                    }
                },
            ],
            nextNodes: [{on: "clicked_continuation_button", nextNodeId: "agreedToTakePart"}],
            continuationText: {en: "Yes!", de: "Ja!"}
        }, {
            id: "agreedToTakePart",
            speeches: [
                {
                    text: {
                        en: "Splendid! Look at all these conveyor belts. New ingredients are constantly being produced here.",
                        de: "Wunderbar! Sieh dir diese Laufbänder an. Hier werden fortlaufend neue Zutaten hergestellt."
                    }
                }, {
                    text: {
                        en: "Each ingredient has three properties: Taste, Consistency and Color.",
                        de: "Jede Zutat hat drei Eigenschaften: Geschmack, Konsistenz und Farbe."
                    }
                }, {
                    text: {
                        en: "Your task is to change these properties to create the required ingredients for our recipes.",
                        de: "Du musst diese Eigenschaften ändern, um die richtigen Zutaten für unsere Rezepte herzustellen."
                    }
                }, {
                    text: {
                        en: "Let me show you what I mean by that...",
                        de: "Lass mich dir demonstrieren, was ich damit meine..."
                    }
                }],
            nextNodes: [{on: "clicked_continuation_button", nextNodeId: "wantsADemonstration"}],
            continuationText: {en: "Yep.", de: "Jep."}
        }, {
            id: "wantsADemonstration",
            speeches: [
                {
                    text: {
                        en: "Machines come in all different types and shapes. Each one alters ingredients differently.",
                        de: "Maschinen gibt es in vielen Typen und Formen. Sie alle ändern Zutaten-Eigenschaften anders."
                    }
                }, {
                    text: {
                        en: "The gray block with the drop symbol is such a machine. It's a liquefier to be precise.",
                        de: "Der graue Block mit dem Tropfensymbol ist eine Maschine. Ein Verflüssiger um genau zu sein."
                    }
                }, {
                    text: {
                        en: "If you place this machine on a conveyor belt, it will turn all ingredients passing it into liquid.",
                        de: "Wenn du diese Maschine auf ein Laufband ziehst, verflüssigt sie alle Zutaten, die sie passieren."
                    }
                }, {
                    text: {
                        en: "Try it yourself by dragging the liquefying machine onto the honey belt.",
                        de: "Versuch's mal selbst, indem du den Verflüssiger auf das Laufband mit dem Honig ziehst."
                    }
                }],
            nextNodes: [{on: "moved_item_A_to_0_1", nextNodeId: "finished_first_drag"}]
        }, {
            id: "finished_first_drag",
            speeches: [
                {
                    text: {
                        en: "Yes, very good! Your machine turned the sticky honey into liquid vanilla milk.",
                        de: "Ja, sehr gut! Deine Maschine hat den klebrigen Honig in flüssige Vanillemilch verwandelt."
                    }
                }, {
                    text: {
                        en: "You see: You can use machines to alter the initial ingredients you're given.",
                        de: "Du kannst also Maschinen nutzen, um deine initialen Zutaten zu verändern."
                    }
                }, {
                    text: {
                        en: "Your task is to move machines around and find their perfect position.",
                        de: "An dir liegt es, die Maschinen zu verschieben und ihre perfekte Position zu finden."
                    }
                }, {
                    text: {
                        en: "Start and end fields of conveyor belts are blocked for this purpose.",
                        de: "Die Anfangs- und Endfelder von Laufbändern sind hierbei immer blockiert."
                    }
                }],
            continuationText: {en: "Okay.", de: "Okay"},
            nextNodes: [{on: "clicked_continuation_button", nextNodeId: "understoodDragging"}]
        }, {
            id: "understoodDragging",
            speeches: [
                {
                    text: {
                        en: "Great! You can see which ingredients you need on the recipe list to your left.",
                        de: "Super! Die benötigten Zutaten siehst du in der Zutatenliste zu deiner Linken."
                    }
                }, {
                    text: {
                        en: "Only if all these ingredients leave your conveyor belts simultaneously, a recipe is complete.",
                        de: "Nur wenn alle Zutaten deine Laufbänder gleichzeitig verlassen, ist ein Rezept vollständig."
                    }
                }, {
                    text: {
                        en: "I'm sure you can find out how to complete this recipe by yourself. Give it a try!",
                        de: "Sicher findest du heraus, wie das heutige Rezept vervollständigt werden kann. Versuch's mal!"
                    }
                }],
            continuationText: {en: "Ok.", de: "Ok."},
            nextNodes: [{on: "clicked_continuation_button", nextNodeId: "willTry"}]
        }, {
            onStartDo: (level) => {
                MUSIC_BUTTON.highlight();
                SOUND_BUTTON.highlight();
            },
            onEndDo: (level) => {
                MUSIC_BUTTON.unhighlight();
                SOUND_BUTTON.unhighlight()
            },
            id: "willTry",
            speeches: [
                {
                    text: {
                        en: "Oh... One thing before you start... I always like to listen to music while baking.",
                        de: "Oh... Eine Sache noch, bevor du anfängst... Ich höre beim Backen immer gern Musik."
                    }
                }, {
                    text: {
                        en: "If you prefer silence, you can adjust the music volume with the musical note slider in the top left.",
                        de: "Wenn du Stille bevorzugst, kannst du die Musik mit dem Musiknoten-Slider oben links anpassen."
                    }
                }, {
                    text: {
                        en: "The volume of sound effects can be adjusted via the speaker icon slider next to it.",
                        de: "Die Lautstärke der Soundeffekte regelt der Lautsprecher-Slider direkt daneben."
                    }
                }
            ],
            continuationText: {en: "Thanks", de: "Danke"},
            nextNodes: [{on: "clicked_continuation_button", nextNodeId: END}]
        }
    ]
}
export const HINT_DAY_1: DialogConfig = {
    nodes: [
        {
            id: "hint1",
            speeches: [
                {
                    text: {
                        en: "Try pulling the machine onto the cream conveyor belt.",
                        de: "Versuch, die Maschine auf das Laufband mit der Sahne zu schieben."
                    }
                }
            ],
            continuationText: {en: "Ok.", de: "Ok."},
            nextNodes: [{on: "clicked_continuation_button", nextNodeId: END}]
        }
    ]
}

export const LAST_WORDS_DAY_1: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "Perfect, the milk looks delicious and I'm sure it will taste great!",
                        de: "Perfekt, die Milch sieht köstlich aus und wird sicher toll schmecken!"
                    }
                }, {
                    text: {
                        en: "I mean, it's for Santa, so I'll never know... It's not for me... I'm just a baker.",
                        de: "Also, dem Weihnachtsmann... ich werde es nie erfahren... ich bin nur ein Bäcker."
                    }
                }
            ],
            nextNodes: [],
            canSkip: true,
            durationUntilAutoClose: 2000,
            onEndDo: async (level) => {
                DIALOG_MANAGER.removeLevel()
                await sleep(1000)
            }
        }
    ]
}

export const DIALOG_DAY_2: DialogConfig = {
    nodes: [{
        id: "start",
        speeches: [
            {
                text: {
                    en: "Hey, nice to have you back!",
                    de: "Hey, schön dich wieder hier zu haben!"
                }
            }, {
                text: {
                    en: "Today's task will be a little more difficult, I need you to make Flake Nests.",
                    de: "Deine heutige Aufgabe ist ein bisschen schwieriger, ich brauche Schokocrossies von dir."
                }
            }
        ],
        continuationText: {en: "Nice.", de: "Nett."},
        nextNodes: [{on: "clicked_continuation_button", nextNodeId: "node2"}]
    }, {
        id: "node2",
        speeches: [
            {
                text: {
                    en: "Basically it works the same as yesterday, but there is one new difficulty: Blocks",
                    de: "Im Grunde funktioniert alles wie gestern, nur mit einer neuen Schwierigkeit: Blöcken"
                }
            }, {
                text: {
                    en: "You can see such a block between the conveyor belts above. Blocks are basically walls.",
                    de: "Einen solchen Block kannst du oben zwischen den Laufbändern sehen. Blöcke sind quasi Wände."
                }
            }, {
                text: {
                    en: "You can't place any machines on them, nor can you pass them.",
                    de: "Du kannst auf ihnen keine Maschinen platzieren und sie auch nicht passieren."
                }
            }
        ],
        continuationText: {en: "Ok.", de: "Ok."},
        nextNodes: [{on: "clicked_continuation_button", nextNodeId: "node3"}]
    }, {
        id: "node3",
        speeches: [
            {
                text: {
                    en: "By the way: Whenever you discover a new ingredient, an entry is added to your recipe book.",
                    de: "Ah ja: Immer, wenn eine neue Zutat entdeckt wird, bekommt dein Rezeptbuch einen neuen Eintrag."
                }
            }, {
                text: {
                    en: "You can always open it if you get stuck. Let's see, a few should already be noted...",
                    de: "Du kannst es immer öffnen, wenn du nicht mehr weiter weißt. Lass uns doch mal reinschauen..."
                }
            },
            {text: {en: "Open the book at the bottom left, please.", de: "Öffne bitte das Buch unten links."}}
        ],
        nextNodes: [{on: "clicked_ingredient_cookbook", nextNodeId: "clicked_cookbook"}],
    }, {
        id: "clicked_cookbook",
        speeches: [
            {
                text: {
                    en: "Lots of space here to be filled with ingredient recipes!",
                    de: "Hier ist viel Platz für Zutateninfos!"
                }
            }, {
                text: {
                    en: "You can scroll up and down within the book by dragging the red bookmark.",
                    de: "Durch Ziehen des roten Lesezeichens kannst du hier auf- und abscrollen."
                }
            }, {
                text: {
                    en: "You can now close the book by clicking on the red X on its top left.",
                    de: "Du kannst das Buch jetzt wieder mit dem roten X oben links schließen."
                }
            }
        ],
        nextNodes: [{on: "closed_ingredient_cookbook", nextNodeId: "closed_cookbook"}]
    }, {
        id: "closed_cookbook",
        speeches: [
            {
                text: {
                    en: "You can always ask me for a hint by clicking on the Bernd icon at the bottom left.",
                    de: "Du kannst mich immer um einen Hinweis bitten, indem du auf den Bernd-Knopf unten links klickst."
                }
            }, {
                text: {
                    en: "It will appear once I stop talking. But don't expect too much, I'm a busy man.",
                    de: "Der Knopf erscheint, sobald ich nicht mehr rede. Aber erwarte nicht zu viel, ich bin vielbeschäftigt."
                }
            },
            {text: {en: "Alright, let's get started!", de: "Alles klar, dann legen wir mal los!"}},
        ],
        continuationText: {en: "Yep!", de: "Jep!"},
        nextNodes: [{on: "clicked_continuation_button", nextNodeId: END}]
    }
    ]
}
export const HINT_DAY_2: DialogConfig = {
    nodes: [
        {
            id: "hint1",
            speeches: [
                {
                    text: {
                        en: "Place one machine on each conveyor belt and everything should work.",
                        de: "Platziere eine Maschine pro Laufband und alles sollte klappen."
                    }
                }
            ],
            continuationText: {en: "Ok.", de: "Ok."},
            nextNodes: [{on: "clicked_continuation_button", nextNodeId: END}]
        }
    ]
}

export const LAST_WORDS_DAY_2: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "Ever thought about a career as a Christmas baker?",
                        de: "Schonmal über eine Karriere als Weihnachtsbäcker nachgedacht?"
                    }
                }, {
                    text: {
                        en: "I'm going to treat myself with another one of your Flake Nests.",
                        de: "Ich gönne mir noch ein paar weitere deiner Schokocrossies."
                    }
                }
            ],
            nextNodes: [],
            canSkip: true,
            durationUntilAutoClose: 2000,
            onEndDo: async (level) => {
                DIALOG_MANAGER.removeLevel()
                await sleep(1000)
            }
        }
    ]
}

export const DIALOG_DAY_3: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "Yaaaaawn... Sorry, I'm a bit tired today...",
                        de: "Gääääähn... Entschuldige, ich bin heute etwas müde..."
                    }
                }, {
                    text: {
                        en: "That might be because I was busy wrapping gifts all night... Anyway.",
                        de: "Vielleicht, weil ich die ganze Nacht Geschenke einpacken musste... Egal."
                    }
                }, {
                    text: {
                        en: "Glad you're back! Butter Cookies are on the menu today. Real classics!",
                        de: "Gut, dass du zurück bist! Mürbeteigkekse stehen heute auf der Karte. Echte Klassiker!"
                    }
                }
            ],
            continuationText: {en: "Ok.", de: "Ok."},
            nextNodes: [{on: "clicked_continuation_button", nextNodeId: "node2"}]
        }, {
            id: "node2",
            speeches: [
                {
                    text: {
                        en: "See those machines? They're a little wider than the ones you've been using before.",
                        de: "Siehst du diese Maschinen? Sie sind etwas breiter als die, die du gewohnt bist."
                    }
                }, {
                    text: {
                        en: "With these cuties you can affect two conveyor belts at once.",
                        de: "Mit diesen Schätzchen kannst du zwei Laufbänder auf einmal bedienen."
                    }
                }, {
                    text: {
                        en: "Remember though, that they apply the same change on both conveyor belts.",
                        de: "Bedenke aber, dass sie den gleichen Effekt auf beiden Bänder bewirken."
                    }
                },
                {text: {en: "Let's see what you can do!", de: "Zeig mal, was du kannst!"}}
            ],
            continuationText: {en: "Ok.", de: "Ok."},
            nextNodes: [{on: "clicked_continuation_button", nextNodeId: END}]
        }
    ]
}

export const LAST_WORDS_DAY_3: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {text: {en: "You are a natural - keep it up!", de: "Du bist ein Naturtalent - weiter so!"}}
            ],
            nextNodes: [],
            canSkip: true,
            durationUntilAutoClose: 2000,
            onEndDo: async (level) => {
                DIALOG_MANAGER.removeLevel()
                await sleep(1000)
            }
        }
    ]
}

export const DIALOG_DAY_4: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "Gosh, do I have a hangover... Who came up with Mulled Wine?",
                        de: "Hab ich einen Kater... Verdammter Glühwein... Ich fühl mich immer noch betrunken... "
                    }
                }, {
                    text: {
                        en: "I still feel tipsy... I guess my sleigh... err... car will remain unmoved today.",
                        de: "Mein Schlitten... err... Wagen bleibt heute wohl besser stehen."
                    }
                }, {
                    text: {
                        en: "By the way, I'd like to ask you to make me some Rum Truffles today.",
                        de: "Achso, heute würde ich dich übrigens um Rumkugeln bitten."
                    }
                }
            ],
            continuationText: {en: "Ok.", de: "Ok."},
            nextNodes: [{on: "clicked_continuation_button", nextNodeId: "node2"}]
        }, {
            id: "node2",
            speeches: [
                {
                    text: {
                        en: "There is also something new: One of the machines is missing a lock symbol.",
                        de: "Eine neue Sache gibt es aber: Einer der Maschinen fehlt ein Schlosssymbol."
                    }
                }, {
                    text: {
                        en: "This means that its preset property (\"sour\") can be changed.",
                        de: "Das bedeutet, dass du ihren initialen Typ (\"sauer\") ändern kannst."
                    }
                }, {
                    text: {
                        en: "I will guide you through your first time changing a machine type:",
                        de: "Ich werde dich bei deiner ersten Typänderung begleiten:"
                    }
                }, {
                    text: {
                        en: "Let's see: There is flour on the top belt which is \"powdery\" and \"white\".",
                        de: "Schauen wir mal: Auf dem obersten Laufband haben wir Mehl. Das ist \"weiß\" und \"pudrig\"."
                    }
                }, {
                    text: {
                        en: "Sugar would be nice here, but that would be sweet...",
                        de: "Hier wäre Zucker angebracht, aber der ist süß..."
                    }
                }, {
                    text: {
                        en: "Let's try: Please click on the machine that does not show a lock symbol.",
                        de: "Versuchen wir's: Bitte klick auf die Maschine, der das Schlosssymbol fehlt."
                    }
                }
            ],
            nextNodes: [{on: "opened_type_choose_menu", nextNodeId: "opened_chooser"}],
        }, {
            id: "opened_chooser",
            speeches: [
                {
                    text: {
                        en: "Marvellous! Now click on the candy icon to select the machine type \"sweet\".",
                        de: "Fantastisch! Nun klicke auf das Bonbon-Symbol, um den Maschinentyp \"süß\" zu wählen"
                    }
                }
            ],
            nextNodes: []
        }, {
            id: "selected_sweet",
            speeches: [
                {
                    text: {
                        en: "Perfect! Now move the sweetening machine onto the flour belt to make sugar.",
                        de: "Perfekt! Jetzt ziehe die Süßungsmaschine auf das Mehllaufband, um Zucker herzustellen."
                    }
                }
            ],
            continuationText: {
                en: "Yep.", de: "Jep."
            },
            nextNodes: [
                {on: "clicked_continuation_button", nextNodeId: END},
                {on: "moved_item_typeVariable_to_0_2", nextNodeId: END}
            ]
        }
    ]
}

export const LAST_WORDS_DAY_4: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "Thanks, I'll go to bed again. I really need to sober up...",
                        de: "Danke, ich werde wieder zu Bett gehen. Ich muss wirklich ausnüchtern..."
                    }
                }
            ],
            nextNodes: [],
            canSkip: true,
            durationUntilAutoClose: 2000,
            onEndDo: async (level) => {
                DIALOG_MANAGER.removeLevel()
                await sleep(1000)
            }
        }
    ]

}
export const DIALOG_DAY_5: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "Already your fifth day in my bakery. You seem to be enjoying yourself!",
                        de: "Schon dein fünfter Tag in meiner Bäckerei. Du scheinst Spaß zu haben!"
                    }
                }, {
                    text: {
                        en: "Today I'd like you to prepare some Bethmännchen.",
                        de: "Heute würde ich dich darum bitten, Bethmännchen herzustellen."
                    }
                }, {
                    text: {
                        en: "You will have to apply everything you've learned so far.",
                        de: "Du wirst alles anwenden müssen, was du bisher gelernt hast."
                    }
                },
                {text: {en: "You can do it, good luck!", de: "Du schaffst das, viel Erfolg!"}}
            ],
            continuationText: {en: "K.", de: "O.K."},
            nextNodes: [{on: "clicked_continuation_button", nextNodeId: END}]
        }
    ]
}

export const LAST_WORDS_DAY_5: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "I never doubted you for a second!",
                        de: "Ich habe nicht eine Sekunde an dir gezweifelt!"
                    }
                }],
            nextNodes: [],
            canSkip: true,
            durationUntilAutoClose: 2000,
            onEndDo: async (level) => {
                DIALOG_MANAGER.removeLevel()
                await sleep(1000)
                
            }
        }
    ]
}

export const DIALOG_DAY_6: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {text: {en: "You know what I really feel like today?", de: "Weißt du, wonach mir heute ist?"}},
                {
                    text: {
                        en: "Punch. I actually come from a very cold place....",
                        de: "Punsch. Ich komme eigentlich aus einer sehr kalten Gegend..."
                    }
                }, {
                    text: {
                        en: "After a long day, there was nothing better for me than a delicious cup of hot, steaming Punch.",
                        de: "Nach langen Tagen gab es dort nichts Besseres als eine köstliche Tasse dampfend heißen Punsch."
                    }
                },
                {text: {en: "I'll let you get to work then.", de: "Ich werde dich also mal an die Arbeit lassen."}}
            ],
            continuationText: {en: "Yep.", de: "Jep."},
            nextNodes: [{on: "clicked_continuation_button", nextNodeId: END}]
        }
    ]
}

export const LAST_WORDS_DAY_6: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "Ahh, this tastes like home. Thank you!",
                        de: "Ahh, das schmeckt nach Zuhause. Danke dir!"
                    }
                }
            ],
            nextNodes: [],
            canSkip: true,
            durationUntilAutoClose: 2000,
            onEndDo: async (level) => {
                DIALOG_MANAGER.removeLevel()
                await sleep(1000)
                
            }
        }
    ]
}

export const DIALOG_DAY_7: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {text: {en: "Nice to see you again.", de: "Schön, dich wieder zu sehen."}},
                {
                    text: {
                        en: "Did you also see the star-filled sky last night?",
                        de: "Hast du auch den Sternenhimmel letzte Nacht gesehen?"
                    }
                },
                {text: {en: "Really good flying weather.", de: "Wirklich super Flugwetter."}},
                {
                    text: {
                        en: "Well, for planes... not for reindeer... they can't fly...",
                        de: "Also für Flugzeuge... Nicht für Rentiere... Die können nicht fliegen..."
                    }
                }, {
                    text: {
                        en: "Inspired by this nightly sight, I want to ask you for Cinnamon Stars today.",
                        de: "Von diesem nächtlichen Anblick inspiriert machen wir heute Zimtsterne."
                    }
                }
            ],
            continuationText: {en: "Ok.", de: "Ok."},
            nextNodes: [{on: "clicked_continuation_button", nextNodeId: "node2"}]
        }, {
            id: "node2",
            speeches: [
                {
                    text: {
                        en: "This time there is a small change again: Machine positions can be locked.",
                        de: "Es gibt wieder eine kleine Neuerung: Maschinen können nun positions-fixiert sein."
                    }
                }, {
                    text: {
                        en: "Such machines are darker and tied to the conveyor belt with iron chains.",
                        de: "Solche Maschinen sind dunkler und mit Eisenketten an die Laufbänder gekettet."
                    }
                }, {
                    text: {
                        en: "You can only change the machines' type in that case.",
                        de: "In diesem Fall kannst du nur den Typen der Maschinen ändern."
                    }
                }, {
                    text: {
                        en: "I am sure you will master the recipe anyway.",
                        de: "Ich bin sicher, du wirst das Rezept dennoch meistern."
                    }
                }
            ],
            continuationText: {en: "Ok.", de: "Ok."},
            nextNodes: [{on: "clicked_continuation_button", nextNodeId: END}]
        }
    ]
}

export const LAST_WORDS_DAY_7: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {text: {en: "You're a real star!", de: "Du bist ein echter Star!"}},
                {text: {en: "... Yeah, that was a bad joke...", de: "... Ja okay, der war flach..."}}
            ],
            nextNodes: [],
            canSkip: true,
            durationUntilAutoClose: 2000,
            onEndDo: async (level) => {
                DIALOG_MANAGER.removeLevel()
                await sleep(1000)
                
            }
        }
    ]
}

export const DIALOG_DAY_8: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {text: {en: "Welcome to Bernd's bakery! ...", de: "Willkommen in Bernds Bäckerei! ..."}},
                {
                    text: {
                        en: "Oh it's you! Then let's not waste any more time.",
                        de: "Oh, du bist es! Na dann verplempert wir keine weitere Zeit."
                    }
                }, {
                    text: {
                        en: "Today Printen are on the agenda. Do not disappoint me!",
                        de: "Heute machen wir Printen. Enttäusche mich nicht!"
                    }
                }
            ],
            continuationText: {en: "Sure.", de: "Klar."},
            nextNodes: [{on: "clicked_continuation_button", nextNodeId: END}]
        }
    ]
}

export const LAST_WORDS_DAY_8: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "You've really got it, I've rarely eaten such good Printen.",
                        de: "Du hast es wirklich drauf. Ich habe selten so gute Printen gegessen."
                    }
                }
            ],
            nextNodes: [],
            canSkip: true,
            durationUntilAutoClose: 2000,
            onEndDo: async (level) => {
                DIALOG_MANAGER.removeLevel()
                await sleep(1000)
            }
        }
    ]
}

export const DIALOG_DAY_9: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "Tonight when I was walking Rudolph my... my dog, I noticed the beautiful half moon.",
                        de: "Als ich letzte Nacht mit Rudolph meinem... meinem Hund ging, sah ich den wunderschönen Halbmond."
                    }
                }, {
                    text: {
                        en: "It made clear to me that today we must devote ourselves to beautiful Vanilla Crescents.",
                        de: "Das machte mir klar, dass wir uns heute wunderschönen Vanillekipferln widmen sollten."
                    }
                },
                {text: {en: "I'll keep my fingers crossed for you.", de: "Ich drücke dir die Daumen."}}
            ],
            continuationText: {en: "Ok.", de: "Ok."},
            nextNodes: [{on: "clicked_continuation_button", nextNodeId: END}]
        }
    ]
}

export const LAST_WORDS_DAY_9: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {text: {en: "*Munch* ... Really delicious!", de: "*Mampf* ... Wirklich köstlich!"}}
            ],
            nextNodes: [],
            canSkip: true,
            durationUntilAutoClose: 2000,
            onEndDo: async (level) => {
                DIALOG_MANAGER.removeLevel()
                await sleep(1000)
                
            }
        }
    ]
}

export const DIALOG_DAY_10: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "Glad you're here, we have a lot planned. Have you ever heard of Florentines?",
                        de: "Gut, dass du da bist, wir haben viel vor. Schonmal von Florentinern gehört?"
                    }
                }, {
                    text: {
                        en: "No? I'm sure after today you won't forget them so easily.",
                        de: "Nein? Naja, nach heute wirst du sie so schnell nicht vergessen."
                    }
                }, {
                    text: {
                        en: "There is another innovation I would like to tell you about: Quadruple machines.",
                        de: "Es gibt noch etwas neues, von dem ich dir erzählen will: Vierfach-Maschinen."
                    }
                }, {
                    text: {
                        en: "They work like other machines, but they affect up to four conveyor belts.",
                        de: "Sie funktionieren wie andere Maschinen, aber bedienen bis zu vier Laufbänder."
                    }
                },
                {text: {en: "I believe in you!", de: "Ich glaube an dich!"}}
            ],
            continuationText: {en: "Ok.", de: "Ok."},
            nextNodes: [{on: "clicked_continuation_button", nextNodeId: END}]
        }
    ]
}

export const LAST_WORDS_DAY_10: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "You would make a good Christmas elf! ... At least I think so...",
                        de: "Du würdest einen guten Weihnachtself abgeben!... Also, denke ich..."
                    }
                }, {
                    text: {
                        en: "I... I don't know any Christmas elves. Not one!",
                        de: "Nicht, dass ich irgendwelche Elfen kennen würde... Nicht einen!"
                    }
                }
            ],
            nextNodes: [],
            canSkip: true,
            durationUntilAutoClose: 2000,
            onEndDo: async (level) => {
                DIALOG_MANAGER.removeLevel()
                await sleep(1000)
                
            }
        }
    ]
}

export const DIALOG_DAY_11: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "I woke up this morning craving Macarons. Why don't we make some today?",
                        de: "Ich bin heute mit einem starken Verlangen nach Makronen aufgewacht. Machst du uns welche?"
                    }
                }, {
                    text: {
                        en: "For you, this should be a piece of cake. Here's the recipe.",
                        de: "Das sollte für dich ein Klacks sein. Hier ist das Rezept."
                    }
                }
            ],
            continuationText: {en: "Thanks", de: "Danke"},
            nextNodes: [{on: "clicked_continuation_button", nextNodeId: END}]
        }
    ]
}

export const LAST_WORDS_DAY_11: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "Thank you, you are really a great help to me! ",
                        de: "Danke, du bist mir wirklich eine große Hilfe!"
                    }
                }
            ],
            nextNodes: [],
            canSkip: true,
            durationUntilAutoClose: 2000,
            onEndDo: async (level) => {
                DIALOG_MANAGER.removeLevel()
                await sleep(1000)
                
            }
        }
    ]
}

export const DIALOG_DAY_12: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "You know what every baker's nightmare is? Spritz Biscuits. They are so... time consuming.",
                        de: "Weißt du, was der Alptraum eines jeden Bäckers ist? Spritzgebäck. Sooo ... zeitaufwändig."
                    }
                }, {
                    text: {
                        en: "How lucky I am to have you and be able to spend that time on more meaningful things.",
                        de: "Was für ein Glück, dass ich dich habe und Zeit mit wichtigeren Dingen verbringen kann."
                    }
                }, {
                    text: {
                        en: "For example, my bag is in desperate need of mending. So my grocery bag... ",
                        de: "Zum Beispiel müsste mein Beutel mal repariert werden. Also mein Einkaufsbeutel..."
                    }
                }, {
                    text: {
                        en: "We're not talking about a huge bag that has room for an infinite number of gifts...",
                        de: "Wir sprechen nicht über einen riesigen Beutel mit Platz für unendlich viele Geschenke..."
                    }
                },
                {text: {en: "Such a thing does not exist at all...", de: "Sowas gibt es schließlich nicht..."}},
                {
                    text: {
                        en: "Oh! There are now also triple machines. I think these are self-explanatory by now.",
                        de: "Oh! Es gibt jetzt Dreifach-Maschinen. Ich glaube, die erklären sich mittlerweile selbst."
                    }
                },
                {text: {en: "So, the bakery is yours!", de: "So, die Bäckerei gehört dir!"}}
            ],
            continuationText: {en: "Okay.", de: "Okay."},
            nextNodes: [{on: "clicked_continuation_button", nextNodeId: END}]
        }
    ]
}

export const LAST_WORDS_DAY_12: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "What would I do without you? Thank you!",
                        de: "Was würde ich nur ohne dich tun? Tausend Dank!"
                    }
                }
            ],
            nextNodes: [],
            canSkip: true,
            durationUntilAutoClose: 2000,
            onEndDo: async (level) => {
                DIALOG_MANAGER.removeLevel()
                await sleep(1000)
                
            }
        }
    ]
}

export const DIALOG_DAY_13: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "Quiz question: What does Bernd never get enough of around Christmas time?",
                        de: "Quizfrage: Wovon kriegt Bernd in der Weihnachtszeit nie genug?"
                    }
                }, {
                    text: {
                        en: "Bingo, Speculoos! I'm crazy for those. How about you make us some?",
                        de: "Richtig, Spekulatius. Ich bin verrückt danach. Wie wär's, wenn du uns welche machst?"
                    }
                }
            ],
            continuationText: {en: "Sure.", de: "Klar."},
            nextNodes: [{on: "clicked_continuation_button", nextNodeId: END}]
        }
    ]
}

export const LAST_WORDS_DAY_13: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "You know how to make old Bernd happy.",
                        de: "Du weißt, wie man den alten Bernd glücklich macht."
                    }
                }
            ],
            nextNodes: [],
            canSkip: true,
            durationUntilAutoClose: 2000,
            onEndDo: async (level) => {
                DIALOG_MANAGER.removeLevel()
                await sleep(1000)
                
            }
        }
    ]
}

export const DIALOG_DAY_14: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "Good to see you! What do you think of Chocolate Bread?",
                        de: "Schön dich zu sehen! Wie stehst du zu Schokoladenbrot?"
                    }
                }, {
                    text: {
                        en: "It's actually a funny name, isn't it? But it doesn't matter.",
                        de: "Ist eigentlich ein witziger Name, nicht? Ist aber auch egal."
                    }
                }, {
                    text: {
                        en: "What matters is the taste. And it's incomparable when you follow my recipe.",
                        de: "Wichtig ist nur der Geschmack. Und der ist unvergleichlich, wenn du mein Rezept befolgst."
                    }
                },
                {text: {en: "On your marks... Get set... Go!", de: "Auf die Plätze... Fertig... Los!"}}
            ],
            continuationText: {en: "Yup.", de: "Jup"},
            nextNodes: [{on: "clicked_continuation_button", nextNodeId: END}]
        }
    ]
}

export const LAST_WORDS_DAY_14: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "I guess you want to be employee of the month! Keep it up!",
                        de: "Du willst wohl Angestellter des Monats werden! Weiter so!"
                    }
                }
            ],
            nextNodes: [],
            canSkip: true,
            durationUntilAutoClose: 2000,
            onEndDo: async (level) => {
                DIALOG_MANAGER.removeLevel()
                await sleep(1000)
                
            }
        }
    ]
}

export const DIALOG_DAY_15: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "Today is a very special day: We will make Angel Eyes.",
                        de: "Heute ist ein besonderer Tag: Wir machen Engelsaugen."
                    }
                }, {
                    text: {
                        en: "The jam we use for this has a beautiful red color.",
                        de: "Die Marmelade dafür hat eine wunderschöne rote Farbe."
                    }
                }, {
                    text: {
                        en: "Did you know that red is my favorite color? My winter clothes are mostly red.",
                        de: "Wusstest du, dass Rot meine Lieblingsfarbe ist? Meine Winterkleidung ist überwiegend rot."
                    }
                }, {
                    text: {
                        en: "It really suits me. I'm talking too much again... Good luck today!",
                        de: "Es steht mir wirklich ausgezeichnet. Ich rede wieder zu viel... Viel Glück heute!"
                    }
                }
            ],
            continuationText: {en: "Thanks", de: "Danke"},
            nextNodes: [{on: "clicked_continuation_button", nextNodeId: END}]
        }
    ]
}

export const LAST_WORDS_DAY_15: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {text: {en: "Perfect, such a beautiful red!", de: "Perfekt, so ein wunderschönes Rot!"}}
            ],
            nextNodes: [],
            canSkip: true,
            durationUntilAutoClose: 2000,
            onEndDo: async (level) => {
                DIALOG_MANAGER.removeLevel()
                await sleep(1000)
                
            }
        }
    ]
}

export const DIALOG_DAY_16: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "Black and white, dark and light, evil and good. Have you been naughty or nice this year?...",
                        de: "Schwarz und Weiß, Licht und Schatten, Gut und Böse. Warst du dieses Jahr artig?..."
                    }
                }, {
                    text: {
                        en: "Never mind the question. Today you get to try your hand at making Chess Cookies. Good luck!",
                        de: "Vergiss die Frage. Heute wirst du dich an Schwarzweißgebäck versuchen. Viel Glück!"
                    }
                }
            ],
            continuationText: {en: "Ok.", de: "Ok."},
            nextNodes: [{on: "clicked_continuation_button", nextNodeId: END}]
        }
    ]
}

export const LAST_WORDS_DAY_16: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "Hmm... the smell of freshly baked cookies. There is nothing better!",
                        de: "Hmm... der Geruch frisch gebackener Kekse. Es gibt nichts besseres!"
                    }
                }
            ],
            nextNodes: [],
            canSkip: true,
            durationUntilAutoClose: 2000,
            onEndDo: async (level) => {
                DIALOG_MANAGER.removeLevel()
                await sleep(1000)
                
            }
        }
    ]
}

export const DIALOG_DAY_17: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "Greetings! You can be counted on! Let's see, what's on my list today?",
                        de: "Grüß dich! Ich wusste auf dich kann man zählen. Also, was steht heute an?"
                    }
                }, {
                    text: {
                        en: "Ah, Gingerbread. You've probably noticed that you're up against more conveyor belts.",
                        de: "Ah, Lebkuchen. Du hast bestimmt gemerkt, dass du ziemlich viele Laufbänder vor dir hast."
                    }
                }, {
                    text: {
                        en: "But don't worry, I'm sure you'll master this recipe too. Have fun!",
                        de: "Aber keine Sorge, dieses Rezept wirst du auch meistern. Viel Spaß!"
                    }
                }
            ],
            continuationText: {en: "Thanks", de: "Danke"},
            nextNodes: [{on: "clicked_continuation_button", nextNodeId: END}]
        }
    ]
}

export const LAST_WORDS_DAY_17: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {text: {en: "You have real talent. Keep it up!", de: "Du hast wirklich Talent. Weiter so!"}}
            ],
            nextNodes: [],
            canSkip: true,
            durationUntilAutoClose: 2000,
            onEndDo: async (level) => {
                DIALOG_MANAGER.removeLevel()
                await sleep(1000)
                
            }
        }
    ]
}

export const DIALOG_DAY_18: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {text: {en: "Day 18 already, how time flies!", de: "Tag 18 schon, wie die Zeit verfliegt."}},
                {
                    text: {
                        en: "Ruprecht my... my household help has asked me for Pfeffernüsse.",
                        de: "Ruprecht mein... meine Haushaltshilfe hat mich um Pfeffernüsse gebeten."
                    }
                }, {
                    text: {
                        en: "We will fulfill this wish today. Grab the ingredients and show me your skills!",
                        de: "Wir werden seinen Wunsch erfüllen. Schnapp dir die Zutaten und zeig, was du drauf hast!"
                    }
                }
            ],
            continuationText: {en: "Yep.", de: "Jep."},
            nextNodes: [{on: "clicked_continuation_button", nextNodeId: END}]
        }
    ]
}

export const LAST_WORDS_DAY_18: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "Fantastic, Ruprecht will be thrilled!",
                        de: "Fantastisch, Ruprecht wird begeistert sein!"
                    }
                }
            ],
            nextNodes: [],
            canSkip: true,
            durationUntilAutoClose: 2000,
            onEndDo: async (level) => {
                DIALOG_MANAGER.removeLevel()
                await sleep(1000)
                
            }
        }
    ]
}

export const DIALOG_DAY_19: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "Today we're taking a culinary trip to Italy: Panettone is on the list.",
                        de: "Heute mal ein kulinarischer Ausflug nach Italien: Panettone steht auf dem Programm."
                    }
                }, {
                    text: {
                        en: "Super airy, delicious, highly recommended.",
                        de: "Super luftig, schmackhaft und sehr zu empfehlen."
                    }
                }, {
                    text: {
                        en: "Grab the recipe and get started right away.",
                        de: "Schnapp dir das Rezept und leg direkt los."
                    }
                }
            ],
            continuationText: {en: "Ok.", de: "Ok."},
            nextNodes: [{on: "clicked_continuation_button", nextNodeId: END}]
        }
    ]
}

export const LAST_WORDS_DAY_19: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {text: {en: "Delizioso! ... or something like that.", de: "Delizioso! ... Oder so ähnlich."}}
            ],
            nextNodes: [],
            canSkip: true,
            durationUntilAutoClose: 2000,
            onEndDo: async (level) => {
                DIALOG_MANAGER.removeLevel()
                await sleep(1000)
                
            }
        }
    ]
}

export const DIALOG_DAY_20: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "We are approaching the home straight. Today we are going to bake Bear Paws.",
                        de: "Wir nähern uns der Zielgeraden. Heute werden wir Bärentatzen backen."
                    }
                }, {
                    text: {
                        en: "There is one difficulty with this recipe: there are not enough machines for all belts.",
                        de: "Die Schwierigkeit hierbei: Es gibt nicht genug Maschinen für alle Laufbänder."
                    }
                }, {
                    text: {
                        en: "But if you are fast, you can of course use one machine on several conveyor belts.",
                        de: "Vielleicht kannst du ja aber eine Maschine zeitversetzt für mehrere Bänder nutzen..."
                    }
                }, {
                    text: {
                        en: "The important thing is that all desired ingredients leave the belts at the same time.",
                        de: "Das Wichtige ist, dass alle gewünschten Zutaten gleichzeitig die Laufbänder verlassen."
                    }
                }, {
                    text: {
                        en: "This will surely be a piece of cake for you!",
                        de: "Das wird sicher ein Kinderspiel für dich!"
                    }
                }
            ],
            continuationText: {en: "Mhh.", de: "Mhh."},
            nextNodes: [{on: "clicked_continuation_button", nextNodeId: END}]
        }
    ]
}

export const LAST_WORDS_DAY_20: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {text: {en: "I knew it! You are great!", de: "Ich wusste es! Du bist großartig!"}}
            ],
            nextNodes: [],
            canSkip: true,
            durationUntilAutoClose: 2000,
            onEndDo: async (level) => {
                DIALOG_MANAGER.removeLevel()
                await sleep(1000)
                
            }
        }
    ]
}

export const DIALOG_DAY_21: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "Glad to see you're still at it. Today we're making Nut Wedges.",
                        de: "Schön zu sehen, dass du noch dabei bist. Heute machen wir Nussecken."
                    }
                }, {
                    text: {
                        en: "Phew - nine ingredients. But as I know you, that won't be an obstacle. Good luck!",
                        de: "Uff - neun Zutaten. Aber wie ich dich kenne, wird das kein Problem sein. Viel Glück!"
                    }
                }
            ],
            continuationText: {en: "Sure!", de: "Klar!"},
            nextNodes: [{on: "clicked_continuation_button", nextNodeId: END}]
        }
    ]
}

export const LAST_WORDS_DAY_21: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "Hohoho, you impress me every day anew!",
                        de: "Hohoho, du beeindruckst mich jeden Tag aufs Neue!"
                    }
                }
            ],
            nextNodes: [],
            canSkip: true,
            durationUntilAutoClose: 2000,
            onEndDo: async (level) => {
                DIALOG_MANAGER.removeLevel()
                await sleep(1000)
                
            }
        }
    ]
}

export const DIALOG_DAY_22: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "In a few days it will be Christmas! Do you have a fireplace? No?",
                        de: "In ein paar Tagen ist Weihnachten. Hast du einen Kamin? Nein?"
                    }
                }, {
                    text: {
                        en: "If you ever buy one, make sure it's nice and roomy.",
                        de: "Falls du jemals einen kaufen solltest, sollte er schön groß und geräumig sein."
                    }
                }, {
                    text: {
                        en: "... I'm thinking of the chimney sweeps. They don't have it easy in their job either.",
                        de: "... Ich denke nur an die Schornsteinfeger. Die habens auch nicht leicht in ihrem Job."
                    }
                }, {
                    text: {
                        en: "So, now for today's cookies: Walnut Cookies.",
                        de: "So, zu unseren heutigen Keksen: Walnusskekse."
                    }
                }, {
                    text: {
                        en: "I've already put the recipe in the bakery for you. Let's go!",
                        de: "Ich habe das Rezept schon für dich hinterlegt. Ab dafür!"
                    }
                }
            ],
            continuationText: {en: "Yeah!", de: "Yeah!"},
            nextNodes: [{on: "clicked_continuation_button", nextNodeId: END}]
        }
    ]
}

export const LAST_WORDS_DAY_22: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {text: {en: "These are no cookies, this is art!", de: "Das sind keine Kekse, das ist Kunst!"}}
            ],
            nextNodes: [],
            canSkip: true,
            durationUntilAutoClose: 2000,
            onEndDo: async (level) => {
                DIALOG_MANAGER.removeLevel()
                await sleep(1000)
                
            }
        }
    ]
}

export const DIALOG_DAY_23: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "Not much left on our list. Today we'll take care of Dominosteine.",
                        de: "Es steht nicht mehr viel auf unserer Liste. Heute kümmern wir uns um Dominosteine."
                    }
                }, {
                    text: {
                        en: "Not the easiest to make but worth it. I trust in your skills!",
                        de: "Nicht gerade einfach zu machen, aber die Arbeit wert. Ich glaube an dich!"
                    }
                }
            ],
            continuationText: {en: "Cool", de: "Cool"},
            nextNodes: [{on: "clicked_continuation_button", nextNodeId: END}]
        }
    ]
}

export const LAST_WORDS_DAY_23: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "You did not disappoint me. So tasty!",
                        de: "Du hast mich wahrlich nicht enttäuscht. So schmackhaft!"
                    }
                }
            ],
            nextNodes: [],
            canSkip: true,
            durationUntilAutoClose: 2000,
            onEndDo: async (level) => {
                DIALOG_MANAGER.removeLevel()
                await sleep(1000)
                
            }
        }
    ]
}

export const DIALOG_DAY_24: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {text: {en: "Hello for the last time... ", de: "Hallo zum letzten Mal..."}},
                {
                    text: {
                        en: "I must say it makes me a little sad that our time together ends today.",
                        de: "Es macht mich schon etwas traurig, dass unsere Zeit zusammen heute endet."
                    }
                }, {
                    text: {
                        en: "I really had fun testing your skills and experiencing your expertise.",
                        de: "Ich hatte wirklich Spaß, dein Können zu testen und deine Expertise zu sehen."
                    }
                }, {
                    text: {
                        en: "Are you ready for the mother of all Christmas baked goods, the Stollen?",
                        de: "Bist du bereit für die Mutter aller Weihnachtsgebäcke, den Stollen?"
                    }
                }, {
                    text: {
                        en: "Unfortunately, we have to hurry up a bit, I was about to take a nap.",
                        de: "Leider müssen wir uns heute etwas beeilen, ich war dabei, ein Nickerchen zu machen."
                    }
                }, {
                    text: {
                        en: "It's going to be a busy night for me... Don't disappoint me!",
                        de: "Es wird eine harte Nacht für mich... Enttäusche mich nicht!"
                    }
                }
            ],
            continuationText: {en: "Okay", de: "Okay"},
            nextNodes: [{on: "clicked_continuation_button", nextNodeId: END}]
        }
    ]
}

export const LAST_WORDS_DAY_24: DialogConfig = {
    nodes: [
        {
            id: "start",
            speeches: [
                {
                    text: {
                        en: "Unbelievable, you really did it, I'm impressed!",
                        de: "Unglaublich, du hast es wirklich geschafft, ich bin beeindruckt!"
                    }
                }, {
                    text: {
                        en: "Maybe this time next year you can help me again?",
                        de: "Vielleicht kann ich auch im nächsten Jahr wieder auf deine Hilfe zählen?"
                    }
                }, {
                    text: {
                        en: "Thanks again so much and Merry Christmas!",
                        de: "Vielen lieben Dank nochmal und Frohe Weihnachten!"
                    }
                }
            ],
            nextNodes: [],
            canSkip: true,
            durationUntilAutoClose: 2000,
            onEndDo: async (level) => {
                DIALOG_MANAGER.removeLevel()
                await sleep(1000)
                
            }
        }
    ]
}

// Hints
export const IRON_CHAINS_HINT: DialogConfig = makeHintConfig({
    en: "Gray machines with iron chains are bound to a specific position and cannot be moved.",
    de: "Graue Maschinen mit Eisenketten können nicht bewegt werden."
})
export const DOUBLE_MACHINES_HINT: DialogConfig = makeHintConfig({
    en: "Double machines involve up to two conveyor belts and apply the same property changes.",
    de: "Doppel-Maschinen bedienen bis zu zwei Laufbänder und bewirken auf allen den gleichen Effekt."
})
export const TRIPLE_MACHINES_HINT: DialogConfig = makeHintConfig({
    en: "Triple machines involve up to three conveyor belts and apply the same property changes.",
    de: "Dreifach-Maschinen bedienen bis zu drei Laufbänder und bewirken auf allen den gleichen Effekt."
})
export const QUADRUPLE_MACHINES_HINT: DialogConfig = makeHintConfig({
    en: "Quadruple machines involve up to four conveyor belts and apply the same property changes.",
    de: "Vierfach-Maschinen bedienen bis zu vier Laufbänder und bewirken auf allen den gleichen Effekt."
})
export const CHANGE_TYPE_HINT: DialogConfig = makeHintConfig({
    en: "Click on machines without a lock icon to change the linked property.",
    de: "Klicke auf die Maschinen ohne Schlosssymbol, um ihren Typ zu ändern."
})
export const TWO_MACHINES_ON_ONE_BELT_HINT: DialogConfig = makeHintConfig({
    en: "In this recipe there is a conveyor belt on which two machines must be placed.",
    de: "In diesem Level gibt es ein Laufband, das von zwei Maschinen bedient werden muss."
})
export const MOVE_ORDER_LACK_OF_SPACE_HINT: DialogConfig = makeHintConfig({
    en: "In this recipe, the order in which the machines are moved is very important due to the lack of space.",
    de: "In diesem Level ist die Zugreihenfolge relevant, da nur sehr wenig Platz zur Verfügung steht."
}, {
    en: "Think carefully about which machine you want to move first.",
    de: "Denk gründlich darüber nach, welche Maschine du zuerst bewegen willst."
})
export const BE_FAST_HINT: DialogConfig = makeHintConfig({
    en: "In this recipe, you must be quick and apply a specific single machine to multiple conveyor belts.",
    de: "In diesem Rezept musst du schnell sein und einzelne Maschinen zwischen mehreren Bändern bewegen."
}, {
    en: "Pay attention to the right timing so that the desired ingredients leave the conveyor belts at the same time.",
    de: "Achte auf das richtige Timing, sodass alle gewünschten Zutaten gleichzeitig die Laufbänder verlassen."
})
export const NON_TIMING_FIRST_HINT: DialogConfig = makeHintConfig({
    en: "It is advisable to deal with the time independent ingredients first.",
    de: "Es ist ratsam, die zeitunabhängigen Zutaten zuerst vorzubereiten."
})

function makeHintConfig(...texts: { en: string, de: string }[]): DialogConfig {
    let speeches: { text: { en: string, de: string } }[] = []
    texts.forEach(str => speeches.push({text: str}))
    return {
        nodes: [
            {
                id: "hint",
                speeches: speeches,
                continuationText: {en: "Okay.", de: "Okay."},
                nextNodes: [{on: "clicked_continuation_button", nextNodeId: END}]
            }
        ]
    }
}






