import { Quests, RewardType } from "../../../../shared/Enums.ts"
import ItemBase from "../../items/itemBase.ts"
import Step from "./step.ts"
import StepBase from "./stepBase.ts"

export default class QuestBase {
    public id: Quests
    public steps: StepBase[]
    public reward: RewardType
    public itemReward: ItemBase | null
    public xpReward: number
    public newDialogAfterComplete: string

    constructor(id: number,
      steps: StepBase[],
      reward: RewardType,
      itemReward: ItemBase | null,
      xpReward: number,
      newDialogAfterComplete: string) {
        this.id = id
        this.steps = steps
        this.reward = reward
        this.itemReward = itemReward
        this.xpReward = xpReward
        this.newDialogAfterComplete = newDialogAfterComplete
    }
}