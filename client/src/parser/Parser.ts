import { Command } from '../models/Enums'
import { ParseLogin } from './ParseLogin'
import { ParseMove } from './ParseMove'
import { ParseNpcMove } from './ParseNpcMove'
import { ParseNpcsInRoom } from './ParseNpcsInRoom'
import { ParsePve } from './ParsePve'
import { ParseError } from './ParseError'

export class Parser {
    private client: any

    constructor(client: any) {
        this.client = client
    }

    public parse(data: string) {
        try {
            const command = +data.split(',')[0]

            switch (command) {
                case Command.Login:
                    this.parseLogin(data)
                    break
                case Command.Move:
                    this.parseMove(data)
                    break
                case Command.NpcsInRoom:
                    this.parseNpcsInRoom(data)
                    break
                case Command.NpcMove:
                    this.parseNpcMove(data)
                    break
                case Command.Pve:
                    this.parsePve(data)
                    break
                case Command.Error:
                    this.parseError(data)
                    break
            }
        } catch (e) {
            console.log(e)
        }
    }

    private parseLogin(data: string) {
        const loginData = new ParseLogin(data)

        this.client.game.spritesLayer.addPlayers(loginData.players)
        if (this.client.loggedIn === false) {
            this.client.loggedIn = true
            this.client.playerId = loginData.playerId
            this.client.game.applyServerRules(loginData.serverRules)
        }
        this.client.drawSprites()
    }

    private parseMove(data: string) {
        const moveData = new ParseMove(data)

        this.client.updatePlayer(moveData)
    }

    private parseNpcMove(data: string) {
        const npcMoveData = new ParseNpcMove(data)

        this.client.updateNpc(npcMoveData)
    }

    private parseNpcsInRoom(data: string) {
        const npcsInRoomData = new ParseNpcsInRoom(data)

        this.client.game.spritesLayer.addNpcs(npcsInRoomData.npcs)
        this.client.drawSprites()
    }

    private parsePve(data: string) {
        const pveData = new ParsePve(data)

        this.client.drawPve(pveData)
    }

    private parseError(data: string) {
        const errorData = new ParseError(data)

        if (!confirm(errorData.message)) {
            window.location.reload()
        }
    }
}
