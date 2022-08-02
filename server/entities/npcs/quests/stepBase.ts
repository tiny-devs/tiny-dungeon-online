import { StepType } from "../../../../shared/Enums.ts"
import ItemBase from "../../items/itemBase.ts"
import { ItemsToHaveBase } from "./itemsToHaveBase.ts"
import { MonstersToKillBase } from "./monstersToKillBase.ts"

export default class StepBase {
    public isCompleted: boolean = false
    public type: StepType
    public monstersToKill: MonstersToKillBase[] = []
    public npcToTalk: string
    public npcLines: string[]
    public playerCurrentLine: number = 0
    public itemsToHave: ItemsToHaveBase[] = []
    public itemsToGive: ItemBase[] | null = null
    public levelToReach: number

    constructor(type: StepType,
        monstersToKillBase: MonstersToKillBase[],
        npcToTalk: string,
        npcLines: string[],
        itemsToHaveBase: ItemsToHaveBase[],
        levelToReach: number,
        itemsToGive: ItemBase[] | null = null) {
        this.type = type
        this.monstersToKill = monstersToKillBase
        this.npcToTalk = npcToTalk
        this.npcLines = npcLines
        this.itemsToHave = itemsToHaveBase
        this.levelToReach = levelToReach
        this.itemsToGive = itemsToGive
    }
}