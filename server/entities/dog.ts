import Room from '../map/rooms/room.ts'
import { Npc } from './npc.ts'
import { Color } from '../Enums.ts'

export class Dog extends Npc {
  constructor(
      x: number, y: number,
      boardRows: number,
      boardColumns: number,
      currentRoom: Room) {
    super(1, 'dog', Color.Brown, 200, 0.25, x, y, boardRows, boardColumns, currentRoom)
  }
}