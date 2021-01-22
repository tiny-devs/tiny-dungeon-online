import { Items, Npcs, Quests, RewardType, StepType } from "../../../Enums.ts"
import ItemBase from "../../items/itemBase.ts"
import { Player } from "../../player.ts"
import QuestBase from "./questBase.ts"
import Step from "./step.ts"

export default class Quest {
    public id: Quests
    public isCompleted: boolean
    public steps: Step[] = []
    public currentStep: number
    public reward: RewardType
    public itemReward: ItemBase | null
    public xpReward: number
    public newDialogAfterComplete: string

    constructor(questData: QuestBase) {
        this.id = questData.id
        this.isCompleted = false
        for (const step of questData.steps) {
            this.steps.push(new Step(step))
        }
        this.currentStep = 0
        this.reward = questData.reward
        this.itemReward = questData.itemReward
        this.xpReward = questData.xpReward
        this.newDialogAfterComplete = questData.newDialogAfterComplete
    }

    private checkItemToHave(item: Items) {
        if (this.isCompleted) {
            return
        }
        this.steps[this.currentStep].checkItemToHave(item)
    }

    private resetAmountItemsToHave() {
        if (this.isCompleted) {
            return
        }
        this.steps[this.currentStep].resetAmountItemsToHave()
    }

    public checkItemsToHave(player: Player): boolean {
        if (this.isCompleted) {
            return false
        }

        for (const item of player.bag.items) {
            this.checkItemToHave(item.itemId)
        }

        const stepCompleted = !this.steps[this.currentStep].itemsToHave.some(i => i.amount > 0)
        if (stepCompleted) {
            player.removeItemsFromQuest(this.steps[this.currentStep].itemsToHave)
            this.goToNextStep(player)
            return true
        } else {
            this.resetAmountItemsToHave()
        }
        return false
    }

    public checkLevelToReach(player: Player) {
        const reachedLevel = this.steps[this.currentStep].checkLevelToReach(player.level)
        if (reachedLevel) {
            this.goToNextStep(player)
        }
    }

    public checkMonsterKill(monster: Npcs, player: Player) {
        if (this.isCompleted) {
            return
        }

        const stepReturn = this.steps[this.currentStep].checkMonsterKill(monster)
        if (stepReturn.validMonster) {
            const stepCompleted = !this.steps[this.currentStep].monstersToKill.some(m => m.amount > 0)
            if (stepCompleted) {
                this.goToNextStep(player)
            }
        }
    }

    public checkNpcDialog(npc: string, player: Player) {
        if (this.isCompleted) {
            return this.newDialogAfterComplete
        }

        const stepReturn = this.steps[this.currentStep].checkNpcDialog(npc)
        if (stepReturn.validNpc) {
            if (this.isCompleted) {
                return this.newDialogAfterComplete
            }

            if (this.steps[this.currentStep].npcLines.length <= this.steps[this.currentStep].playerCurrentLine+1) {
                if (this.steps[this.currentStep].type == StepType.NpcToTalk) {
                    this.goToNextStep(player)
                }
                this.steps[this.currentStep].playerCurrentLine = 0
            } else {
                this.steps[this.currentStep].playerCurrentLine += 1
            }

            return stepReturn.line
        } else {
            return ''
        }
    }

    public goToNextStep(player: Player) {
        if (this.isCompleted) {
            return
        }

        this.steps[this.currentStep].isCompleted = true
        if (this.currentStep+1 == this.steps.length) {
            this.completeQuest(player)
        } else {
            this.currentStep += 1
        }
    }

    public completeQuest(player: Player) {
        if (this.reward == RewardType.Xp || this.reward == RewardType.Both) {
            player.addXp(this.xpReward)
            this.isCompleted = true
        }
        if (this.reward == RewardType.Item || this.reward == RewardType.Both) {
            if (this.itemReward) {
                const gotItem = player.getItemFromQuest(this.itemReward)
                if (gotItem) {
                    this.isCompleted = true
                }
            }
        }
    }
}