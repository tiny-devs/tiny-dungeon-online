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
import Woods14 from './rooms/woods14.ts'
import Woods15 from './rooms/woods15.ts'
import Woods16 from './rooms/woods16.ts'
import Gnomes3 from './rooms/gnomes3.ts'
import Gnomes4 from './rooms/gnomes4.ts'
import Woods17 from './rooms/woods17.ts'
import River10 from './rooms/river10.ts'
import River11 from './rooms/river11.ts'
import Plains1 from './rooms/plains1.ts'
import Plains2 from './rooms/plains2.ts'
import Woods18 from './rooms/woods18.ts'
import Woods19 from './rooms/woods19.ts'
import Woods20 from './rooms/woods20.ts'
import Woods21 from './rooms/woods21.ts'
import Woods22 from './rooms/woods22.ts'
import River8 from './rooms/river8.ts'
import River9 from './rooms/river9.ts'
import Plains3 from './rooms/plains3.ts'
import Plains4 from './rooms/plains4.ts'
import Plains5 from './rooms/plains5.ts'
import GoblinCamp from './rooms/goblinCamp.ts'
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
      new Woods9(Rooms.Woods9, this.clientHandler), new Woods10(Rooms.Woods10, this.clientHandler), new Woods11(Rooms.Woods11, this.clientHandler), new Gnomes1(Rooms.Gnomes1, this.clientHandler), new Gnomes2(Rooms.Gnomes2, this.clientHandler), new Woods12(Rooms.Woods12, this.clientHandler), new Woods13(Rooms.Woods13, this.clientHandler), new River12(Rooms.River12, this.clientHandler), new DeepLake(Rooms.DeepLake, this.clientHandler), new River13(Rooms.River13, this.clientHandler),
      new Woods14(Rooms.Woods14, this.clientHandler), new Woods15(Rooms.Woods15, this.clientHandler), new Woods16(Rooms.Woods16, this.clientHandler), new Gnomes3(Rooms.Gnomes3, this.clientHandler), new Gnomes4(Rooms.Gnomes4, this.clientHandler), new Woods17(Rooms.Woods17, this.clientHandler), new River10(Rooms.River10, this.clientHandler), new River11(Rooms.River11, this.clientHandler), new Plains1(Rooms.Plains1, this.clientHandler), new Plains2(Rooms.Plains2, this.clientHandler),
      new Woods18(Rooms.Woods18, this.clientHandler), new Woods19(Rooms.Woods19, this.clientHandler), new Woods20(Rooms.Woods20, this.clientHandler), new Woods21(Rooms.Woods21, this.clientHandler), new Woods22(Rooms.Woods22, this.clientHandler), new River8(Rooms.River8, this.clientHandler), new River9(Rooms.River9, this.clientHandler), new Plains3(Rooms.Plains3, this.clientHandler), new Plains4(Rooms.Plains4, this.clientHandler), new Plains5(Rooms.Plains5, this.clientHandler),
      new GoblinCamp(Rooms.GoblinCamp, this.clientHandler)]
  }
}