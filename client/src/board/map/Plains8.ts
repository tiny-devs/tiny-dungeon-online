import { Game } from '../../startup/Game'
import { Rooms } from '../../models/Enums'
import { Tiles } from './tiles/Tiles'
import { SolidLayers } from '../../../../shared/solidLayers'
import { Room } from './Room'

const backgroundLayer = [
  [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainTallGrass2,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainTallGrass,Tiles.PlainGrass2,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.Sand     ],
 [Tiles.PlainFlatGrass,Tiles.PlainGrass2,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.Sand     ],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.Sand     ],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.Sand     ],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.Sand     ,Tiles.Sand     ],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainGrass2,Tiles.PlainFlatGrass,Tiles.Sand     ,Tiles.Sand     ],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.Sand     ,Tiles.Sand     ],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.Sand     ,Tiles.Sand     ,Tiles.Sand     ],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainTallGrass2,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainTallGrass,Tiles.PlainFlatGrass,Tiles.Sand     ,Tiles.Sand     ,Tiles.Sand     ],
 [Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.PlainFlatGrass,Tiles.Sand     ,Tiles.Sand     ,Tiles.Sand     ],
]

export class Plains8 extends Room {
    constructor(game: Game, id: Rooms) {
        super(game, id, backgroundLayer, SolidLayers.Plains8)
    }
}
