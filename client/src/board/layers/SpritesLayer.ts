import { Game } from '../../startup/Game'
import { Player } from '../../entities/Player'
import { Npc } from '../../entities/Npc'
import { Rooms, ItemsIds } from '../../models/Enums'
import { Npcs } from '../../entities/Npcs'
import { Item } from '../../entities/items/Item'
import { Items } from '../../entities/items/Items'
import { Color } from '../map/tiles/Color'

export class SpritesLayer {
    public ctx: CanvasRenderingContext2D
    public players: Player[]
    public playerHasBeenSaved: boolean = false

    private game: Game
    private playerListElement: HTMLElement
    private npcs: Npc[]
    private items: any[]
    private playerSavedTimeout: number = 0

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
        this.items = []
    }

    draw(clientRoomId: any) {
        this.ctx.clearRect(0, 0, this.game.gridConfig.width, this.game.gridConfig.height)
        this.drawItems(clientRoomId)
        this.drawNpcs(clientRoomId)
        this.drawPlayers(clientRoomId)
        if (this.playerHasBeenSaved) {
            this.displayPlayerSavedMessage()
        }
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

    addItems(items: any[]) {
        this.items.splice(0, this.items.length)
        for (const item of items) {
            this.items.push(new Item(this.game, this, item, this.getMatrixItemById(item.itemId)))
        }
    }

    addItem(item: any) {
        this.items.push(new Item(this.game, this, item, this.getMatrixItemById(item.itemId)))
    }

    removeItem(itemRemoved: any) {
        const index = this.items.findIndex(item => item.x == itemRemoved.x && item.y == itemRemoved.y)
        if (index > -1) {
            this.items.splice(index, 1);
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
            li.style.textShadow = `1px 1px 2px white`
            this.playerListElement.appendChild(li)

            if (player.currentRoomId == clientRoomId) {
                player.draw()
                if (player.isFighting) {
                    player.drawHp()
                }

                if (player.chatMessage !== '') {
                    player.drawChatMessage()
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

    drawItems(clientRoomId: Rooms) {
        this.items.forEach((item) => {
            if (item.roomId == clientRoomId) {
                item.draw()
            }
        })
    }

    displayPlayerSaved() {
        clearTimeout(this.playerSavedTimeout)
        this.playerHasBeenSaved = true
        this.ctx.font = '20px arial';
        this.ctx.textAlign = 'left'
        this.ctx.fillStyle = Color.LightGreen3
        this.ctx.fillText("Player saved", 5, 15);
        this.playerSavedTimeout = setTimeout(() => {
            this.playerHasBeenSaved = false
        }, 5000)
    }

    displayPlayerSavedMessage() {
        this.ctx.font = '20px arial'
        this.ctx.textAlign = 'left'
        this.ctx.fillStyle = Color.LightGreen
        this.ctx.fillText("Player saved", 5, 15)
    }

    updatePlayerId(oldId: string, newId: string) {
        const index = this.players.findIndex((x) => x.id === oldId)
        if (index != -1) {
            this.players[index].id = newId
        }
    }

    getPlayerById(id: string) {
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

    getMatrixItemById(itemId: ItemsIds) {
        let keyOfItemId = ItemsIds[itemId]
        let items = Items as any
        return items[keyOfItemId]
    }
}
