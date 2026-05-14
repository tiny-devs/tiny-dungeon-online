import { Game } from '../../startup/Game'
import { Direction, Rooms } from '../../../../shared/Enums'
import { SolidTiles } from './tiles/Tiles'
import { Tile } from './tiles/Tile'
import { Color } from './tiles/Color'

export class Room {
    public id: Rooms
    public backgroundLayerShape: Color[][][][]
    public solidLayerShape: (number | (number | Color)[][])[][]
    public tiles: Tile[]
    private backgroundBuffer: HTMLCanvasElement | null
    private solidBuffer: HTMLCanvasElement | null

    private game: Game

    constructor(game: Game, id: Rooms, backgroundLayer: Color[][][][], solidLayer: (number | (number | Color)[][])[][]) {
        this.game = game
        this.id = id

        this.backgroundLayerShape = backgroundLayer
        this.solidLayerShape = solidLayer
        this.tiles = []
        this.backgroundBuffer = null
        this.solidBuffer = null

        this.initTiles()
    }

    initTiles() {
        for (let column = 0; column < this.game.gridConfig.columns; column++) {
            const columnTiles = []

            for (let line = 0; line < this.game.gridConfig.rows; line++) {
                let backTile: Tile | null = null
                let solidTile: Tile | null = null

                const tileToDrawBackground = this.backgroundLayerShape[line][column] as any
                if (tileToDrawBackground != 0) {
                    backTile = new Tile(this.game, this.game.backgroundLayer, column, line, tileToDrawBackground)
                    this.tiles.push(backTile)
                }

                const tileToDraw = this.solidLayerShape[line][column] as number
                if (tileToDraw != 0 && tileToDraw != -1) {
                    const tiles = SolidTiles as any
                    const tile = tiles[Object.keys(SolidTiles)[tileToDraw-1]]

                    solidTile = new Tile(this.game, this.game.solidLayer, column, line, tile)
                    this.tiles.push(solidTile)
                }

                if (backTile != null) {
                    columnTiles.push(backTile)
                }
                if (solidTile != null) {
                    columnTiles.push(solidTile)
                }
                
            }
        }
    }

    async draw(lastRoom: Room | undefined = undefined, direction: Direction = 0, isMobile = false) {
        this.ensureBuffers()

        if (lastRoom && direction != Direction.None) {
            lastRoom.ensureBuffers()
            await this.animateRoomTransition(lastRoom, direction, isMobile)
        }
        else {
            this.drawBuffers()
        }
    }

    private ensureBuffers() {
        if (!this.backgroundBuffer) {
            this.backgroundBuffer = this.createLayerBuffer(this.backgroundLayerShape, this.game.backgroundLayer)
        }

        if (!this.solidBuffer) {
            this.solidBuffer = this.createLayerBuffer(this.solidLayerShape, this.game.solidLayer)
        }
    }

    private createLayerBuffer(layerShape: any[][], targetLayer: { ctx: CanvasRenderingContext2D }) {
        const canvas = document.createElement('canvas')
        canvas.width = this.game.gridConfig.width
        canvas.height = this.game.gridConfig.height

        const ctx = canvas.getContext('2d')!
        ctx.imageSmoothingEnabled = false

        for (let column = 0; column < this.game.gridConfig.columns; column++) {
            for (let line = 0; line < this.game.gridConfig.rows; line++) {
                const tileToDraw = layerShape[line][column] as any
                if (tileToDraw != 0 && tileToDraw != -1) {
                    new Tile(this.game, { ctx }, column, line, this.resolveTileMatrix(tileToDraw, targetLayer)).draw()
                }
            }
        }

        return canvas
    }

    private resolveTileMatrix(tileToDraw: any, targetLayer: { ctx: CanvasRenderingContext2D }) {
        if (targetLayer === this.game.solidLayer) {
            const tiles = SolidTiles as any
            return tiles[Object.keys(SolidTiles)[tileToDraw - 1]]
        }

        return tileToDraw
    }

    private async animateRoomTransition(lastRoom: Room, direction: Direction, isMobile: boolean) {
        const axis = this.getTransitionAxis(direction)
        const distance = axis.x !== 0 ? this.game.gridConfig.width : this.game.gridConfig.height
        const duration = 520
        const backgroundCtx = this.game.backgroundLayer.ctx
        const solidCtx = this.game.solidLayer.ctx

        backgroundCtx.imageSmoothingEnabled = false
        solidCtx.imageSmoothingEnabled = false

        await new Promise<void>((resolve) => {
            const startTime = performance.now()

            const renderFrame = (now: number) => {
                const elapsed = now - startTime
                const progress = Math.min(elapsed / duration, 1)
                const easedProgress = this.easeOutCubic(progress)
                const lastRoomOffset = -distance * easedProgress
                const currentRoomOffset = distance * (1 - easedProgress)

                this.clear()
                this.drawTransitionFrame(lastRoom, backgroundCtx, axis, lastRoomOffset, currentRoomOffset, 'backgroundBuffer')
                this.drawTransitionFrame(lastRoom, solidCtx, axis, lastRoomOffset, currentRoomOffset, 'solidBuffer')

                if (progress < 1) {
                    requestAnimationFrame(renderFrame)
                    return
                }

                this.drawBuffers()
                resolve()
            }

            requestAnimationFrame(renderFrame)
        })
    }

    private drawTransitionFrame(
        lastRoom: Room,
        ctx: CanvasRenderingContext2D,
        axis: { x: number, y: number },
        lastRoomOffset: number,
        currentRoomOffset: number,
        bufferKey: 'backgroundBuffer' | 'solidBuffer'
    ) {
        const lastBuffer = lastRoom[bufferKey]
        const currentBuffer = this[bufferKey]

        if (lastBuffer) {
            ctx.drawImage(lastBuffer, Math.round(axis.x * lastRoomOffset), Math.round(axis.y * lastRoomOffset))
        }

        if (currentBuffer) {
            ctx.drawImage(currentBuffer, Math.round(axis.x * currentRoomOffset), Math.round(axis.y * currentRoomOffset))
        }
    }

    private getTransitionAxis(direction: Direction) {
        if (direction == Direction.Left) {
            return { x: -1, y: 0 }
        }

        if (direction == Direction.Up) {
            return { x: 0, y: 1 }
        }

        if (direction == Direction.Down) {
            return { x: 0, y: -1 }
        }

        return { x: 1, y: 0 }
    }

    private drawBuffers() {
        this.clear()

        if (this.backgroundBuffer) {
            this.game.backgroundLayer.ctx.imageSmoothingEnabled = false
            this.game.backgroundLayer.ctx.drawImage(this.backgroundBuffer, 0, 0)
        }

        if (this.solidBuffer) {
            this.game.solidLayer.ctx.imageSmoothingEnabled = false
            this.game.solidLayer.ctx.drawImage(this.solidBuffer, 0, 0)
        }
    }

    private easeOutCubic(progress: number) {
        return 1 - Math.pow(1 - progress, 3)
    }

    clear() {
        this.game.backgroundLayer.clear()
        this.game.solidLayer.clear()
    }
}
