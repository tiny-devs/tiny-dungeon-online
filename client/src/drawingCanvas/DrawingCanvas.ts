import { GridConfig } from '../models/configs'

export class DrawingCanvas {
    private ctx: CanvasRenderingContext2D
    private config: GridConfig

    private drawing: boolean
    private erasing: boolean
    public drawingMatrix: number[][]

    constructor(config: GridConfig) {
        this.config = config

        const canvas = document.getElementById('draw') as HTMLCanvasElement
        canvas.onmousemove = this.mouseMove.bind(this)
        canvas.onmousedown = this.mouseClick.bind(this)
        canvas.onmouseup = this.mouseClick.bind(this)
        canvas.ontouchmove = this.mouseMove.bind(this)
        canvas.ontouchstart = this.mouseClick.bind(this)
        canvas.ontouchend = this.mouseClick.bind(this)
        canvas.oncontextmenu = () => false

        this.ctx = canvas.getContext('2d')!
        this.ctx.canvas.width = config.width
        this.ctx.canvas.height = config.height

        this.drawing = false
        this.erasing = false

        this.drawingMatrix = this.getInitDrawingMatrix()
    }

    private mouseMove(e: MouseEvent | TouchEvent) {
        e = e || window.event

        let pos = this.getOffset(e)

        if (this.drawing || this.erasing) {
            this.draw(pos.x, pos.y)
        }
    }

    private mouseClick(e: any) {
        e = e || window.event

        let pos = this.getOffset(e)

        if (
            e.type === 'mousedown' ||
            e.type === 'touchstart' ||
            e.type === 'touchmove'
        ) {
            if (e.type === 'mousedown') {
                if (e.button == 0) {
                    this.drawing = true
                    this.erasing = false
                } else if (e.button == 2) {
                    this.erasing = true
                    this.drawing = false
                }
            } else {
                this.drawing = true
                this.erasing = false
            }

            this.draw(pos.x, pos.y)
        } else {
            this.drawing = false
            this.erasing = false
        }
    }

    private getOffset(e: MouseEvent | TouchEvent) {
        let clientX = 0
        let clientY = 0
        if (e instanceof TouchEvent) {
            if (e.touches.length > 0) {
                clientX = e.touches[0].clientX
                clientY = e.touches[0].clientY
            }
        } else {
            clientX = e.clientX
            clientY = e.clientY
        }

        const target = <HTMLElement>e.target || e.srcElement,
            rect = target.getBoundingClientRect(),
            offsetX = clientX - rect.left,
            offsetY = clientY - rect.top

        return { x: offsetX | 0, y: offsetY | 0 }
    }

    private draw(x: number, y: number) {
        x = Math.floor(x / this.config.cellWidth)
        y = Math.floor(y / this.config.cellHeight)
        let color = 'black'
        let matrixValue = 1

        if (this.erasing) {
            color = 'white'
            matrixValue = 0
        }

        this.ctx.beginPath()
        this.ctx.rect(
            x * this.config.cellWidth,
            y * this.config.cellHeight,
            this.config.cellWidth,
            this.config.cellHeight
        )
        this.ctx.fillStyle = color
        this.ctx.fill()
        this.ctx.stroke()

        this.drawingMatrix[y][x] = matrixValue
    }

    private drawGrid() {
        for (let i = 0; i < this.config.rows; i++) {
            for (let j = 0; j < this.config.columns; j++) {
                this.ctx.beginPath()
                this.ctx.rect(
                    i * this.config.cellWidth,
                    j * this.config.cellHeight,
                    this.config.cellWidth,
                    this.config.cellHeight
                )
                this.ctx.stroke()
            }
        }
    }

    public reset() {
        this.drawingMatrix.length = 0
        this.ctx.clearRect(0, 0, this.config.width, this.config.height)
        this.drawGrid()
        this.drawingMatrix = this.getInitDrawingMatrix()
    }

    private getInitDrawingMatrix(): number[][] {
        return Array(this.config.rows).fill(Array(this.config.columns).fill(0))
    }
}
