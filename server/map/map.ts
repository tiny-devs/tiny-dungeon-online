import Room from './rooms/room.ts'
import { ClientHandler } from '../clientHandler.ts'
import { MapBuilder } from "./mapBuilder.ts"

export default class Map {
  private mapBuilder: MapBuilder
  public rooms: Room[]

  constructor(clientHandler: ClientHandler) {
    this.mapBuilder = new MapBuilder(clientHandler)
    this.rooms = this.buildMap()
  }

  public getRoomById(roomId: number): Room {
    return this.rooms.find(room => {
      return room.id === roomId
    }) || this.rooms[roomId]
  }

  private buildMap(): any {
    return this.mapBuilder.buildMap()
  }

  // private buildMap(): any {
  //   return [new InitialRoom(Rooms.InitialRoom, this.clientHandler), new Woods(Rooms.Woods, this.clientHandler), new Woods2(Rooms.Woods2, this.clientHandler),new Woods3(Rooms.Woods3, this.clientHandler),new Woods4(Rooms.Woods4, this.clientHandler),new Woods5(Rooms.Woods5, this.clientHandler),new Woods6(Rooms.Woods6, this.clientHandler),new Woods7(Rooms.Woods7, this.clientHandler),new Woods8(Rooms.Woods8, this.clientHandler),new River14(Rooms.River14, this.clientHandler),
  //     new Woods9(Rooms.Woods9, this.clientHandler), new Woods10(Rooms.Woods10, this.clientHandler), new Woods11(Rooms.Woods11, this.clientHandler), new Gnomes1(Rooms.Gnomes1, this.clientHandler), new Gnomes2(Rooms.Gnomes2, this.clientHandler), new Woods12(Rooms.Woods12, this.clientHandler), new Woods13(Rooms.Woods13, this.clientHandler), new River12(Rooms.River12, this.clientHandler), new DeepLake(Rooms.DeepLake, this.clientHandler), new River13(Rooms.River13, this.clientHandler),
  //     new Woods14(Rooms.Woods14, this.clientHandler), new Woods15(Rooms.Woods15, this.clientHandler), new Woods16(Rooms.Woods16, this.clientHandler), new Gnomes3(Rooms.Gnomes3, this.clientHandler), new Gnomes4(Rooms.Gnomes4, this.clientHandler), new Woods17(Rooms.Woods17, this.clientHandler), new River10(Rooms.River10, this.clientHandler), new River11(Rooms.River11, this.clientHandler), new Plains1(Rooms.Plains1, this.clientHandler), new Plains2(Rooms.Plains2, this.clientHandler),
  //     new Woods18(Rooms.Woods18, this.clientHandler), new Woods19(Rooms.Woods19, this.clientHandler), new Woods20(Rooms.Woods20, this.clientHandler), new Woods21(Rooms.Woods21, this.clientHandler), new Woods22(Rooms.Woods22, this.clientHandler), new River8(Rooms.River8, this.clientHandler), new River9(Rooms.River9, this.clientHandler), new Plains3(Rooms.Plains3, this.clientHandler), new Plains4(Rooms.Plains4, this.clientHandler), new Plains5(Rooms.Plains5, this.clientHandler),
  //     new GoblinCamp(Rooms.GoblinCamp, this.clientHandler), new Woods23(Rooms.Woods23, this.clientHandler), new River4(Rooms.River4, this.clientHandler), new River5(Rooms.River5, this.clientHandler), new River6(Rooms.River6, this.clientHandler), new River7(Rooms.River7, this.clientHandler), new Plains6(Rooms.Plains6, this.clientHandler), new Plains7(Rooms.Plains7, this.clientHandler), new Plains8(Rooms.Plains8, this.clientHandler), new Plains9(Rooms.Plains9, this.clientHandler)]
  // }
}