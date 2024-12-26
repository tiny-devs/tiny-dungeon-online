import NpcBase from "../../entities/npcs/npcBase.ts";
import { Player } from "../../entities/player.ts";
import Exits from "./exits.ts";

export default class Door {
    public x: number
    public y: number
    public toRoomId: number
    public exits: Exits
    public solidLayer: number[][]
    public npcSpawns: (number|NpcBase)[][]
    public playerSpawnXY: number[]

    constructor(x: number, y: number, toRoomId: number, exits: Exits, solidLayer: number[][], npcSpawns: (number|NpcBase)[][], playerSpawnXY: number[]) {
        this.x = x
        this.y = y
        this.toRoomId = toRoomId
        this.exits = exits
        this.solidLayer = solidLayer
        this.npcSpawns = npcSpawns
        this.playerSpawnXY = playerSpawnXY
    }

    public playerCanEnter(player: Player): boolean {
        return true
    }
}