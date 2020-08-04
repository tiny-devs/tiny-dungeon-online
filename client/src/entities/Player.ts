import { Game } from '../startup/Game.ts'
import { SpritesLayer } from '../board/layers/SpritesLayer.ts'
import { Color } from '../board/map/tiles/Color.ts'
import { Rooms, Direction } from '../models/Enums.ts'

export class Player {
    public x: number
    public y: number
    public color: Color
    public name: string
    public id: number
    public currentRoomId: Rooms
    public hp: number
    public maxHp: number
    public isFighting: boolean
    public pveData: any
    public playerMatrix: any[][]

    private game: Game
    private layer: SpritesLayer
    private playerSize: number

    constructor(game: Game, playerData: Partial<Player>, layer: SpritesLayer) {
        this.game = game
        this.layer = layer

        this.x = playerData.x!
        this.y = playerData.y!
        this.color = playerData.color!
        this.name = playerData.name!
        this.id = playerData.id!
        this.currentRoomId = playerData.currentRoomId!
        this.hp = playerData.hp!
        this.maxHp = playerData.maxHp!
        this.pveData = playerData.pveData!
        this.isFighting = playerData.isFighting!
        this.playerSize = 8
        this.playerMatrix = [...playerData.playerMatrix!]
    }

    draw() {
        this.layer.ctx.beginPath()
        this.layer.ctx.fillStyle = this.color

        for (let column = 0; column < this.playerSize; column++) {
            for (let line = 0; line < this.playerSize; line++) {
                const draw = this.playerMatrix[line][column]
                if (draw) {
                    const startX = ((column * this.game.gridConfig.cellWidth) / this.playerSize + this.x * this.game.gridConfig.cellWidth) | 0
                    const startY = ((line * this.game.gridConfig.cellHeight) / this.playerSize + this.y * this.game.gridConfig.cellHeight) | 0
                    const width = this.game.gridConfig.cellWidth / this.playerSize
                    const height = this.game.gridConfig.cellHeight / this.playerSize
                    this.layer.ctx.fillRect(startX, startY, width, height)
                }
            }
        }

        this.layer.ctx.fill()
    }

    takeDamage(pveData: any) {
        this.pveData = pveData
        this.hp = pveData.playerHp
        this.isFighting = true
        this.drawHp()
        if (this.hp <= 0) {
            this.hp = this.maxHp
            this.isFighting = false
        }

        if (pveData.npcHp <= 1) {
            this.isFighting = false
        }
    }

    drawHp() {
        this.layer.ctx.beginPath()
        this.layer.ctx.fillStyle = Color.Red
        this.layer.ctx.fillRect(this.x * this.game.gridConfig.cellWidth, this.y * this.game.gridConfig.cellHeight - 7, this.game.gridConfig.cellWidth, 5)
        this.layer.ctx.fillStyle = Color.DarkGreen
        this.layer.ctx.fillRect(this.x * this.game.gridConfig.cellWidth, this.y * this.game.gridConfig.cellHeight - 7, (this.game.gridConfig.cellWidth * this.hp) / this.maxHp, 5)
        this.layer.ctx.fill()

        this.drawHit()
    }

    drawHit() {
        let dmgFactor = ''
        this.layer.ctx.font = '15px arial'
        this.layer.ctx.textAlign = 'center'
        if (this.pveData.damageCaused == 0) {
            this.layer.ctx.fillStyle = Color.Blue
        } else {
            this.layer.ctx.fillStyle = Color.Red
            dmgFactor = '-'
        }

        const x = this.x * this.game.gridConfig.cellWidth + this.game.gridConfig.cellWidth / 2
        const y = this.y * this.game.gridConfig.cellHeight - 10
        this.layer.ctx.fillText(`${dmgFactor}${this.pveData.damageCaused}`, x, y)
    }

    move(x: number, y: number, currentRoomId: Rooms) {
        if (x != this.x || y != this.y) {
            this.isFighting = false
        }

        this.x = x
        this.y = y
        this.currentRoomId = currentRoomId
    }

    isValidMove(direction: Direction, collisionShape: any[][]) {
        let valid = true
        switch (direction) {
            case Direction.Up:
                if (!this.isOnBorder(collisionShape, +this.x, +this.y - 1)) {
                    if (collisionShape[+this.y - 1][+this.x]) {
                        valid = false
                    }
                }
                break
            case Direction.Down:
                if (!this.isOnBorder(collisionShape, +this.x, +this.y + 1)) {
                    if (collisionShape[+this.y + 1][+this.x]) {
                        valid = false
                    }
                }
                break
            case Direction.Left:
                if (!this.isOnBorder(collisionShape, +this.x - 1, +this.y)) {
                    if (collisionShape[+this.y][+this.x - 1]) {
                        valid = false
                    }
                }
                break
            case Direction.Right:
                if (!this.isOnBorder(collisionShape, +this.x + 1, +this.y)) {
                    if (collisionShape[+this.y][+this.x + 1]) {
                        valid = false
                    }
                }
                break
        }

        return valid
    }

    isOnBorder(collisionShape: any[][], x: number, y: number) {
        let onBorder = false
        if (collisionShape[y] !== undefined) {
            if (collisionShape[y][x] === undefined) {
                onBorder = true
            }
        } else {
            onBorder = true
        }
        return onBorder
    }
}