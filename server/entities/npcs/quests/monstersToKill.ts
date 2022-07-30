import { Npcs } from "../../../../shared/Enums.ts"
import { MonstersToKillBase } from "./monstersToKillBase.ts"

export class MonstersToKill {
    public monster: Npcs
    public amount: number

    constructor(monstersData: MonstersToKillBase) {
        this.monster = monstersData.monster
        this.amount = monstersData.amount
    }
}