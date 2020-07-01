import Room from '../map/rooms/room.ts'
import { Npc } from './npc.ts'
import { Npcs } from '../Enums.ts'

export class Dog extends Npc {
  constructor(
      id: number,
      x: number, y: number,
      boardRows: number,
      boardColumns: number,
      currentRoom: Room) {
    super(id, Npcs.Dog, 'dog', x, y, 500, 0.25, boardRows, boardColumns, currentRoom)
  }
}