import { Player } from "../../player.ts"
import Exits from "./exits.ts"

export default class Room {
  public id: number
  public solidLayer: any
  public players: Player[] = []
  public exits: Exits

  constructor(id: number, exits: Exits) {
    this.id = id
    this.exits = exits
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