import { Game } from '../../startup/Game.ts'
import { Player } from '../../entities/Player.ts'
import { Npc } from '../../entities/Npc.ts'
import { Rooms } from '../../models/Enums.ts'
import { Npcs } from '../../entities/Npcs.ts'

export class SpritesLayer {
    public ctx: CanvasRenderingContext2D
    public players: Player[]

    private game: Game
    private playerListElement: HTMLElement
    private npcs: Npc[]

    constructor(game: Game) {
        this.game = game

        this.playerListElement = document.getElementById('player-list')!
        const canvas = document.getElementById('sprites-layer') as HTMLCanvasElement
        this.ctx = canvas.getContext('2d')!
        this.ctx.shadowOffsetX = 0
        this.ctx.shadowOffsetY = 0
        this.ctx.shadowBlur = 0
        this.ctx.shadowColor = ''
        this.ctx.canvas.width = this.game.gridConfig.width
        this.ctx.canvas.height = this.game.gridConfig.height

        this.players = []
        this.npcs = []
    }

    draw(clientRoomId: any) {
        this.ctx.clearRect(0, 0, this.game.gridConfig.width, this.game.gridConfig.height)
        this.drawPlayers(clientRoomId)
        this.drawNpcs(clientRoomId)
    }

    public clear() {
        this.ctx.clearRect(0, 0, this.game.gridConfig.width, this.game.gridConfig.height)
    }

    addPlayers(players: any[]) {
        this.players.splice(0, this.players.length)
        for (const player of players) {
            this.players.push(new Player(this.game, player, this))
        }
    }

    addNpcs(npcs: any[]) {
        this.npcs.splice(0, this.npcs.length)
        for (const npc of npcs) {
            this.npcs.push(new Npc(this.game, this, npc, this.getMatrixNpcById(npc.npcId)))
        }
    }

    drawPlayers(clientRoomId: any) {
        while (this.playerListElement.firstChild) {
            this.playerListElement.removeChild(this.playerListElement.firstChild)
        }

        this.players.forEach((player) => {
            const li = document.createElement('li')
            li.appendChild(document.createTextNode(player.name))
            li.style.color = player.color
            this.playerListElement.appendChild(li)

            if (player.currentRoomId == clientRoomId) {
                player.draw()
                if (player.isFighting) {
                    player.drawHp()
                }
            }
        })
    }

    drawNpcs(clientRoomId: Rooms) {
        this.npcs.forEach((npc) => {
            if (npc.roomId == clientRoomId) {
                npc.draw()
                if (npc.isFighting) {
                    npc.drawHp()
                }
            }
        })
    }

    getPlayerById(id: number) {
        return this.players.find((x) => x.id === id)
    }

    getNpcByIdAndRoom(id: number, roomId: Rooms) {
        return this.npcs.find((x) => x.id === +id && x.roomId === +roomId)
    }

    getMatrixNpcById(npcId: number) {
        let npcMatrix = Npcs[Object.keys(Npcs)[npcId - 1]] as any
        if (!npcMatrix) {
            console.log('No sprite defined')
        }

        return npcMatrix
    }
}
