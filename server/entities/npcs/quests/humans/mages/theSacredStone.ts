import { Items, Npcs, Quests, RewardType, StepType } from "../../../../../Enums.ts"
import QuestBase from "../../questBase.ts"
import StepBase from "../../stepBase.ts"
import { MonstersToKillBase } from "../../monstersToKillBase.ts"
import { ItemsToHaveBase } from "../../itemsToHaveBase.ts"

export default class TheSacredStone extends QuestBase {
    constructor() {
        super(Quests.TheSacredStone,
            [
                new StepBase(StepType.NpcToTalk,[],'francis',
                    [
                        '...',
                        'My name is Francis Darci',
                        'What do you need?',
                        '...',
                        'Ediog sent you in search for something?',
                        'A stone??',
                        'I can\'t believe it, why would he want',
                        'some stupid stone',
                        '...',
                        'If you want any information from me',
                        'You\'ll have to help me',
                        'I\'m sick, and I\'ll probably die',
                        'Unless I have Cactus Juice',
                        'it is a rare drink that Cursed Cactus monsters',
                        'can drop. You\'ll find them in the desert.',
                        'I need 3 doses of that',
                        'now stay away from me.',
                    ],[],0),
                new StepBase(StepType.ItemsToHave,[],'francis', [],
                    [
                        new ItemsToHaveBase(Items.CactusJuice, 3)
                    ],0),
                new StepBase(StepType.NpcToTalk,[],'francis',
                    [
                        'You actually found 3 doses',
                        'I cannot, I... This is',
                        'H-how? Why would you do this?',
                        'You just saved my life',
                        'Look, I think you\'re someone worthy',
                        'of knowing what I have',
                        'But first, I need to know',
                        'exactly what the mages know',
                        'go back to Ediog and ask him',
                        'what does he know about the stone',
                        'then come back and tell me',
                    ],[],0),
                new StepBase(StepType.NpcToTalk,[],'ediog',
                    [
                        'Hello there! did you get the stone?',
                        'Francis Darci?',
                        'hmmm...',
                        'This has to stay between us',
                        'Well, the Sacred Stone is',
                        'a powerful relic',
                        'We believe it took a crucial part',
                        'into opening the portal',
                        'that brought evil creatures to this land',
                        'our researches show that the rock',
                        'came from space',
                        'and some ancient evil wizards found it',
                        'and used it to summon and open the portal',
                        'the stone could be the key to close it',
                        'that\'s what we know',
                        'I don\'t understand',
                        'how nor why could Francis have it',
                        'we have to get it...',
                    ],[],0),
                new StepBase(StepType.MonstersToKill,
                    [
                        new MonstersToKillBase(Npcs.Rat, 25),
                    ],
                    'lugrus',[],[],0),
                new StepBase(StepType.NpcToTalk,[],'lugrus',
                    [
                        'No way, you actually killed 25 rats!',
                        'Thats impressive',
                        'Since you\'re already into it',
                        'Could you bring me a cup of coffee?'
                    ],[],0),
                new StepBase(StepType.NpcToTalk,[],'lugrus',
                [
                    'Thanks man, you deserve some xp',
                    '-you received 500xp!-'
                ],[],0),
            ],
            RewardType.Xp,
            null,
            500,
            'Hey! Lugrus here.')
    }
}