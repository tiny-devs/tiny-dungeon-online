import { Game } from '../../startup/Game'
import { Rooms } from '../../models/Enums'
import { Tiles } from './tiles/Tiles'
import { SolidLayers } from '../../../../shared/solidLayers'
import { Room } from './Room'

const backgroundLayer = [
  [Tiles.Grass    ,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Grass2   ,Tiles.FlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.TallGrass2,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass],
 [Tiles.FlatGrass,Tiles.FlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Grass    ,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.FlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainTallGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainTallGrass2,Tiles.PlainFlatGrass,Tiles.PlainGrass2,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainTallGrass2,Tiles.PlainGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.FlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainGrass2,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.FlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.FlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainTallGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.PlainFlatGrass,Tiles.Rocks2   ,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainGrass2,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainTallGrass2,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
]

export class River7 extends Room {
    constructor(game: Game, id: Rooms) {
        super(game, id, backgroundLayer, SolidLayers.River7)
    }
}
