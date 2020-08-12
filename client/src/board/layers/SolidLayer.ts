import { Game } from '../../startup/Game'

export class SolidLayer {
    private game: Game
    private ctx: CanvasRenderingContext2D

    constructor(game: Game) {
        this.game = game

        const canvas = document.getElementById('solid-layer') as HTMLCanvasElement
        this.ctx = canvas.getContext('2d')!
        this.ctx.shadowOffsetX = 0
        this.ctx.shadowOffsetY = 0
        this.ctx.shadowBlur = 0
        this.ctx.shadowColor = ''
        this.ctx.canvas.width = this.game.gridConfig.width
        this.ctx.canvas.height = this.game.gridConfig.height
    }

    public clear() {
        this.ctx.clearRect(0, 0, this.game.gridConfig.width, this.game.gridConfig.height)
    }
}
