import { ItemsIds, Quests, RewardType, StepType } from "../../../../../../shared/Enums.ts"
import QuestBase from "../../questBase.ts"
import StepBase from "../../stepBase.ts"
import { ItemsToHaveBase } from "../../itemsToHaveBase.ts"

export default class WarriorSomeday extends QuestBase {
    constructor() {
        super(Quests.WarriorSomeday,
            [
                new StepBase(StepType.ItemsToHave,[],'ephan', [],
                [
                    new ItemsToHaveBase(ItemsIds.WoodenDagger, 1),
                    new ItemsToHaveBase(ItemsIds.WoodenArmour, 1),
                    new ItemsToHaveBase(ItemsIds.WoodenHelm, 1),
                    new ItemsToHaveBase(ItemsIds.WoodenLegs, 1),
                ],0),
                new StepBase(StepType.NpcToTalk,[],'ephan',
                [
                    'woooah you found a full set!',
                    'thank you so much!',
                    'now I can start training to become a warrior!',
                    '-you received 250xp!-'
                ],[],0),
            ],
            RewardType.Xp,
            null,
            250,
            'Farming takes a lot of my time, but sometimes I train to be a warrior')
    }
}