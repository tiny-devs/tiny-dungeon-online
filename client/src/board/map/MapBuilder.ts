import { Game } from '../../startup/Game'
import { Rooms, RoomsInsides } from '../../../../shared/Enums'
import { Room } from './Room'
import { BackgroundLayers, BackgroundLayersInsides } from '../BackgroundLayers'
import { SolidLayers, SolidLayersInsides } from '../../../../shared/solidLayers'

export class MapBuilder {
  private game: Game

  constructor(game: Game) {
      this.game = game
  }
  
  public buildMap() {
    const map = []
    const solidLayerAny = SolidLayers as any
    const enumRoomsAny = Rooms as any

    const solidLayerInsidesAny = SolidLayersInsides as any
    const enumRoomsInsidesAny = RoomsInsides as any

    for (const [key, value] of Object.entries(BackgroundLayers)) {
      const roomId = enumRoomsAny[key]
      const backgroundLayer = value
      const solidLayer = solidLayerAny[key]

      map.push(new Room(this.game, roomId, backgroundLayer, solidLayer))
    }

    for (const [key, value] of Object.entries(BackgroundLayersInsides)) {
      const roomId = enumRoomsInsidesAny[key]
      const backgroundLayer = value
      const solidLayer = solidLayerInsidesAny[key]

      map.push(new Room(this.game, roomId, backgroundLayer, solidLayer))
    }

    return map
  }
}
