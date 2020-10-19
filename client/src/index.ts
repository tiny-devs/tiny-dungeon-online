import { Main } from './startup/Main'
import { ClientConfig, GridConfig } from './models/configs'

const gameConfig: ClientConfig = {
    game: {
        width: 512,
        height: 512,
    },
    drawingGrid: new GridConfig({
        width: 160,
        height: 160,
        rows: 8,
        columns: 8,
    }),
}

new Main(gameConfig)
