import IconCanvas from "../../entities/items/IconCanvas"

export class ClientConfig {
    public game = new DimensionsConfig()
    public drawingGrid = new GridConfig()
}

export class DimensionsConfig {
    public width = 0
    public height = 0
}

export class GridConfig {
    public width = 0
    public height = 0
    public rows = 0
    public columns = 0

    constructor(init?: Partial<GridConfig>) {
        Object.assign(this, init)
    }

    public get cellWidth(): number {
        return this.width / this.rows
    }

    public get cellHeight(): number {
        return this.height / this.columns
    }
}

export default class TinyIcon {
    public matrix: any
    public tileSize: number = 8
    public layer: IconCanvas
    public defaultColor: string

    constructor(matrix: any, canvasId: string, defaultColor: string) {
        this.defaultColor = defaultColor
        this.matrix = matrix
        this.layer = new IconCanvas(canvasId)
        this.draw()
    }

    draw() {
        this.layer.ctx.beginPath();

        for (let column = 0; column < this.tileSize; column++) {
            for (let line = 0; line < this.tileSize; line++) {
                const tileColor = this.matrix[line][column]
                if (tileColor !== 0) {
                    this.layer.ctx.fillStyle = this.defaultColor ? this.defaultColor : tileColor
                    const startX = (column * this.layer.cellWidth / this.tileSize) | 0
                    const startY = (line * this.layer.cellHeight / this.tileSize) | 0
                    const width = (this.layer.cellWidth / this.tileSize)
                    const height = (this.layer.cellHeight / this.tileSize)
                    this.layer.ctx.fillRect(startX, startY, width, height)
                }
            }
        }

        this.layer.ctx.fill()
    }

    clear() {
        this.layer.ctx.clearRect(0, 0, this.layer.cellWidth, this.layer.cellHeight)
    }

    destroy() {
        this.layer = null!
        this.draw = null!
    }
}