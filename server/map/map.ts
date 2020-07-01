import InitialRoom from './rooms/initialRoom.ts'
import Woods from './rooms/woods.ts'
import Room from './rooms/room.ts'
import { Rooms } from '../Enums.ts'
import { ClientHandler } from '../clientHandler.ts'

export default class Map {
  private clientHandler: ClientHandler
  public rooms: Room[]

  constructor(clientHandler: ClientHandler) {
    this.clientHandler = clientHandler
    this.rooms = this.buildMap()
  }

  public getRoomById(roomId: number): Room {
    return this.rooms.find(room => {
      return room.id === roomId
    }) || this.rooms[roomId]
  }

  private buildMap(): any {
    return [new InitialRoom(Rooms.Initial, this.clientHandler), new Woods(Rooms.Woods, this.clientHandler)]
  }
}