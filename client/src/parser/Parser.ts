import { Command } from '../../../shared/Enums'
import { ParseLogin, PlayerDto } from './ParseLogin'
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
import { GameClient } from '../startup/GameClient'
import { Player } from '../entities/Player'
import { ParseMessage } from './ParseMessage'
import { ParseRank } from './ParseRank'
import { ParseDialog } from './ParseDialog'
import { ParseChat } from './ParseChat'
import { ParseSave } from './ParseSave'
import { ParseLoad } from './ParseLoad'
import { ParsePlayerIdUpdate } from './ParsePlayerIdUpdate'
import { ParseLoadBag } from './ParseLoadBag'
import { ParseEntityInfo } from './ParseEntityInfo'
import { ParseHidePlayer } from './ParseHidePlayer'
import { ParsePlayersInRoom } from './ParsePlayersInRoom'
import { ParseOpenStore } from './ParseOpenStore'
import { ParseStoreItems } from './ParseStoreItems'
import { ParseBoughtItem } from './ParseBoughtItem'
import { ParsePlayerSellItems } from './ParsePlayerSellItems'
import { ParseSoldPlayerItem } from './ParseSoldPlayerItem'
import { ParseGoldDroped } from './ParseGoldDroped'

export class Parser {
    private client: GameClient

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
                case Command.HidePlayer:
                    this.parseHide(data)
                    break
                case Command.PlayersInRoom:
                    this.parsePlayersInRoom(data)
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
                case Command.GoldDroped:
                    this.parseGoldDroped(data)
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
                case Command.Chat:
                    this.parseChat(data)
                    break
                case Command.Save:
                    this.parseSave(data)
                    break
                case Command.Load:
                    this.parseLoad(data)
                    break
                case Command.UpdatePlayerId:
                    this.parseIdUpdate(data)
                    break
                case Command.Exit:
                    this.parseExit(data)
                    break
                case Command.LoadBag:
                    this.parseLoadBag(data)
                    break
                case Command.EntityInfo:
                    this.parseEntityInformation(data)
                    break
                case Command.OpenStore:
                    this.parseOpenStore(data)
                    break
                case Command.GetItemsStore:
                    this.parseShowStoreItems(data)
                    break
                case Command.GetItemsPricesPlayer:
                    this.parseShowPlayerSellItems(data)
                    break
                case Command.BuyItemStore:
                    this.parseBuyStoreItem(data)
                    break
                case Command.SellItemStore:
                    this.parseSellPlayerItem(data)
                    break
                case Command.EraseSave:
                    this.client.resetPlayerData()
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
            this.client.game.playerId = loginData.playerId
            this.client.bag.playerId = loginData.playerId
            this.client.gear.playerId = loginData.playerId
            this.client.game.applyServerRules(loginData.serverRules)

            const player = loginData.players.find((p: PlayerDto) => p.id == loginData.playerId)
            if (player) {
                this.client.applyStats(player.hp, player.maxHp, player.atk, player.def, 1, 0, player.xpNeed)
            }
        }
        this.client.drawSprites()
    }

    private parseMove(data: string) {
        const moveData = new ParseMove(data)

        this.client.updatePlayer(moveData)
    }

    private parseHide(data: string) {
        const hideData = new ParseHidePlayer(data)

        this.client.hidePlayer(hideData)
    }

    private parsePlayersInRoom(data: string) {
        const playersInRoomData = new ParsePlayersInRoom(data)

        this.client.game.spritesLayer.updatePlayersPositions(playersInRoomData, this.client.playerId)
        this.client.serverReturned()
        this.client.drawSprites()
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
        if (confirm(errorData.message)) {
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

    private parseGoldDroped(data: string) {
        const dropData = new ParseGoldDroped(data)

        this.client.bag.addGold(-dropData.amount)
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
        const isQuestStart = dialogData.message.includes('-quest')
        const isUpdateRead = dialogData.message === '-woofdate read-'
        const isWarning = dialogData.message[0] == '-'

        if (isUpdateRead) {
            this.client.readUpdateComplete()
            this.client.displayDialog('', isQuestStart, isWarning)
        } else {
            this.client.displayDialog(dialogData.message, isQuestStart, isWarning)
        }
    }

    private parseChat(data: string) {
        const chatData = new ParseChat(data)

        this.client.displayChat(chatData.message, chatData.playerId)
    }

    private parseOpenStore(data: string) {
        const openStoreData = new ParseOpenStore(data)

        this.client.promptOpenStore(openStoreData.merchantId)
    }

    private parseShowStoreItems(data: string) {
        const storeItemsData = new ParseStoreItems(data)

        this.client.showStoreItems(storeItemsData.itemsIdsAndPrice)
    }

    private parseShowPlayerSellItems(data: string) {
        const playerItemsData = new ParsePlayerSellItems(data)

        this.client.showPlayerSellItems(playerItemsData.itemsIdsAndPrice)
    }

    private parseBuyStoreItem(data: string) {
        const boughtItemData = new ParseBoughtItem(data)

        this.client.boughtStoreItem(boughtItemData)
    }

    private parseSellPlayerItem(data: string) {
        const soldItemData = new ParseSoldPlayerItem(data)

        this.client.soldPlayerItem(soldItemData)
    }

    private parseSave(data: string) {
        const saveData = new ParseSave(data)

        this.client.savePlayerData(saveData.playerDataHex)
    }

    private parseLoad(data: string) {
        const loadData = new ParseLoad(data)

        this.client.gameVersion = loadData.gameVersion
        this.client.canCheckUpdateData = true
        this.client.loadPlayerData(loadData)
    }

    private parseLoadBag(data: string) {
        const loadData = new ParseLoadBag(data)

        this.client.reloadPlayerBag(loadData)
    }

    private parseExit(data: string) {
        const saveData = new ParseSave(data)

        this.client.exitConfirmed(saveData.playerDataHex)
    }

    private parseIdUpdate(data: string) {
        const updateIdData = new ParsePlayerIdUpdate(data)

        this.client.updatePlayerId(updateIdData)
    }

    private parseEntityInformation(data: string) {
        const loadData = new ParseEntityInfo(data)

        this.client.showEntityInfo(loadData)
    }
}
