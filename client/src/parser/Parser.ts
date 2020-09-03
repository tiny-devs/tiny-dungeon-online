import { Command } from '../models/Enums'
import { ParseLogin } from './ParseLogin'
import { ParseMove } from './ParseMove'
import { ParseNpcMove } from './ParseNpcMove'
import { ParseNpcsInRoom } from './ParseNpcsInRoom'
import { ParsePve } from './ParsePve'
import { ParseError } from './ParseError'
import { ParseItemPick } from './ParseItemPick'
import { ParseItemDrop } from './ParseItemDrop'
import { ParseItemsInRoom } from './ParseItemsInRoom'
import { ParseItemUse } from './ParseItemUse'
import { ParseItemWear } from './ParseItemWear'
import { ParseItemRemove } from './ParseItemRemove'
import { ParseItemDroped } from './ParseItemDroped'
import { ParseStats } from './ParseStats'
import { Client } from '../startup/Client'
import { Player } from '../entities/Player'
import { ParseMessage } from './ParseMessage'
import { ParseRank } from './ParseRank'
import { ParseDialog } from './ParseDialog'

export class Parser {
    private client: Client

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
                case Command.ItemsInRoom:
                    this.parseItemsInRoom(data)
                    break
                case Command.ItemDrop:
                    this.parseItemDrop(data)
                    break
                case Command.ItemPick:
                    this.parseItemPick(data)
                    break
                case Command.ItemUse:
                    this.parseItemUse(data)
                    break
                case Command.ItemWear:
                    this.parseItemWear(data)
                    break
                case Command.ItemRemove:
                    this.parseItemRemove(data)
                    break
                case Command.ItemDroped:
                    this.parseItemDroped(data)
                    break
                case Command.Stats:
                    this.parseStats(data)
                    break
                case Command.Rank:
                    this.parseRank(data)
                    break
                case Command.Dialog:
                    this.parseDialog(data)
                    break
                case Command.Message:
                    this.parseMessage(data)
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
            this.client.bag.playerId = loginData.playerId
            this.client.gear.playerId = loginData.playerId
            this.client.game.applyServerRules(loginData.serverRules)

            const player = loginData.players.find((p: Player) => p.id == loginData.playerId)
            this.client.applyStats(player.hp, player.maxHp, player.atk, player.def, 1, 0, player.xpNeed)
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

    private parseItemsInRoom(data: string) {
        const itemsData = new ParseItemsInRoom(data)

        this.client.game.spritesLayer.addItems(itemsData.items)
    }

    private parseItemDrop(data: string) {
        const dropData = new ParseItemDrop(data)

        this.client.game.spritesLayer.addItem(dropData)
    }

    private parseItemDroped(data: string) {
        const dropData = new ParseItemDroped(data)

        this.client.bag.removeItem(dropData.itemId)
    }

    private parseItemPick(data: string) {
        const pickData = new ParseItemPick(data)

        this.client.pickItem(pickData)
    }

    private parseItemUse(data: string) {
        const useData = new ParseItemUse(data)

        this.client.bag.removeItem(useData.itemId)
    }

    private parseItemWear(data: string) {
        const wearData = new ParseItemWear(data)

        this.client.bag.removeItem(wearData.itemId)
        this.client.gear.addGear(wearData.itemId, wearData.gearType)
    }

    private parseItemRemove(data: string) {
        const removedData = new ParseItemRemove(data)

        this.client.removedGear(removedData)
        this.client.gear.removeGear(removedData.itemId)
    }

    private parseStats(data: string) {
        const stats = new ParseStats(data)

        this.client.applyStats(stats.hp,
            stats.maxHp,
            stats.attack,
            stats.defense,
            stats.level,
            stats.xp,
            stats.xpNeeded)
    }

    private parseRank(data: string) {
        const rank = new ParseRank(data)

        this.client.updateRank(rank)
    }

    private parseMessage(data: string) {
        const messageData = new ParseMessage(data)

        this.client.displayMessage(messageData.message)
    }

    private parseDialog(data: string) {
        const dialogData = new ParseDialog(data)

        this.client.displayDialog(dialogData.message)
    }
}
