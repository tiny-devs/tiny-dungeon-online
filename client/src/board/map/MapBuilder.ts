import { Game } from '../../startup/Game'
import { Rooms } from '../../models/Enums'
import { Room } from './Room'
import { BackgroundLayers } from '../BackgroundLayers'
import { SolidLayers } from '../../../../shared/solidLayers'

export class MapBuilder {
  private game: Game

  constructor(game: Game) {
      this.game = game
  }
  
  public buildMap() {
    const map = []
    const solidLayerAny = SolidLayers as any
    const enumRoomsAny = Rooms as any

    for (const [key, value] of Object.entries(BackgroundLayers)) {
      const roomId = enumRoomsAny[key]
      const backgroundLayer = value
      const solidLayer = solidLayerAny[key]

      map.push(new Room(this.game, roomId, backgroundLayer, solidLayer))
    }

    return map
  }
}
