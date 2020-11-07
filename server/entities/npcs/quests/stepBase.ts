import { StepType } from "../../../Enums.ts"
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
    public levelToReach: number

    constructor(type: StepType,
        monstersToKillBase: MonstersToKillBase[],
        npcToTalk: string,
        npcLines: string[],
        itemsToHaveBase: ItemsToHaveBase[],
        levelToReach: number) {
        this.type = type
        this.monstersToKill = monstersToKillBase
        this.npcToTalk = npcToTalk
        this.npcLines = npcLines
        this.itemsToHave = itemsToHaveBase
        this.levelToReach = levelToReach
    }
}