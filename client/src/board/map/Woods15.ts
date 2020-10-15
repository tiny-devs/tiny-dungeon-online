import { Game } from '../../startup/Game'
import { Rooms } from '../../models/Enums'
import { Tiles } from './tiles/Tiles'
import { SolidLayers } from '../../../../shared/solidLayers'
import { Room } from './Room'

const backgroundLayer = [
  [Tiles.FlatGrass,Tiles.Grass2   ,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Dirt     ,Tiles.Rocks2   ,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass],
 [Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Dirt     ,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Grass3   ,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass],
 [Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.TallGrass2,Tiles.FlatGrass,Tiles.Dirt     ,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass],
 [Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Grass3   ,Tiles.Dirt     ,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass],
 [Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Dirt     ,Tiles.Dirt     ,Tiles.TallGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass],
 [Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Grass3   ,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Dirt     ,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass],
 [Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Rocks    ,Tiles.Dirt     ,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Grass2   ,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass],
 [Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Dirt     ,Tiles.Dirt     ,Tiles.Dirt     ,Tiles.Dirt     ,Tiles.Dirt     ,Tiles.TallGrass,Tiles.FlatGrass,Tiles.Grass3   ,Tiles.FlatGrass],
 [Tiles.FlatGrass,Tiles.TallGrass3,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Grass    ,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Dirt     ,Tiles.FlatGrass,Tiles.Grass3   ,Tiles.FlatGrass,Tiles.Dirt     ,Tiles.Dirt     ,Tiles.Dirt     ,Tiles.Dirt     ,Tiles.Dirt     ],
 [Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Dirt     ,Tiles.Rocks2   ,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Rocks2   ,Tiles.FlatGrass],
 [Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Dirt     ,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass],
 [Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Grass2   ,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.TallGrass2,Tiles.Dirt     ,Tiles.Dirt     ,Tiles.FlatGrass,Tiles.Grass2   ,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass],
 [Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Dirt     ,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Grass    ,Tiles.FlatGrass,Tiles.FlatGrass],
 [Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Rocks    ,Tiles.Dirt     ,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass],
 [Tiles.Grass    ,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Dirt     ,Tiles.TallGrass2,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass],
 [Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Dirt     ,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Grass3   ,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass],
]

export class Woods15 extends Room {
    constructor(game: Game, id: Rooms) {
        super(game, id, backgroundLayer, SolidLayers.Woods15)
    }
}