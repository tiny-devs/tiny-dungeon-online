import { Game } from '../startup/Game'
import { Color } from '../board/map/tiles/Color'
import { Rooms } from '../models/Enums'

export class Npc {
    public id: number
    public roomId: Rooms
    public isFighting: boolean
    public x: number
    public y: number
    public tileMatrix: any[]
    public maxHp: number
    public hp: number

    private game: Game
    private layer: any
    private tileSize: number
    private pveData: any

    constructor(game: Game, layer: any, npcData: Partial<Npc>, npcMatrix: any[]) {
        this.game = game
        this.layer = layer

        this.id = npcData.id!
        this.roomId = npcData.roomId!
        this.x = npcData.x!
        this.y = npcData.y!
        this.tileSize = 8
        this.tileMatrix = [...npcMatrix]
        this.maxHp = npcData.maxHp!
        this.hp = npcData.hp!
        this.isFighting = false
    }

    draw() {
        this.layer.ctx.beginPath()

        for (let column = 0; column < this.tileSize; column++) {
            for (let line = 0; line < this.tileSize; line++) {
                const tileColor = this.tileMatrix[line][column]
                if (tileColor !== 0) {
                    this.layer.ctx.fillStyle = tileColor
                    const startX = ((column * this.game.gridConfig.cellWidth) / this.tileSize + this.x * this.game.gridConfig.cellWidth) | 0
                    const startY = ((line * this.game.gridConfig.cellHeight) / this.tileSize + this.y * this.game.gridConfig.cellHeight) | 0
                    const width = this.game.gridConfig.cellWidth / this.tileSize
                    const height = this.game.gridConfig.cellHeight / this.tileSize
                    this.layer.ctx.fillRect(startX, startY, width, height)
                }
            }
        }

        this.layer.ctx.fill()
    }

    takeDamage(pveData: any) {
        this.pveData = pveData
        this.hp = pveData.npcHp
        this.isFighting = true
        this.drawHp()
        if (this.hp <= 0) {
            this.hp = this.maxHp
            this.isFighting = false
        }

        if (pveData.playerHp <= 1) {
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

        this.layer.ctx.fillText(`${dmgFactor}${this.pveData.damageCaused}`, this.x * this.game.gridConfig.cellWidth + this.game.gridConfig.cellWidth / 2, this.y * this.game.gridConfig.cellHeight - 10)
    }

    move(moveData: any) {
        if (moveData.x != this.x || moveData.y != this.y) {
            this.isFighting = false
        }

        this.x = moveData.x
        this.y = moveData.y
    }

    clear() {
        this.layer.ctx.clearRect(this.x * this.game.gridConfig.cellWidth, this.y * this.game.gridConfig.cellHeight, this.game.gridConfig.cellWidth, this.game.gridConfig.cellHeight)
    }

    destroy() {
        this.clear()
        this.layer = null
        this.id = 0
        this.x = 0
        this.y = 0
    }
}
