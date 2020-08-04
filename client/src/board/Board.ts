import { Game } from '../startup/Game.ts'

export class Board {
    private game: Game
    private layer: any

    constructor(game: Game, layer: any) {
        this.game = game
        this.layer = layer
    }

    public draw() {
        this.layer.clear()
        this.layer.ctx.beginPath()
        this.layer.ctx.rect(0, 0, this.game.gridConfig.width, this.game.gridConfig.height)
        this.layer.ctx.stroke()
    }
}
