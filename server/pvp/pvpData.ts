import { Player } from '../entities/player.ts'
import Room from '../map/rooms/room.ts'

export class PvpData {
  public room: Room
  public attacker: Player  // who dealt this packet’s damage
  public defender: Player  // who received it
  public damageCaused: number  // NET damage after defense (what client displays)
  public damageDefended: number

  constructor(room: Room, attacker: Player, defender: Player) {
    this.room = room
    this.attacker = attacker
    this.defender = defender
    this.damageCaused = 0
    this.damageDefended = 0
  }
}
