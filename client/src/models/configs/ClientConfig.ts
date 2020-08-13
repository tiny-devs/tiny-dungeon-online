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
