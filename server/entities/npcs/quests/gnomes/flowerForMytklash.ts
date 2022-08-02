import { Items, Quests, RewardType, StepType } from "../../../../../shared/Enums.ts"
import QuestBase from "../questBase.ts"
import StepBase from "../stepBase.ts"

export default class FlowerForMytklash extends QuestBase {
    constructor() {
        super(Quests.FlowerForMytklash,
          [
            new StepBase(StepType.NpcToTalk,[],'mytklashs flower',['you found the flower Mytklash likes!', 'Go tell Horvyn!'],[],0),
            new StepBase(StepType.NpcToTalk,[],'horvyn',['Are you sure she will like it?', 'She loved it! Thank you so much', 'you received 30xp'],[],0),
          ],
          RewardType.Xp,
          null,
          30,
          'Hi hero! Thanks for the help with my love life!')
    }
}