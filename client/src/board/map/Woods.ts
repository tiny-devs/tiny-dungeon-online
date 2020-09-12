import { Game } from '../../startup/Game'
import { Rooms } from '../../models/Enums'
import { Tiles } from './tiles/Tiles'
import { SolidLayers } from '../../../../shared/solidLayers'
import { Room } from './Room'

const backgroundLayer = [
    [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Grass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
    [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
    [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.TallGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Grass],
    [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.TallGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
    [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
    [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Grass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
    [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Grass, Tiles.FlatGrass, Tiles.FlatGrass],
    [Tiles.Dirt, Tiles.Dirt, Tiles.Dirt, Tiles.Dirt, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Rocks, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
    [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Dirt, Tiles.Dirt, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Grass, Tiles.Grass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
    [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Dirt, Tiles.Dirt, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
    [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Dirt, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Grass, Tiles.FlatGrass],
    [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Dirt, Tiles.Dirt, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
    [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Grass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Dirt, Tiles.Dirt, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Grass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
    [Tiles.TallGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.TallGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Dirt, Tiles.FlatGrass, Tiles.Grass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
    [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Dirt, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
    [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.TallGrass, Tiles.Dirt, Tiles.Dirt, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
]

export class Woods extends Room {
    constructor(game: Game, id: Rooms) {
        super(game, id, backgroundLayer, SolidLayers.Woods)
    }
}
