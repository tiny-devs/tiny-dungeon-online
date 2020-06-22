import { Player } from "../../player.ts"

export default class Room {
  public id: number
  public solidLayer: any
  public players: Player[] = []
  public exits: any = { n: -1, s: -1, w: -1, e: -1 }

  constructor(id: number, exits: any) {
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
    if (this.exits.n != -1) {
      isValid = true
    }
    return { valid: isValid, roomId: this.exits.n }
  }

  goSouth(): any {
    let isValid = false
    if (this.exits.s != -1) {
      isValid = true
    }
    return { valid: isValid, roomId: this.exits.s }
  }

  goWest(): any {
    let isValid = false
    if (this.exits.w != -1) {
      isValid = true
    }
    return { valid: isValid, roomId: this.exits.w }
  }

  goEast(): any {
    let isValid = false
    if (this.exits.e != -1) {
      isValid = true
    }
    return { valid: isValid, roomId: this.exits.e }
  }
}