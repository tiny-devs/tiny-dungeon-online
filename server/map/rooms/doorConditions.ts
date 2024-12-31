import { ItemsIds, Quests } from "../../../shared/Enums.ts";
import { Player } from "../../entities/player.ts";

export default class DoorConditions {
    public wearingItems: ItemsIds[]
    public bagItems: ItemsIds[]
    public questsCompleted: Quests[]
    public minLevel: number
    public minAttack: number
    public minDef: number
    public errorMessage: string

    constructor(wearingItems: ItemsIds[], bagItems: ItemsIds[], questsCompleted: Quests[], minLevel: number, minAttack: number, minDef: number, errorMessage: string) {
        this.wearingItems = wearingItems
        this.bagItems = bagItems
        this.questsCompleted = questsCompleted
        this.minLevel = minLevel
        this.minAttack = minAttack
        this.minDef = minDef
        this.errorMessage = errorMessage
    }

    public evaluate(player: Player): {open: boolean,closedReason: string} {
        const hasItemsInBag = player.bag.hasAllItems(this.bagItems)
        const isWearingItems = player.gear.wearingAllItems(this.wearingItems)
        const questsCompleted = player.quests.filter(x => this.questsCompleted.some(y => y == x.id) && x.isCompleted)
        const hasCompletedQuests = questsCompleted.length == this.questsCompleted.length

        return {
            open: (player.level >= this.minLevel &&
                player.totalDefense() >= this.minDef &&
                player.totalAttack() >= this.minAttack &&
                hasItemsInBag &&
                isWearingItems &&
                hasCompletedQuests),
            closedReason: this.errorMessage
        }
    }
}