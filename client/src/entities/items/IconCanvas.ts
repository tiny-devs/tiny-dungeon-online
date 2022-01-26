export default class IconCanvas {
    public c: HTMLCanvasElement
    public ctx: CanvasRenderingContext2D
    public width: number = 32
    public height: number = 32
    public boardRows: number = 1
    public boardColumns: number = 1
    public cellWidth: number
    public cellHeight: number
    public canvasId: string

    constructor(canvasId: string) { 
        this.canvasId = canvasId
        this.c = document.getElementById(canvasId) as HTMLCanvasElement
        this.ctx = this.c.getContext('2d')!
        this.ctx.canvas.width = this.width
        this.ctx.canvas.height = this.height
        this.boardRows = 1
        this.boardColumns = 1
        this.ctx.canvas.width  = this.width
        this.ctx.canvas.height = this.height
        this.cellWidth = this.width/this.boardRows
        this.cellHeight = this.height/this.boardColumns
        this.c.oncontextmenu = (e) => {return false}
    }
}