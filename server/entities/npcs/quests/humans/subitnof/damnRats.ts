import { ItemsIds, Npcs, Quests, RewardType, StepType } from "../../../../../../shared/Enums.ts"
import QuestBase from "../../questBase.ts"
import StepBase from "../../stepBase.ts"
import { MonstersToKillBase } from "../../monstersToKillBase.ts"
import { ItemsToHaveBase } from "../../itemsToHaveBase.ts"

export default class DamnRats extends QuestBase {
    constructor() {
        super(Quests.DamnRats,
            [
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
                new StepBase(StepType.ItemsToHave,[],'lugrus', [],
                [
                    new ItemsToHaveBase(ItemsIds.Coffee, 1)
                ],0),
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