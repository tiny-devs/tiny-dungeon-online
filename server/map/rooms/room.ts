import { Player } from "../../entities/player.ts"
import Exits from "./exits.ts"
import { Npc } from "../../entities/npc.ts"
import { Npcs } from '../../Enums.ts'
import { Dog } from '../../entities/dog.ts'
import { ClientHandler } from '../../clientHandler.ts'

export default class Room {
  public id: number
  public solidLayer: any
  public players: Player[] = []
  public npcSpawns: any
  public npcs: Npc[] = []
  public exits: Exits
  public clientHandler: ClientHandler
  public boardRows: number = 16
  public boardColumns: number = 16

  constructor(id: number, exits: Exits, clientHandler: ClientHandler) {
    this.id = id
    this.exits = exits
    this.clientHandler = clientHandler
    this.boardRows = clientHandler.boardRows
    this.boardColumns = clientHandler.boardColumns
  }

  addPlayer(player: Player) {
    this.players.push(player)
  }

  removePlayer(player: Player) {
    const index = this.players.indexOf(player)
    if (index > -1) {
      this.players.splice(index, 1)
    }
  }

  spawnNpcs() {
    let npcs = 0
    for (let i=0; i<this.npcSpawns.length; i++) {
      for (let j=0; j<this.npcSpawns[0].length; j++) {
        npcs++
        const npcToSpawn = this.npcSpawns[j][i]
        switch (npcToSpawn) {
          case Npcs.Dog:
            this.npcs.push(new Dog(npcs, i, j, this.boardRows, this.boardColumns, this))
            break
          default:
            npcs--
            break
        }
      }
    }
  }

  goNorth(): any {
    let isValid = false
    if (this.exits.hasNorth()) {
      isValid = true
    }
    return { valid: isValid, roomId: this.exits.n }
  }

  goSouth(): any {
    let isValid = false
    if (this.exits.hasSouth()) {
      isValid = true
    }
    return { valid: isValid, roomId: this.exits.s }
  }

  goWest(): any {
    let isValid = false
    if (this.exits.hasWest()) {
      isValid = true
    }
    return { valid: isValid, roomId: this.exits.w }
  }

  goEast(): any {
    let isValid = false
    if (this.exits.hasEast()) {
      isValid = true
    }
    return { valid: isValid, roomId: this.exits.e }
  }
}