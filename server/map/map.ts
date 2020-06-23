import InitialRoom from './rooms/initialRoom.ts'
import Woods from './rooms/woods.ts'
import Room from './rooms/room.ts'
import { Rooms } from '../Enums.ts'

export default class Map {
  public rooms: Room[]

  constructor() {
    this.rooms = this.buildMap()
  }

  public getRoomById(roomId: number): Room {
    return this.rooms.find(room => {
      return room.id === roomId
    }) || this.rooms[roomId]
  }

  private buildMap(): any {
    return [new InitialRoom(Rooms.Initial), new Woods(Rooms.Woods)]
  }
}