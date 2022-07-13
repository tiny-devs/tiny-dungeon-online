import { Player } from './entities/player.ts'
import { Command, Direction, Items, GearType, Rooms } from './Enums.ts'
import Room from './map/rooms/room.ts'
import Map from './map/map.ts'
import { Npc } from './entities/npc.ts'
import { PveData } from './pve/pveData.ts'
import ConnectionManager from "./data/connectionManager.ts"
import DataManager from "./data/dataManager.ts"
import { Admins } from "./data/admins.ts"
import { badWords } from "./data/badWords.ts"

export class ClientHandler {
  public serverVersion: number
  public boardColumns = 16
  public boardRows = 16
  public playerNames: string[] = []
  public maxPlayers = 50
  public map: Map
  private topPlayers: {id:string,name:string,level:number}[]
  private db: ConnectionManager
  private playerDataManager: DataManager
  private admins: typeof Admins = Admins
  private regexBadWords: RegExp

  constructor(serverConfigs: any) {
    this.boardRows = serverConfigs.boardRows
    this.boardColumns = serverConfigs.boardColumns
    this.serverVersion = serverConfigs.version

    this.map = new Map(this)

    this.playerDataManager = new DataManager()

    this.db = new ConnectionManager()
    this.topPlayers = []
    this.db.getRank().then(result => {
      this.topPlayers = result
    })
    
    this.regexBadWords = new RegExp(badWords.map((word) => {
      let improvedWord = `(${word.split("").join("+(\\W|_)*")})`
      improvedWord = improvedWord.replace(/a/gi, "(a|2|4|@)")
      improvedWord = improvedWord.replace(/e/gi, "(e|3|&)")
      improvedWord = improvedWord.replace(/i/gi, "(i|1|!)")
      improvedWord = improvedWord.replace(/o/gi, "(o|0)")
      return improvedWord
    }).join('|'), 'ig')
  }

  private broadcastRank(): void {
    let currentPlayer = null
    try{
      for (const room of this.map.rooms) {
        for (const player of room.players) {
          currentPlayer = player
          this.send(player,`${Command.Rank},`+
            `${this.topPlayers[0].name},`+
            `${this.topPlayers[0].level},`+
            `${this.topPlayers[1].name},`+
            `${this.topPlayers[1].level},`+
            `${this.topPlayers[2].name},`+
            `${this.topPlayers[2].level}`)
        }
      }
    } catch (e) {
      const success = this.handleExceptions(e, currentPlayer, 'broadcastRank')
      if (success) {
        this.broadcastRank()
      }
    }
  }

  private broadcastPlayerIdUpdate(newId: string, oldId: string): void {
    let currentPlayer = null
    try{
      for (const room of this.map.rooms) {
        for (const player of room.players) {
          currentPlayer = player
          this.send(player,`${Command.UpdatePlayerId},${oldId},${newId}`)
        }
      }
    } catch (e) {
      const success = this.handleExceptions(e, currentPlayer, 'broadcastPlayerConnection')
      if (success) {
        this.broadcastPlayerIdUpdate(newId,oldId)
      }
    }
  }

  private broadcastPlayerConnection(playerId: string): void {
    let currentPlayer = null
    try{
      const data = this.getAllPlayersString()

      for (const room of this.map.rooms) {
        for (const player of room.players) {
          currentPlayer = player
          this.send(player,`${Command.Login},`+
            `${playerId}$`+
            `${this.boardRows}$`+
            `${this.boardColumns}$`+
            `${data}`)
        }
      }
    } catch (e) {
      const success = this.handleExceptions(e, currentPlayer, 'broadcastPlayerConnection')
      if (success) {
        this.broadcastPlayerConnection(playerId)
      }
    }
  }

  public nearbycastPlayerMove(playerMoved: Player, direction: Direction): void {
    let currentPlayer = null
    try{
      const isValid = playerMoved.move(direction)
      if (playerMoved.changedRoom()) {
        const newRoom = this.map.getRoomById(playerMoved.currentRoomId)
        this.switchRooms(playerMoved, newRoom)
      }
    
      if (isValid) {
        for (const room of this.map.rooms) {
          for (const player of room.players) {
            const isInSame = playerMoved.currentRoomId === player.currentRoomId
            if (isInSame) {
              currentPlayer = player
              this.send(player,`${Command.Move},`+
                `${playerMoved.id},`+
                `${playerMoved.x},`+
                `${playerMoved.y},`+
                `${playerMoved.currentRoomId}`)
            }

            const isNearby = playerMoved.currentRoom.isNeighbourToRoom(player.currentRoomId)
            if (isNearby) {
              currentPlayer = player
              this.send(player,`${Command.HidePlayer},${playerMoved.id},${playerMoved.currentRoomId}`)
            }
          }
        }
      }
    } catch (e) {
      const success = this.handleExceptions(e, currentPlayer, 'broadcastPlayerMove')
      if (success) {
        this.nearbycastPlayerMove(playerMoved,direction)
      }
    }
  }

  private broadcastMessage(message: string): void {
    let currentPlayer = null
    try{
      for (const room of this.map.rooms) {
        for (const player of room.players) {
          currentPlayer = player
          this.send(player,`${Command.Message},"${message}"`)
        }
      }
    } catch (e) {
      this.handleExceptions(e, currentPlayer, 'broadcastMessage')
    }
  }

  public roomcastNpcMove(npcMoved: Npc): void {
    let currentPlayer = null
    try{
      for (const player of npcMoved.room.players) {
        currentPlayer = player
        this.send(player,`${Command.NpcMove},`+
          `${npcMoved.id},` +
          `${npcMoved.npcId},`+
          `${npcMoved.x},`+
          `${npcMoved.y},` +
          `${npcMoved.roomId}`)
      }
    } catch (e) {
      const success = this.handleExceptions(e, currentPlayer, 'roomcastNpcMove')
      if (success) {
        this.roomcastNpcMove(npcMoved)
      }
    }
  }

  public roomcastPveFight(pveData: PveData): void {
    let currentPlayer = null
    try{
      for (const player of pveData.room.players) {
        currentPlayer = player
        this.send(player,`${Command.Pve},`+
          `${pveData.attacker},` +
          `${pveData.damageCaused},`+
          `${pveData.npc.hp},` +
          `${pveData.npc.id},` +
          `${pveData.player.hp},` +
          `${pveData.player.id},` +
          `${pveData.room.id}`)
      }
    } catch (e) {
      const success = this.handleExceptions(e,currentPlayer, 'roomcastPveFight')
      if (success) {
        this.roomcastPveFight(pveData)
      }
    }
  }

  public roomcastItemDrop(itemData: any, roomId: number, y: number, x: number): void {
    let currentPlayer = null
    try{
      const room = this.map.getRoomById(roomId)
      
      for (const player of room.players) {
        currentPlayer = player
        this.send(player,`${Command.ItemDrop},`+
          `${itemData.id},` +
          `${itemData.itemId},`+
          `${roomId},` +
          `${x},${y}`)
      }
    } catch (e) {
      const success = this.handleExceptions(e, currentPlayer, 'roomcastItemDrop')
      if (success) {
        this.roomcastItemDrop(itemData,roomId,y,x)
      }
    }
  }

  public roomcastItemPick(roomId: number, y: number, x: number, itemId: Items, coins: number, playerId: string): void {
    let currentPlayer = null
    try{
      const room = this.map.getRoomById(roomId)

      for (const player of room.players) {
        currentPlayer = player
        this.send(player,`${Command.ItemPick},`+
          `${playerId},`+
          `${itemId},${coins},`+
          `${x},${y}`)
      }
    } catch (e) {
      const success = this.handleExceptions(e, currentPlayer, 'roomcastItemPick')
      if (success) {
        this.roomcastItemPick(roomId,y,x,itemId,coins,playerId)
      }
    }
  }

  private async roomcastChat(room: Room, sentBy: Player, message: string): Promise<boolean> {
    let currentPlayer = null
    try{
      const badWordCheckResult = this.checkBadWords(message)
      if (badWordCheckResult.contains) {
        message = badWordCheckResult.messageFixed
        sentBy.badBehaviour += 1
        if(sentBy.badBehaviour > 4) {
          this.unicastError(sentBy, 'you were kicked for swearing')
          await this.delay(1000)
          this.logPlayerOut(sentBy)
          this.broadcastPlayerConnection(sentBy.id)
          return false
        }
      }

      for (const player of room.players) {
        currentPlayer = player
        this.send(player,`${Command.Chat},${sentBy.id},"${message}"`)
      }
      return true
    } catch (e) {
      this.handleExceptions(e, currentPlayer, 'roomcastItemsInRoom')
      return false
    }
  }

  private checkBadWords(message: string) {
    let hasBadWord = false

    message = message.replace(this.regexBadWords, (match) => { 
      hasBadWord = true
      return match.replace(/([a-z]|\d)/gi, "*") 
    })

    return {contains: hasBadWord, messageFixed: message}
  }

  private switchRooms(player: Player, newRoom: Room) {
    try{
      player.currentRoom.removePlayer(player)

      player.currentRoomId = newRoom.id
      player.currentRoom = newRoom
      newRoom.addPlayer(player)

      this.unicastNpcsInRoom(player)
      this.unicastItemsInRoom(player)
      this.unicastPlayersInRoom(player)
    } catch (e) {
      this.handleExceptions(e, player, 'switchRooms')
    }
  }

  private roomcastItemsInRoom(room: Room): void {
    let currentPlayer = null
    try{
      const data = room.getAllItemsInRoom()[0]

      for (const player of room.players) {
        currentPlayer = player
        this.send(player,`${Command.ItemsInRoom},${room.id},${data}`)
      }
    } catch (e) {
      this.handleExceptions(e, currentPlayer, 'roomcastItemsInRoom')
    }
  }

  public unicastMessage(player: Player, message: string): void {
    try{
      this.send(player,`${Command.Message},"${message}"`)
    } catch (e) {
      this.handleExceptions(e, player, 'unicastMessage')
    }
  }

  public unicastItemRemove(player: Player, itemId: Items): void {
    try{
      this.send(player,`${Command.ItemRemove},${itemId}`)
    } catch (e) {
      this.handleExceptions(e, player, 'unicastItemRemove')
    }
  }

  public unicastItemWear(player: Player, itemId: Items, gearType: GearType): void {
    try{
      this.send(player,`${Command.ItemWear},${itemId},${gearType}`)
    } catch (e) {
      this.handleExceptions(e, player, 'unicastItemWear')
    }
  }

  public unicastPlayerStats(player: Player): void {
    try{
      const data = player.getStats()
      this.send(player,`${Command.Stats},`+
        `${data.hp},${data.maxHp},${data.attack},${data.defense},`+
        `${data.level},${data.xp},${data.xpNeeded}`)
    } catch (e) {
      this.handleExceptions(e, player, 'unicastPlayerStats')
    }
  }

  public unicastDialog(player: Player, dialog: string) {
    try {
      this.send(player,`${Command.Dialog},"${dialog}"`)
    } catch (e) {
      this.handleExceptions(e, player, 'unicastDialog')
    }
  }

  private unicastItemsInRoom(player: Player): void {
    try{
      const data = player.currentRoom.getAllItemsInRoom()[0]
      this.send(player,`${Command.ItemsInRoom},${player.currentRoomId},${data}`)
    } catch (e) {
      this.handleExceptions(e, player, 'unicastItemsInRoom')
    }
  }

  private unicastNpcsInRoom(player: Player): void {
    try{
      const data = player.currentRoom.getAllNpcsInRoom()
      this.send(player,`${Command.NpcsInRoom},${data}`)
    } catch (e) {
      this.handleExceptions(e, player, 'unicastNpcsInRoom')
    }
  }

  private unicastPlayersInRoom(player: Player): void {
    try{
      const data = player.currentRoom.getAllPlayersPositionsInRoomExceptSelf(player.id)
      this.send(player,`${Command.PlayersInRoom},${player.currentRoom.id},${data}`)
    } catch (e) {
      this.handleExceptions(e, player, 'unicastPlayersInRoom')
    }
  }

  private unicastItemUse(player: Player, itemId: Items): void {
    try{
      this.send(player,`${Command.ItemUse},${itemId}`)
    } catch (e) {
      this.handleExceptions(e, player, 'unicastItemUse')
    }
  }

  private unicastPlayerDroped(player: Player, itemId: Items): void {
    try{
      this.send(player,`${Command.ItemDroped},${itemId}`)
    } catch (e) {
      this.handleExceptions(e, player, 'unicastPlayerDroped')
    }
  }

  private unicastPlayerDropedGold(player: Player, amount: number): void {
    try{
      this.send(player,`${Command.GoldDroped},${amount}`)
    } catch (e) {
      this.handleExceptions(e, player, 'unicastPlayerDropedGold')
    }
  }

  private unicastEntityInfo(player: Player, x: number, y: number) {
    try{
      const entityInfo = player.currentRoom.getEntityInfo(x, y)
      if (entityInfo.length) {
        this.send(player,`${Command.EntityInfo},${entityInfo}`)
      }
    } catch (e) {
      this.handleExceptions(e, player, 'loadPlayerDataFromHash')
    }
  }

  private unicastRank(player: Player): void {
    try{
      this.send(player,`${Command.Rank},`+
        `${this.topPlayers[0].name},`+
        `${this.topPlayers[0].level},`+
        `${this.topPlayers[1].name},`+
        `${this.topPlayers[1].level},`+
        `${this.topPlayers[2].name},`+
        `${this.topPlayers[2].level}`)
    } catch (e) {
      this.handleExceptions(e, player, 'unicastRank')
    }
  }

  public async unicastPlayerDataHashSave(player: Player) {
    try{
      const playerDataHash = await this.playerDataManager.encryptUserData(player.getPlayerDataForSave())
      this.send(player,`${Command.Save},${playerDataHash}`)
    } catch (e) {
      this.handleExceptions(e, player, 'unicastPlayerDataHashSave')
    }
  }

  public unicastPlayerBag(player: Player) {
    try{
        let data = `${Command.LoadBag},${player.id}@`
        for (const item of player.bag.items) {
          data += `${item.itemId},`
        }
  
        this.send(player,data)
    } catch (e) {
      this.handleExceptions(e, player, 'unicastPlayerBag')
    }
  }

  public unicastOpenStore(player: Player, merchantId: number) {
    try{
      this.send(player,`${Command.OpenStore},${merchantId}`)
    } catch (e) {
      this.handleExceptions(e, player, 'unicastOpenStore')
    }
  }

  public unicastStoreItems(player: Player, merchantId: number) {
    try{
      const merchant = player.currentRoom.npcs.find(x => x.npcId == merchantId)
      if (merchant) {
        let dataItems = `${Command.GetItemsStore},@`
        for (const item of merchant.sells) {
          dataItems += `${item.itemId}^${item.storeSellPrice},`
        }

        this.send(player, dataItems)
      }
    } catch (e) {
      this.handleExceptions(e, player, 'unicastStoreItems')
    }
  }

  public unicastPlayerItemsPrices(player: Player) {
    try{
      let dataItems = `${Command.GetItemsPricesPlayer},@`
      for (const item of player.bag.items) {
        dataItems += `${item.itemId}^${item.playerSellPrice},`
      }

      this.send(player, dataItems)
    } catch (e) {
      this.handleExceptions(e, player, 'unicastPlayerItemsPrices')
    }
  }

  public tryBuyItem(player: Player, itemId: number, merchantId: number) {
    try{
      const merchant = player.currentRoom.npcs.find(x => x.npcId == merchantId)
      if (merchant) {
        const itemBought = merchant.sells.find(x => x.itemId === itemId)
        if (itemBought) {
          const hasMoney = player.bag.coins >= itemBought.storeSellPrice
          const hasSpace = player.bag.items.length < player.bag.size
          if (hasMoney && hasSpace) {
            const itemBaseTaken = player.bag.getItemFromItemId(itemId)!
            player.bag.coins -= itemBought.storeSellPrice
            player.bag.addItem(itemBaseTaken)
            this.unicastItemTraded(player, true, '', itemId, player.bag.coins, Command.BuyItemStore)
          } else if (!hasMoney) {
            this.unicastItemTraded(player, false, 'No gold!', itemId, player.bag.coins, Command.BuyItemStore)
          } else {
            this.unicastItemTraded(player, false, 'No space!', itemId, player.bag.coins, Command.BuyItemStore)
          }
        } else {
          this.unicastItemTraded(player, false, 'Item not found!', itemId, player.bag.coins, Command.BuyItemStore)
        }
      } else {
        this.unicastItemTraded(player, false, 'Merchant not found!', itemId, player.bag.coins, Command.BuyItemStore)
      }
    } catch (e) {
      this.handleExceptions(e, player, 'tryBuyItem')
    }
  }

  public trySellItem(player: Player, itemId: number, merchantId: number) {
    try{
      const merchant = player.currentRoom.npcs.find(x => x.npcId == merchantId)
      if (merchant) {
        const itemSold = player.bag.items.find(x => x.itemId === itemId)
        if (itemSold) {
          player.bag.coins += itemSold.playerSellPrice
          player.bag.removeItem(itemSold)
          this.unicastItemTraded(player, true, '', itemId, player.bag.coins, Command.SellItemStore)
        } else {
          this.unicastItemTraded(player, false, 'Item not found!', itemId, player.bag.coins, Command.SellItemStore)
        }
      } else {
        this.unicastItemTraded(player, false, 'Trying to sell from far away', itemId, player.bag.coins, Command.SellItemStore)
      }
    } catch (e) {
      this.handleExceptions(e, player, 'trySellItem')
    }
  }

  public unicastItemTraded(player: Player, success: boolean, message: string, itemId: number, currentCoins: number, command: Command) {
    try{
      if (!success) {
        this.send(player, `${command},${success},${message}`)
      } else {
        this.send(player, `${command},${success},'',${itemId},${currentCoins}`)
      }
    } catch (e) {
      this.handleExceptions(e, player, 'unicastItemTraded')
    }
  }

  private async unicastPlayerDataLoaded(player: Player, dataHash: string) {
    try{
      const success = await this.loadPlayerDataFromHash(player, dataHash)
      if (!success) {
        this.unicastError(player, 'Error loading your data')
      } else {
        let data = `${Command.Load},${player.id},`+
        `${player.hp},${player.totalHp()},${player.totalAttack()},${player.totalDefense()},`+
        `${player.level},${player.xp},${player.xpNeeded},${this.serverVersion}@`
        data += `${player.bag.coins};`
        for (const item of player.bag.items) {
          data += `${item.itemId},`
        }
        data += '@'
        if (player.gear.head) {
          data += `${player.gear.head.itemId}@`
        } else {
          data += 'empty@'
        }
        if (player.gear.torso) {
          data += `${player.gear.torso.itemId}@`
        } else {
          data += 'empty@'
        }
        if (player.gear.legs) {
          data += `${player.gear.legs.itemId}@`
        } else {
          data += 'empty@'
        }
        if (player.gear.weapon) {
          data += `${player.gear.weapon.itemId}`
        } else {
          data += 'empty'
        }
  
        this.send(player,data)
      }
    } catch (e) {
      this.handleExceptions(e, player, 'unicastPlayerDataLoaded')
    }
  }

  private async loadPlayerDataFromHash(player: Player, dataHash: string): Promise<boolean> {
    try{
      const data = await this.playerDataManager.decryptUserData(dataHash)
      const playerLoaded = player.loadPlayerDataFromSave(data)
      this.db.saveAccount({id: player.id, data: data})
      return playerLoaded
    } catch (e) {
      this.handleExceptions(e, player, 'loadPlayerDataFromHash')
      return false
    }
  }

  private async unicastPlayerExit(player: Player) {
    try{
      const playerDataHash = await this.playerDataManager.encryptUserData(player.getPlayerDataForSave())
      this.send(player,`${Command.Exit},${playerDataHash}`)
    } catch (e) {
      this.handleExceptions(e, player, 'loadPlayerDataFromHash')
    }
  }

  public updateRank() {
    let updated = false
    const players = [] as any[]
    for (const room of this.map.rooms) {
      for (const player of room.players) {
        players.push(player)
      }
    }
    players.sort((a, b) => { 
      return b.level - a.level;
    })

    const limitForTop3OrLess = players.length > 3 ? 3 : players.length
    for (let i=0;i<limitForTop3OrLess;i++) {
      const topPlayer = this.topPlayers.find(p => p.id == players[i].id)
      if (!topPlayer) {
        this.topPlayers.push({id:players[i].id,name:players[i].name,level:players[i].level})
        updated = true
      } else {
        if (topPlayer.level != players[i].level) {
          const index = this.topPlayers.map(p => p.id).indexOf(players[i].id)
          this.topPlayers[index].level = players[i].level
          updated = true
        }
      }
    }

    this.topPlayers.sort((a, b) => { 
      return b.level - a.level;
    })

    players.splice(0, players.length)
    if (updated) {
      this.topPlayers.splice(3)
      this.db.updateRank(this.topPlayers).then(() => {
        this.broadcastRank()
      })
    }

    return updated
  }

  private executeAdminCommand(adm: Player, cmd: string) {
    try {
      const command = cmd.split(' ')[0]
      const args = cmd.split(' ')!
      const message = args.join(' ')
      args.shift()
      switch (command) {
        case '/kick':
          this.kickPlayer(args[0], 'you were kicked by admin')
          break
        case '/global':
          this.broadcastMessage(message)
          break
        case '/find':
          this.findPlayer(adm, args[0])
          break
        case '/tp':
          this.teleport(adm, args[0])
          break
        case '/item':
          this.spawnItem(adm, args[0])
          break
        case '/help':
          this.unicastMessage(adm, `commands: kick [player], global [message], find [player], tp [PlaceName], item [ItemName]`)
          break
        default:
          break
      }
    } catch (e) {
      console.log('source: executeAdminCommand')
      console.log(e)
    }
  }

  private handleExceptions(e: Error, player: Player | null, src: string): boolean {
    try {
      console.log(`source: ${src}`)
      console.log(e)
      let success = false
      if (e.name.includes('ConnectionReset')) {
        success = this.removeAllClosedSockets()
      }
      else if (e.name.includes('SyntaxError')) {
        this.send(player!,`${Command.Error},"An error has occured"`)
        success = this.logPlayerOut(player!)
      }
  
      if (success) {
        console.log('--- FIXED ---')
      }
      return success
    } catch (e) {
      console.log('source: handleExceptions')
      console.log(e)
    }
    return false
  }

  private removeAllClosedSockets(): boolean {
    let success = false
    let currentPlayer = null
    for (const room of this.map.rooms) {
      for (const player of room.players) {
        try {
          currentPlayer = player
          if (player.clientWs.readyState === WebSocket.CLOSED) {
            this.logPlayerOut(player)
            success = true
          }
        } catch (e) {
          console.log('source: removeAllClosedSockets', currentPlayer?.name)
          console.log(e)
        }
      }
    }

    return success
  }

  private getAllPlayers() {
    const playersReturn = []
    for (const room of this.map.rooms) {
      for (const player of room.players) {
        playersReturn.push(player.getReturnData())
      }
    }
    return playersReturn
  }

  private getAllPlayersString() {
    let playersReturn = ''
    for (const room of this.map.rooms) {
      for (const player of room.players) {
        const data = player.getReturnData()
        playersReturn = `${playersReturn}${data.id}@${data.name}@${data.color}@${data.x}@${data.y}` +
        `@${data.currentRoomId}@${data.hp}@${data.maxHp}@${data.atk}@${data.def}@${data.xpNeed}@` +
        `${JSON.stringify(data.matrix)}$`
      }
    }
    return playersReturn
  }

  private findPlayer(adm: Player, name: string) {
    for (const room of this.map.rooms) {
      for (const player of room.players) {
        if (player.name.toLowerCase() == name.toLowerCase()) {
          this.unicastMessage(adm, `${Rooms[player.currentRoom.id]} (${player.currentRoom.id})`)
          return
        }
      }
    }
    this.unicastMessage(adm, 'player not found')
  }

  private teleport(adm: Player, place: string): boolean {
    try {
      const roomsAny = Rooms as any
      const placeUpperCase = place.charAt(0).toUpperCase() + place.slice(1)
      const roomId = roomsAny[placeUpperCase]
      if (roomId) {
        adm.teleport(roomId)
      }
    } catch (e) {
      this.handleExceptions(e, adm, 'teleport')
    }
    return false
  }

  private spawnItem(adm: Player, itemName: string): boolean {
    try {
      const itemsAny = Items as any
      const itemNameUpperCase = itemName.charAt(0).toUpperCase() + itemName.slice(1)
      const item = itemsAny[itemNameUpperCase]
      if (item) {
        adm.spawnItem(item)
      }
    } catch (e) {
      this.handleExceptions(e, adm, 'spawnItem')
    }
    return false
  }

  private checkNameDuplicate(name: string, player: Player): boolean {
    try {
      return this.playerNames.some(pName => pName.toLowerCase() == name.toLowerCase())
    } catch (e) {
      this.handleExceptions(e, player, 'checkNameDuplicate')
    }
    return false
  }

  private checkPlayerAlreadyLogged(player: Player, id: string): boolean {
    try {
      const players = this.getAllPlayers()
      return players.filter(p => p.id == id).length > 1
    } catch (e) {
      this.handleExceptions(e, player, 'checkNameDuplicate')
    }
    return false
  }

  private unicastError(player: Player, description: string): boolean {
    try {
      this.send(player, `${Command.Error},"${description}"`)
    } catch (e) {
      this.handleExceptions(e, player, 'checkNameDuplicate')
    }
    return false
  }

  public async kickPlayer(name: string | undefined, reason: string) {
    let currentPlayer = null
    try {
      if (name) {
        for (const room of this.map.rooms) {
          const player = room.players.find(p => p.name == name)
          if (player) {
            currentPlayer = player
            this.unicastError(player, reason)
            await this.delay(1000)
            this.logPlayerOut(player)
            this.broadcastPlayerConnection(player.id)
            break
          }
        }
      }
    } catch (e) {
      this.handleExceptions(e, currentPlayer, 'kickPlayer')
    }
  }

  private delay(ms: number): Promise<unknown> {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  private logPlayerOut(player: Player): boolean {
    try{
      const room = this.map.getRoomById(player.currentRoom.id)
      room.removePlayer(player)
      player.x = -1
      player.y = -1
      this.playerNames = this.playerNames.filter(e => e !== player.name);
      if (player.clientWs.readyState !== WebSocket.CLOSED) {
        player.clientWs?.close()
      }

      return true
    } catch (e) {
      this.handleExceptions(e, player, 'logPlayerOut')
    }
    return false
  }

  private pong(player: Player): void {
    try {
      this.send(player,`${Command.Pong}`)
    } catch (e) {
      console.log('source: pong')
      console.log(e)
    }
  }

  private parseEventDataString(eventDataString: string): string[] {
    let rawDataString = eventDataString
    let matrix = ''
    if (eventDataString.includes(',[')) {
      rawDataString = eventDataString.substr(0, eventDataString.indexOf(',['))
      matrix = eventDataString.substr(eventDataString.indexOf('['), eventDataString.length)
    }

    const eventData = rawDataString.split(',')
    if (matrix !== '') {
      eventData.push(matrix)
    }

    if (eventDataString.includes(',"')) {
      const indexFirstQuotes = eventDataString.indexOf(',"')+2
      const indexLastQuotes = eventDataString.split(',"')[1].indexOf('"')+indexFirstQuotes
      eventData[1] = eventDataString.substring(indexFirstQuotes, indexLastQuotes)
    }

    return eventData
  }

  private send(player: Player, message: string):boolean {
    try {
      if (player.clientWs.readyState !== WebSocket.CLOSED) {
        player.clientWs.send(message)
        return true
      } else {
        this.logPlayerOut(player)
        return false
      }
    } catch (e) {
      console.log('source: send')
      console.log(e)
    }
    return false
  }

  public handleClient(ws: WebSocket): void {
    try {
      let player: Player | null = null;
      ws.onopen = () => player = this.handleOpenClient(ws);
      ws.onmessage = (m) => this.handleClientMessage(player, m);
      ws.onclose = () => this.handleClientClose(player);
      ws.onerror = (e) => this.handleClientError(e, player);
    } catch (e) {
      console.log('source: main loop')
      console.log(e)
    }
  }

  private handleOpenClient(ws: WebSocket) {
    const initialRoom = this.map.rooms[0]
    const playerId = globalThis.crypto.randomUUID()
    const player = new Player(playerId, '', '', 0, 0, initialRoom, this.boardRows, this.boardColumns, ws, this)

    initialRoom.addPlayer(player)
    return player
  }

  public async handleClientMessage(player: Player | null, m: MessageEvent<any>)  {
    if (player) {
      let duplicatedName = false
      let exit = false
      const initialRoom = this.map.rooms[0]
  
      const eventDataString = m.data as string
  
      try {
        const eventData = this.parseEventDataString(eventDataString);
  
        switch (+eventData[0]) {
          case Command.GetItemsStore:
            this.unicastStoreItems(player, +eventData[1])
            break
          case Command.GetItemsPricesPlayer:
            this.unicastPlayerItemsPrices(player)
            break
          case Command.BuyItemStore: {
            const playerBuyingItemId = +eventData[1]
            const buyingFromMerchantId = +eventData[2]
            this.tryBuyItem(player, playerBuyingItemId, buyingFromMerchantId)
            break
          }
          case Command.SellItemStore: {
            const playerSellingItemId = +eventData[1]
            const sellingToMerchantId = +eventData[2]
            this.trySellItem(player, playerSellingItemId, sellingToMerchantId)
            break
          }
          case Command.ItemDrop: {
            const droped = player.bag.dropItem(+eventData[1])
            if (droped) {
              this.unicastPlayerDroped(player, +eventData[1])
            }
            break
          }
          case Command.GoldDroped: {
            const dropedGold = player.bag.dropGold(+eventData[1])
            if (dropedGold) {
              this.unicastPlayerDropedGold(player, +eventData[1])
            }
            break
          }
          case Command.ItemUse: {
            const result = player.bag.useItem(+eventData[1])
            if (result.used) {
              this.unicastItemUse(player,+eventData[1])
              this.unicastPlayerStats(player)
            } else if (result.wore) {
              this.unicastPlayerStats(player)
            }
            break
          }
          case Command.ItemRemove: {
            const removed = player.gear.remove(+eventData[1])
            if (removed) {
              this.unicastItemRemove(player, +eventData[1])
              this.unicastPlayerStats(player)
            }
            break
          }
          case Command.Chat:
            if (eventData[1][0] == '/' && this.admins.some(a => a.name == player.name)) {
              this.executeAdminCommand(player, eventData[1])
              eventData[1] = ' '
            }
  
            if (eventData[1].length <= 50 && player.canChat) {
              this.roomcastChat(player.currentRoom, player, eventData[1])
              player.startChatTimeout()
            }
            break
          case Command.Move:
            this.nearbycastPlayerMove(player, +eventData[1])
            break
          case Command.Login: {
            const adminAccess = this.admins.find(a => a.name == eventData[1])
            if (adminAccess) {
              if (eventData[4] != '0') {
                const code = await this.playerDataManager.decryptUserData(eventData[4])
                if (code != adminAccess.code) {
                  this.unicastError(player, "Wrong password")
                  initialRoom.removePlayer(player)
                  break
                }
              } else {
                this.unicastError(player, "Thats an admins name")
                initialRoom.removePlayer(player)
                break
              }
            }
  
            duplicatedName = this.checkNameDuplicate(eventData[1], player)
            if (duplicatedName) {
              this.unicastError(player, "Name already exists - refresh the page and try again")
              initialRoom.removePlayer(player)
              break
            }
            if (this.playerNames.length >= this.maxPlayers) {
              this.unicastError(player, `Too many players online (max: ${this.maxPlayers}) - consider donating so we can upgrade the server :'(`)
              initialRoom.removePlayer(player)
              break
            }
  
            this.playerNames.push(eventData[1])
            player.name = eventData[1]
            player.color = eventData[2]
            player.matrix = JSON.parse(eventData[5])
  
            this.broadcastPlayerConnection(player.id)
            this.unicastNpcsInRoom(player)
            this.unicastItemsInRoom(player)
  
            const playerLoadData = eventData[3]
            const hasPlayerData = playerLoadData != '0'
            if (hasPlayerData) {
              const oldId = player.id
              await this.unicastPlayerDataLoaded(player,playerLoadData)
              this.broadcastPlayerIdUpdate(player.id, oldId)
              const isPlayerAlreadyLogged = this.checkPlayerAlreadyLogged(player, player.id)
              if (isPlayerAlreadyLogged) {
                this.unicastError(player, "Player already logged - check other tabs")
                exit = true
              }
            } else {
              this.unicastPlayerStats(player)
            }
            const updatedRank = this.updateRank()
            if (!updatedRank) {
              this.unicastRank(player)
            }
            player.savePlayer()
            break
          }
          case Command.EntityInfo:
            this.unicastEntityInfo(player, Number(eventData[1]), Number(eventData[2]))
            break
          case Command.Exit:
            exit = true
            await this.unicastPlayerExit(player)
            break
          case Command.Ping:
            this.pong(player)
            break
        }
  
        if (duplicatedName) {
          this.logPlayerOut(player)
          return
        }
  
        if (exit) {
          this.logPlayerOut(player)
          this.broadcastPlayerConnection(player.id)
          return
        }
  
      } catch(e) {
        this.handleExceptions(e,player, 'main loop')
      }
    }
  }

  private handleClientClose(player: Player | null) {
    if (player) {
      this.logPlayerOut(player)
      this.broadcastPlayerConnection(player.id)
    }
  }

  private handleClientError(e: Event | ErrorEvent, player: Player | null) {
    const errorMessage = e instanceof ErrorEvent ? e.message : e.type
    this.handleExceptions(new Error(errorMessage), player, 'clientError')
  }
}