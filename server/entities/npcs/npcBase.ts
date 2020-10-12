import { Npcs } from "../../Enums.ts"
import ItemBase from "../items/itemBase.ts"
import DialogBase from "./passive/dialogs/dialogBase.ts"

export default class NpcBase {
    public id: Npcs
    public agressive: boolean
    public hp: number
    public attack: number
    public defense: number
    public level: number
    public xpGiven: number
    public respawnTime: number
    public frequency: number
    public moveChance: number
    public anger: number
    public fieldOfView: number
    public dialog: DialogBase | null
    public drops: ItemBase[]

    constructor(id: number,
    agressive: boolean,
    hpBonus: number,
    attackBonus: number,
    defenseBonus: number,
    level: number,
    respawnTime: number,
    moveChance: number,
    anger: number,
    fieldOfView: number,
    dialog: DialogBase | null, 
    drops: ItemBase[]) {
        this.id = id
        this.agressive = agressive
        this.level = level
        this.xpGiven = +((level**1.1)+5).toFixed(2)
        this.hp = (level + 9) + hpBonus
        this.attack = (level + 2) + attackBonus
        this.defense = (level + 2) + defenseBonus
        this.respawnTime = respawnTime
        this.frequency = 500
        this.moveChance = moveChance
        this.anger = anger
        this.fieldOfView = fieldOfView
        this.dialog = dialog
        this.drops = drops
    }
}