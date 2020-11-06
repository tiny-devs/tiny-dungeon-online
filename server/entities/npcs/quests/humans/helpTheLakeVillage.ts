import { Items, Npcs, Quests, RewardType, StepType } from "../../../../Enums.ts"
import { MonstersToKill } from "../monstersToKill.ts"
import QuestBase from "../questBase.ts"
import Step from "../step.ts"
import AdamantArmour from "../../../items/adamantArmour.ts"

export default class HelpTheLakeVillage extends QuestBase {
    constructor() {
        super(Quests.HelpTheVillage,
            [
                new Step(StepType.MonstersToKill,
                    [
                        new MonstersToKill(Npcs.ImpArcher, 10),
                        new MonstersToKill(Npcs.ImpMeelee, 10),
                        new MonstersToKill(Npcs.ImpMage, 10),
                    ],
                    'vardan',[],[],0),
                new Step(StepType.NpcToTalk,[],'vardan',['You really killed all those imps!', 'Good job adventurer! We are far from having peace', 'but your help was precious. Take this armour as reward!'],[],0),
            ],
            RewardType.Item,
            new AdamantArmour(1),
            0,
            'Thank you for all your help!')
    }
}