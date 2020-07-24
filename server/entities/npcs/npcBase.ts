import { Npcs } from "../../Enums.ts"

export default class NpcBase {
    public id: Npcs
    public agressive: boolean
    public hp: number
    public attack: number
    public defense: number
    public respawnTime: number
    public frequency: number
    public moveChance: number
    public anger: number
    public fieldOfView: number

    constructor(id: number,
    agressive: boolean,
    hp: number,
    attack: number,
    defense: number,
    respawnTime: number,
    frequency: number,
    moveChance: number,
    anger: number,
    fieldOfView: number) {
        this.id = id
        this.agressive = agressive
        this.hp = hp
        this.attack = attack
        this.defense = defense
        this.respawnTime = respawnTime
        this.frequency = frequency
        this.moveChance = moveChance
        this.anger = anger
        this.fieldOfView = fieldOfView
    }
}