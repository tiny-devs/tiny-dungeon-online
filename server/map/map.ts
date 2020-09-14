import InitialRoom from './rooms/initialRoom.ts'
import Woods from './rooms/woods.ts'
import Woods2 from './rooms/woods2.ts'
import Woods9 from './rooms/woods9.ts'
import Woods10 from './rooms/woods10.ts'
import Woods11 from './rooms/woods11.ts'
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
    return [new InitialRoom(Rooms.Initial, this.clientHandler), new Woods(Rooms.Woods, this.clientHandler), new Woods2(Rooms.Woods2, this.clientHandler),
      new Woods9(Rooms.Woods9, this.clientHandler), new Woods10(Rooms.Woods10, this.clientHandler), new Woods11(Rooms.Woods11, this.clientHandler)]
  }
}