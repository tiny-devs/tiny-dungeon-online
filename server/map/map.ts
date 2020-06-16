import InitialRoom from './rooms/initialRoom.ts'
import Room from './rooms/room.ts'

export default class Map {
  public map: Room[]

  constructor() {
    this.map = this.buildMap()
  }

  private buildMap(): any {
    return [new InitialRoom()]
  }
}