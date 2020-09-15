import InitialRoom from './rooms/initialRoom.ts'
import Woods from './rooms/woods.ts'
import Woods2 from './rooms/woods2.ts'
import Woods3 from './rooms/woods3.ts'
import Woods4 from './rooms/woods4.ts'
import Woods5 from './rooms/woods5.ts'
import Woods6 from './rooms/woods6.ts'
import Woods7 from './rooms/woods7.ts'
import Woods8 from './rooms/woods8.ts'
import River14 from './rooms/river14.ts'
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
    return [new InitialRoom(Rooms.Initial, this.clientHandler), new Woods(Rooms.Woods, this.clientHandler), new Woods2(Rooms.Woods2, this.clientHandler),new Woods3(Rooms.Woods3, this.clientHandler),new Woods4(Rooms.Woods4, this.clientHandler),new Woods5(Rooms.Woods5, this.clientHandler),new Woods6(Rooms.Woods6, this.clientHandler),new Woods7(Rooms.Woods7, this.clientHandler),new Woods8(Rooms.Woods8, this.clientHandler),new River14(Rooms.River14, this.clientHandler),
      new Woods9(Rooms.Woods9, this.clientHandler), new Woods10(Rooms.Woods10, this.clientHandler), new Woods11(Rooms.Woods11, this.clientHandler)]
  }
}