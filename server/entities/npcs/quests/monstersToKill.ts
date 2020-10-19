import { Npcs } from "../../../Enums.ts"

export class MonstersToKill {
    public monster: Npcs
    public amount: number

    constructor(monster: Npcs,
      amount: number) {
        this.monster = monster
        this.amount = amount
    }
}