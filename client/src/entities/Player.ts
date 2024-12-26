import { Game } from '../startup/Game'
import { SpritesLayer } from '../board/layers/SpritesLayer'
import { Color } from '../board/map/tiles/Color'
import { Rooms, Direction } from '../../../shared/Enums'
import { ParsePve } from '../parser/ParsePve'
import { FreeTiles } from "../../../shared/solidLayers"

export class Player {
    public x: number
    public y: number
    public color: Color
    public name: string
    public id: string
    public currentRoomId: Rooms | null
    public hp: number
    public maxHp: number
    public isFighting: boolean
    public pveData: ParsePve | null = null
    public matrix: any[][]
    public chatMessage: string = ''
    private chatMessageTimeout: number = 0
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
        this.isFighting = false
        this.playerSize = 8
        this.matrix = [...playerData.matrix!]
    }

    draw() {
        this.layer.ctx.beginPath()
        this.layer.ctx.fillStyle = this.color

        for (let column = 0; column < this.playerSize; column++) {
            for (let line = 0; line < this.playerSize; line++) {
                const draw = this.matrix[line][column]
                if (draw != 0) {
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

    takeDamage(pveData: ParsePve) {
        this.pveData = pveData
        this.hp = pveData.playerHp
        this.isFighting = true
        this.drawHp()
        if (this.hp <= 0) {
            this.x = -1
            this.y = -1
            this.hp = this.maxHp
            this.isFighting = false
        }
    }

    drawHp() {
        this.layer.ctx.beginPath()
        this.layer.ctx.fillStyle = Color.DarkRed
        this.layer.ctx.fillRect(this.x * this.game.gridConfig.cellWidth, this.y * this.game.gridConfig.cellHeight - 7, this.game.gridConfig.cellWidth, 5)
        this.layer.ctx.fillStyle = Color.LightGreen4
        this.layer.ctx.fillRect(this.x * this.game.gridConfig.cellWidth, this.y * this.game.gridConfig.cellHeight - 7, (this.game.gridConfig.cellWidth * this.hp) / this.maxHp, 5)
        this.layer.ctx.fill()

        this.drawHit()
    }

    drawChat(message: string) {
        clearTimeout(this.chatMessageTimeout)
        this.chatMessage = message

        const x = this.x * this.game.gridConfig.cellWidth + this.game.gridConfig.cellWidth / 2
        const y = this.y * this.game.gridConfig.cellHeight - 10

        this.layer.ctx.font = '15px arial'
        this.layer.ctx.textAlign = 'center'

        this.layer.ctx.strokeStyle = Color.Black;
        this.layer.ctx.lineWidth = 2;
        this.layer.ctx.strokeText(`${this.chatMessage}`, x, y);
        
        this.layer.ctx.fillStyle = Color.LightYellow
        this.layer.ctx.fillText(`${this.chatMessage}`, x, y)

        this.chatMessageTimeout = window.setTimeout(() => {
            this.chatMessage = ''
        }, 5000)
    }

    drawChatMessage() {
        const x = this.x * this.game.gridConfig.cellWidth + this.game.gridConfig.cellWidth / 2
        const y = this.y * this.game.gridConfig.cellHeight - 10

        this.layer.ctx.font = '15px arial'
        this.layer.ctx.textAlign = 'center'

        this.layer.ctx.strokeStyle = Color.Black;
        this.layer.ctx.lineWidth = 2;
        this.layer.ctx.strokeText(`${this.chatMessage}`, x, y);
        
        this.layer.ctx.fillStyle = Color.LightYellow
        this.layer.ctx.fillText(`${this.chatMessage}`, x, y)
    }

    drawHit() {
        if (this.pveData) {
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
    }

    move(x: number, y: number, currentRoomId: Rooms | null) {
        if (x != this.x || y != this.y) {
            this.isFighting = false
        }

        this.x = x
        this.y = y
        this.currentRoomId = currentRoomId
    }

    isValidMove(direction: Direction, collisionShape: any[][]) {
        let valid = true
        const nextPosition = this.getNextPositionFromDirection(direction)
        if (!this.isOnBorder(collisionShape, direction)) {

            const nextTile = collisionShape[nextPosition.y][nextPosition.x]
            if (!FreeTiles.some(x => x == nextTile)) {
                valid = false
            }
        }

        return valid
    }

    isOnBorder(collisionShape: any[][], direction: Direction, step: number = 1) {
        let onBorder = false
        const nextPosition = this.getNextPositionFromDirection(direction, step)
        if (collisionShape[nextPosition.y] !== undefined) {
            if (collisionShape[nextPosition.y][nextPosition.x] === undefined) {
                onBorder = true
            }
        } else {
            onBorder = true
        }
        return onBorder
    }

    isOnMapLimit(direction: Direction, step: number = 1): boolean {
        if (this.currentRoomId == null) {
            return true
        }

        const nextPosition = this.getNextPositionFromDirection(direction, step)
        const roomsWithNoNorth = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        const roomsWithNoSouth = [90, 91, 92, 93, 94, 95, 96, 97, 98, 99]
        const roomsWithNoWest = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]
        const roomsWithNoEast = [9, 19, 29, 39, 49, 59, 69, 79, 89, 99]
        if (nextPosition.x < 0 && roomsWithNoWest.includes(this.currentRoomId)) {
            return true
        }
        if (nextPosition.x > 15 && roomsWithNoEast.includes(this.currentRoomId)) {
            return true
        }
        if (nextPosition.y < 0 && roomsWithNoNorth.includes(this.currentRoomId)) {
            return true
        }
        if (nextPosition.y > 15 && roomsWithNoSouth.includes(this.currentRoomId)) {
            return true
        }
        return false
    }

    private getNextPositionFromDirection(direction: Direction, step: number = 1): {x:number, y:number} {
        let position = {x: this.x, y: this.y}
        switch (direction) {
            case Direction.Up:
                position = {x: +this.x, y: +this.y - step}
                break
            case Direction.Down:
                position = {x: +this.x, y: +this.y + step}
                break
            case Direction.Left:
                position = {x: +this.x - step, y: +this.y}
                break
            case Direction.Right:
                position = {x: +this.x + step, y: +this.y}
                break
        }
        return position
    }
}
