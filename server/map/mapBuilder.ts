import { SolidLayers } from "../../shared/solidLayers.ts"
import { ClientHandler } from "../clientHandler.ts"
import { Rooms } from "../Enums.ts"
import { MapDimensionsHeightWidth, NpcSpawns } from "./npcSpawns.ts"
import Exits from "./rooms/exits.ts"
import Room from "./rooms/room.ts"

export class MapBuilder {
  private clientHandler: ClientHandler
  private mapDimensionsHeightWidth: number[] = MapDimensionsHeightWidth

  constructor(clientHandler: ClientHandler) {
      this.clientHandler = clientHandler
  }
  
  public buildMap() {
    const map = []
    const enumRoomsAny = Rooms as any
    const npcSpawnsAny = NpcSpawns as any
    const exits = this.generateExits()

    let count = 0
    for (const [key, value] of Object.entries(SolidLayers)) {
      const roomId = enumRoomsAny[key]
      const solidLayer = value
      let npcSpawns = npcSpawnsAny[key]

      if (!npcSpawns) {
        npcSpawns = this.generateEmptyNpcSpawns()
      }

      map.push(new Room(roomId, exits[count], this.clientHandler, solidLayer, npcSpawns))
      count += 1
    }

    return map
  }

  private generateExits() {
    const exits = []
    const mapWidth = this.mapDimensionsHeightWidth[1]
    const mapHeight = this.mapDimensionsHeightWidth[0]

    for (let height=0; height < mapHeight; height++) {
      for (let width=0; width < mapWidth; width++) {
        const n = (height - 1 >= 0) ? Rooms[width + ((height-1) * mapWidth)] ? width + ((height-1) * mapWidth) : -1 : -1
        const s = (height + 1 < mapHeight) ? Rooms[width + ((height+1) * mapWidth)] ? width + ((height+1) * mapWidth) : -1 : -1
        const w = (width - 1 >= 0) ? Rooms[(width-1) + (height * mapWidth)] ? (width-1) + (height * mapWidth) : -1 : -1
        const e = (width + 1 < mapWidth) ? Rooms[(width+1) + (height * mapWidth)] ? (width+1) + (height * mapWidth) : -1 : -1
        
        exits.push(new Exits(n, s, w, e))
      }
    }

    return exits
  }

  private generateEmptyNpcSpawns() {
    return [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]
  }
}