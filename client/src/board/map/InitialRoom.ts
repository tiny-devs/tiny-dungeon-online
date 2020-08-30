import { Game } from '../../startup/Game'
import { Rooms } from '../../models/Enums'
import { Tiles } from './tiles/Tiles'
import { SolidLayers } from '../../../../shared/solidLayers'
import { Room } from './Room'

const backgroundLayer = [
    [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
    [Tiles.FlatGrass, Tiles.Bush, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
    [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Grass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Bush, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Grass, Tiles.FlatGrass],
    [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Grass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
    [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Grass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Grass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Bush, Tiles.Rocks, Tiles.FlatGrass, Tiles.FlatGrass],
    [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Grass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
    [Tiles.FlatGrass, Tiles.Grass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Grass, Tiles.FlatGrass, Tiles.FlatGrass],
    [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Bush, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Dirt, Tiles.Dirt],
    [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Rocks, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Rocks, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
    [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Grass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
    [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Grass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Bush, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
    [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
    [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Bush, Tiles.Grass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Grass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
    [Tiles.FlatGrass, Tiles.Bush, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
    [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
    [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
]

export class InitialRoom extends Room {
    constructor(game: Game, id: Rooms) {
        super(game, id, backgroundLayer, SolidLayers.InitialRoom)
    }
}
