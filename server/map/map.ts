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
import Gnomes1 from './rooms/gnomes1.ts'
import Gnomes2 from './rooms/gnomes2.ts'
import Woods12 from './rooms/woods12.ts'
import Woods13 from './rooms/woods13.ts'
import River12 from './rooms/river12.ts'
import DeepLake from './rooms/deepLake.ts'
import River13 from './rooms/river13.ts'
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
      new Woods9(Rooms.Woods9, this.clientHandler), new Woods10(Rooms.Woods10, this.clientHandler), new Woods11(Rooms.Woods11, this.clientHandler), new Gnomes1(Rooms.Gnomes1, this.clientHandler), new Gnomes2(Rooms.Gnomes2, this.clientHandler), new Woods12(Rooms.Woods12, this.clientHandler), new Woods13(Rooms.Woods13, this.clientHandler), new River12(Rooms.River12, this.clientHandler), new DeepLake(Rooms.DeepLake, this.clientHandler), new River13(Rooms.River13, this.clientHandler)]
  }
}