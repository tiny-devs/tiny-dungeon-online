import { Npcs, Quests, RewardType, StepType } from "../../../../../../shared/Enums.ts"
import QuestBase from "../../questBase.ts"
import BluriteArmour from "../../../../items/bluriteArmour.ts"
import StepBase from "../../stepBase.ts"
import { MonstersToKillBase } from "../../monstersToKillBase.ts"

export default class HelpTheLakeVillage extends QuestBase {
    constructor() {
        super(Quests.HelpTheVillage,
            [
                new StepBase(StepType.MonstersToKill,
                    [
                        new MonstersToKillBase(Npcs.ImpArcher, 10),
                        new MonstersToKillBase(Npcs.ImpMeelee, 10),
                        new MonstersToKillBase(Npcs.ImpMage, 10),
                    ],
                    'vardan',[],[],0),
                new StepBase(StepType.NpcToTalk,[],'vardan',['You really killed all those imps!', 'Good job adventurer! We are far from having peace', 'but your help was precious. Take this armour as reward!', '-You received a Blurite Armour-'],[],0),
            ],
            RewardType.Item,
            new BluriteArmour(1),
            0,
            'Thank you for all your help!')
    }
}