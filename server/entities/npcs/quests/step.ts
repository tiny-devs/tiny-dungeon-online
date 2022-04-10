import { Items, Npcs, StepType } from "../../../Enums.ts"
import { MonstersToKill } from "./monstersToKill.ts"
import { ItemsToHave } from "./itemsToHave.ts"
import StepBase from "./stepBase.ts"
import ItemBase from "../../items/itemBase.ts"

export default class Step {
    public isCompleted: boolean = false
    public type: StepType
    public monstersToKill: MonstersToKill[] = []
    public npcToTalk: string
    public npcLines: string[]
    public playerCurrentLine: number = 0
    public itemsToHave: ItemsToHave[] = []
    public itemsToGive: ItemBase[] = []
    public levelToReach: number

    constructor(stepData: StepBase) {
        this.type = stepData.type
        for (const monsterToKill of stepData.monstersToKill) {
            this.monstersToKill.push(new MonstersToKill(monsterToKill))
        }
        this.npcToTalk = stepData.npcToTalk
        this.npcLines = stepData.npcLines
        for (const itemToHave of stepData.itemsToHave) {
            this.itemsToHave.push(new ItemsToHave(itemToHave))
        }
        this.levelToReach = stepData.levelToReach
        if (stepData.itemsToGive != null) {
            for (const itemToGive of stepData.itemsToGive) {
                this.itemsToGive.push(new ItemBase(itemToGive.id,
                    itemToGive.itemId,
                    itemToGive.type,
                    itemToGive.gearType,
                    itemToGive.coins,
                    itemToGive.despawnTime,
                    itemToGive.level,
                    itemToGive.isDefensive,
                    itemToGive.bonusAttack,
                    itemToGive.bonusDefense,
                    itemToGive.healthRefuel,
                    itemToGive.dropChance,
                    itemToGive.storeSellPrice,
                    itemToGive.playerSellPrice,))
            }
        }
        
    }

    public checkItemToHave(item: Items) {
        if (this.type == StepType.ItemsToHave) {
            const itemToHave = this.itemsToHave.find(i => (i.item == item) && i.amount > 0)
            if (itemToHave) {
                itemToHave.amount -= 1
                return { validItem: true }
            }
        }
        return { validItem: false }
    }

    public resetAmountItemsToHave() {
        if (this.type == StepType.ItemsToHave) {
            for (let itemToHave of this.itemsToHave) {
                itemToHave.amount = itemToHave.amountTotal
            }
        }
    }

    public checkLevelToReach(level: number) {
        if (this.type == StepType.LevelToReach) {
            if (level >= this.levelToReach) {
                return true
            }
        }
        return false
    }

    public checkMonsterKill(monster: Npcs): { validMonster: boolean } {
        if (this.type == StepType.MonstersToKill) {
            const monsterToKill = this.monstersToKill.find(m => (m.monster == monster) && m.amount > 0)
            if (monsterToKill) {
                monsterToKill.amount -= 1
                return { validMonster: true }
            }
        }
        return { validMonster: false }
    }

    public checkNpcDialog(npc: string): {validNpc: boolean,line:string } {
        if (this.type == StepType.NpcToTalk) {
            if (npc == this.npcToTalk) {
                return { validNpc: true, line: this.npcLines[this.playerCurrentLine] }
            }
        }
        if (this.type == StepType.MonstersToKill) {
            if (npc == this.npcToTalk) {
                let monstersLog = ''
                for (const monster of this.monstersToKill) {
                    monstersLog += `${Npcs[monster.monster]}: ${monster.amount} left; `
                }
                return { validNpc: true, line: monstersLog }
            }
        }
        return { validNpc: false, line: '' }
    }
}