import { Npcs } from "../../../../shared/Enums.ts"

export class MonstersToKillBase {
    public monster: Npcs
    public amount: number

    constructor(monster: Npcs,
      amount: number) {
        this.monster = monster
        this.amount = amount
    }
}