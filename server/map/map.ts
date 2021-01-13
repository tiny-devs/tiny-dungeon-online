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
}