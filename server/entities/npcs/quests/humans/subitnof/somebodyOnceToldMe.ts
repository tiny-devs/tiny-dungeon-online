import { ItemsIds, Npcs, Quests, RewardType, StepType } from "../../../../../../shared/Enums.ts"
import QuestBase from "../../questBase.ts"
import StepBase from "../../stepBase.ts"
import { MonstersToKillBase } from "../../monstersToKillBase.ts"
import { ItemsToHaveBase } from "../../itemsToHaveBase.ts"

export default class SomebodyOnceToldMe extends QuestBase {
    constructor() {
        super(Quests.SomebodyOnceToldMe,
            [
                new StepBase(StepType.MonstersToKill,
                    [
                        new MonstersToKillBase(Npcs.Ogre, 20),
                    ],
                    'zander',[],[],0),
                new StepBase(StepType.NpcToTalk,[],'zander',
                    [
                        'Thank you so much young man',
                        'I do have another request',
                        'If you\'re willing to help further',
                        'I need to be ready for battle',
                        'In case my man need me',
                        'I\'m not the kind of king',
                        'Who just sits and bosses around',
                        'But I need a full Blurite Set',
                        'To be of help',
                        'Armour, Helm, Legs and a Sword',
                        'Could you bring me?',
                    ],[],0),
                new StepBase(StepType.ItemsToHave,[],'zander', [],
                [
                    new ItemsToHaveBase(ItemsIds.BluriteArmour, 1),
                    new ItemsToHaveBase(ItemsIds.BluriteHelm, 1),
                    new ItemsToHaveBase(ItemsIds.BluriteLegs, 1),
                    new ItemsToHaveBase(ItemsIds.BluriteSword, 1)
                ],0),
                new StepBase(StepType.NpcToTalk,[],'zander',
                [
                    'Thank you so much for your help',
                    'I won\'t forget what you\'ve done for us.',
                    '-you received 3000xp!-'
                ],[],0),
            ],
            RewardType.Xp,
            null,
            3000,
            'Hi there young man! I\'m forever grateful for all your work.')
    }
}