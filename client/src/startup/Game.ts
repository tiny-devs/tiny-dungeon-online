import { DimensionsConfig, GridConfig } from '../models/configs'
import { Main } from './Main'
import { BackgroundLayer } from '../board/layers/BackgroundLayer'
import { SolidLayer } from '../board/layers/SolidLayer'
import { SpritesLayer } from '../board/layers/SpritesLayer'
import { Map } from '../board/map/Map'
import { Board } from '../board/Board'
import { Rooms } from '../../../shared/Enums'

export class Game {
    public solidLayer: SolidLayer
    public backgroundLayer: BackgroundLayer
    public gridConfig: GridConfig
    public map: Map
    public spritesLayer: SpritesLayer
    public board: Board

    constructor(gameConfigs: DimensionsConfig, mainElements: Main) {
        this.gridConfig = new GridConfig({
            width: gameConfigs.width,
            height: gameConfigs.height,
            rows: 16,
            columns: 16,
        })

        this.backgroundLayer = new BackgroundLayer(this)
        this.solidLayer = new SolidLayer(this)
        this.spritesLayer = new SpritesLayer(this)

        this.map = new Map(this)
        this.board = new Board(this, this.backgroundLayer)

        if (mainElements.isMobile()) {
            mainElements.mobileControls.style.display = 'block'
        }
    }

    public applyServerRules(serverRules: any) {
        this.gridConfig.rows = serverRules.boardRows
        this.gridConfig.columns = serverRules.boardColumns

        this.board.draw()
        this.map.rooms[Rooms.InitialRoom].draw()
    }
}
