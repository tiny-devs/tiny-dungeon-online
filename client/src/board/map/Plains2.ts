import { Game } from '../../startup/Game'
import { Rooms } from '../../models/Enums'
import { Tiles } from './tiles/Tiles'
import { SolidLayers } from '../../../../shared/solidLayers'
import { Room } from './Room'

const backgroundLayer = [
  [Tiles.FlatGrass,Tiles.FlatGrass,Tiles.PlainGrass2,Tiles.FlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.FlatGrass,Tiles.Grass2   ,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.PlainFlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainGrass2,Tiles.PlainFlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.FlatGrass,Tiles.PlainFlatGrass],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainGrass,Tiles.PlainTallGrass2,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainGrass2,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainTallGrass,Tiles.PlainGrass2,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainGrass2,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainTallGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.PlainFlatGrass,Tiles.PlainGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainGrass2,Tiles.PlainFlatGrass],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
]

export class Plains2 extends Room {
    constructor(game: Game, id: Rooms) {
        super(game, id, backgroundLayer, SolidLayers.Plains2)
    }
}
