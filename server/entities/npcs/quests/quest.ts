import { ItemsIds, Npcs, Quests, RewardType, StepType } from "../../../../shared/Enums.ts"
import ItemBase from "../../items/itemBase.ts"
import { Player } from "../../player.ts"
import FlowerForMytklash from "./gnomes/flowerForMytklash.ts"
import TheSacredStone from "./humans/mages/theSacredStone.ts"
import JamulsMachete from "./humans/kharjid/jamulsMachete.ts"
import HelpTheLakeVillage from "./humans/deepLake/helpTheLakeVillage.ts"
import DamnRats from "./humans/subitnof/damnRats.ts"
import QuestBase from "./questBase.ts"
import Step from "./step.ts"
import WarriorSomeday from "./humans/subitnof/warriorSomeday.ts"
import ZombieKiller from "./humans/kharjid/zombieKiller.ts"

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

    private checkItemToHave(item: ItemsIds) {
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

    public checkGaveItems(player: Player): boolean {
        if (this.isCompleted) {
            return false
        }
        let gotItem = false
        if (this.steps[this.currentStep].type == StepType.ItemsToReceive) {
            const itemsToGive = this.steps[this.currentStep].itemsToGive
            if (itemsToGive.length > 0) {
                const hasBagSpace = (player.bag.size - player.bag.items.length) >= itemsToGive.length
                if (hasBagSpace) {
                    for (const item of itemsToGive) {
                        gotItem = player.getItemFromQuest(item, true)
                        if (!gotItem) {
                            return false
                        }
                    }
                } else {
                    return false
                }

                if (hasBagSpace && gotItem) {
                    this.goToNextStep(player)
                    return true
                }
                
            } else {
                return false
            }
        }
        return false
    }

    public checkLevelToReach(player: Player) {
        const reachedLevel = this.steps[this.currentStep].checkLevelToReach(player.level)
        if (reachedLevel) {
            this.goToNextStep(player)
        } else {
            return `You need to be level ${this.steps[this.currentStep].levelToReach} before continuing`
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
            if (this.steps[this.currentStep].npcToTalk == npc) {
                return this.newDialogAfterComplete
            } else {
                return ''
            }
        }
        let line = ''

        for (let i = this.currentStep; i >= 0; i--) {
            const stepReturn = this.steps[i].checkNpcDialog(npc)
            if (stepReturn.validNpc) {
                if (this.steps[i].npcLines.length <= this.steps[i].playerCurrentLine+1) {
                    if (this.steps[i].type == StepType.NpcToTalk) {
                        if (i == this.currentStep) {
                            this.goToNextStep(player)
                        }
                    }
                    this.steps[i].playerCurrentLine = 0
                } else {
                    this.steps[i].playerCurrentLine += 1
                }
    
                line = stepReturn.line
                i=-1
                break
            }
        }

        return line
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
        if (this.reward == RewardType.Xp) {
            player.addXp(this.xpReward)
            this.isCompleted = true
        }
        if (this.reward == RewardType.Item) {
            if (this.itemReward) {
                const gotItem = player.getItemFromQuest(this.itemReward, false)
                if (gotItem) {
                    this.isCompleted = true
                }
            }
        }
        if (this.reward == RewardType.Both) {
            if (this.itemReward) {
                const gotItem = player.getItemFromQuest(this.itemReward, false)
                if (gotItem) {
                    player.addXp(this.xpReward)
                    this.isCompleted = true
                }
            }
        }

        if (this.isCompleted) {
            player.finishQuest()
        }
    }

    public static getQuestFromQuestId(questId: Quests): any {
        if (questId == Quests.DamnRats) {
            return new DamnRats()
        }
        if (questId == Quests.FlowerForMytklash) {
            return new FlowerForMytklash()
        }
        if (questId == Quests.HelpTheVillage) {
            return new HelpTheLakeVillage()
        }
        if (questId == Quests.JamulsMachete) {
            return new JamulsMachete()
        }
        if (questId == Quests.TheSacredStone) {
            return new TheSacredStone()
        }
        if (questId == Quests.WarriorSomeday) {
            return new WarriorSomeday()
        }
        if (questId == Quests.ZombieKiller) {
            return new ZombieKiller()
        }

        return null
    }
}