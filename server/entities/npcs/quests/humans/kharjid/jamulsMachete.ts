import { Items, Quests, RewardType, StepType } from "../../../../../../shared/Enums.ts"
import QuestBase from "../../questBase.ts"
import StepBase from "../../stepBase.ts"
import { ItemsToHaveBase } from "../../itemsToHaveBase.ts"
import JamulsGuitar from "../../../../items/jamulsGuitar.ts"

export default class JamulsMachete extends QuestBase {
    constructor() {
        super(Quests.JamulsMachete,
            [
                new StepBase(StepType.ItemsToHave,[],'jamul', [],
                [
                    new ItemsToHaveBase(Items.JamulsMachete, 1)
                ],0),
                new StepBase(StepType.NpcToTalk,[],'jamul',
                [
                    'oooh you got it son?!',
                    'thanks for finding my machete',
                    'the Jamul\'s Machete',
                    'I don\'t have much to give but',
                    'you can have my guitar',
                    'it doesn\'t do much',
                    'but I don\'t think many people have it',
                    '-you received 500xp!-',
                    '-you received Jamuls Guitar!-'
                ],[],0),
            ],
            RewardType.Both,
            new JamulsGuitar(0),
            500,
            'Hi son! You can call me Jamil')
    }
}