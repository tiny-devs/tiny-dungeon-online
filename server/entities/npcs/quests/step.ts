import { Npcs, StepType } from "../../../Enums.ts"
import { MonstersToKill } from "./monstersToKill.ts"
import { ItemsToHave } from "./itemsToHave.ts"

export default class Step {
    public isCompleted: boolean = false
    public type: StepType
    public monstersToKill: MonstersToKill[]
    public npcToTalk: string
    public npcLines: string[]
    public playerCurrentLine: number = 0
    public itemsToHave: ItemsToHave[]
    public levelToReach: number

    constructor(type: StepType,
        monstersToKill: MonstersToKill[],
        npcToTalk: string,
        npcLines: string[],
        itemsToHave: ItemsToHave[],
        levelToReach: number) {
        this.type = type
        this.monstersToKill = monstersToKill
        this.npcToTalk = npcToTalk
        this.npcLines = npcLines
        this.itemsToHave = itemsToHave
        this.levelToReach = levelToReach
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
        return { validNpc: false, line: '' }
    }
}