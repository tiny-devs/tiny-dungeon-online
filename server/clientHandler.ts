import { WebSocket, isWebSocketCloseEvent } from 'https://deno.land/std/ws/mod.ts'
import { v4 } from 'https://deno.land/std/uuid/mod.ts'
import { Player } from './player.ts'
import { Command, Direction } from './Enums.ts'
import Room from './map/rooms/room.ts'
import Map from './map/map.ts'

export class ClientHandler {
  private boardColumns: number = 5
  private boardRows: number = 5
  public playerNames: string[] = []
  public map: Map

  constructor(serverConfigs: any) {
    this.boardRows = serverConfigs.boardRows
    this.boardColumns = serverConfigs.boardColumns

    this.map = new Map()
  }

  private switchRooms(player: Player, newRoom: Room) {
    const oldRoom = this.map.getRoomById(player.currentRoom.id)
    oldRoom.removePlayer(player)

    player.currentRoomId = newRoom.id
    player.currentRoom = newRoom
    newRoom.addPlayer(player)
  }

  private broadcastPlayerMove(playerMoved: Player, direction: Direction): void {
    let isValid = playerMoved.move(direction, this.boardRows, this.boardColumns)
    if (playerMoved.changedRoom()) {
      const newRoom = this.map.getRoomById(playerMoved.currentRoomId)
      this.switchRooms(playerMoved, newRoom)
    }
  
    if (isValid) {
      for (const room of this.map.rooms) {
        for (const player of room.players) {
          player.clientWs.send(`${Command.Move},`+
          `${playerMoved.id},`+
          `${playerMoved.x},`+
          `${playerMoved.y},`+
          `${playerMoved.currentRoomId}`)
        }
      }
    }
  }

  private broadcastPlayerConnection(playerId: string): void {
    const data = JSON.stringify(this.getAllPlayersOfRoom(0))
    const room = this.map.getRoomById(0)

    for (const player of room.players) {
      player.clientWs.send(`${Command.Login},`+
      `${playerId},`+
      `${this.boardRows},`+
      `${this.boardColumns},`+
      `${data}`)
    }
  }

  private getAllPlayersOfRoom(roomId: number) {
    const room = this.map.getRoomById(roomId)
    let playersReturn = []
    for (const player of room.players) {
      playersReturn.push(player.getReturnData())
    }
    return playersReturn
  }

  private checkNameDuplicate(name: string, playerWs: WebSocket): boolean {
    let nameExists = this.playerNames.some(pName => pName == name)
    if (nameExists) {
      playerWs.send(`${Command.Error},"Name already exists"`)
      return true
    }
    return false
  }

  private logPlayerOut(player: Player, playerId: string) {
    const room = this.map.getRoomById(player.currentRoom.id)
    room.removePlayer(player)
    this.playerNames = this.playerNames.filter(e => e !== player.name);
    this.broadcastPlayerConnection(playerId)
  }

  private pong(player: Player): void {
    player.clientWs?.send(`${Command.Pong}`)
  }

  private parseEventDataString(eventDataString: string): string[] {
    let rawDataString = eventDataString
    let matrix = ''
    if (eventDataString.includes(',[')) {
      rawDataString = eventDataString.substr(0, eventDataString.indexOf(',['))
      matrix = eventDataString.substr(eventDataString.indexOf('['), eventDataString.length)
    }

    let eventData = rawDataString.split(',')
    if (matrix !== '') {
      eventData.push(matrix)
    }

    return eventData
  }

  public async handleClient(ws: WebSocket): Promise<void> {
    let duplicatedName = false
    const initialRoom = this.map.rooms[0]
    const playerId = v4.generate()
    const player = new Player(playerId, '', '', 0, 0, initialRoom, ws)

    initialRoom.addPlayer(player)
  
    for await (const event of ws) {
      const eventDataString = event as string

      if (isWebSocketCloseEvent(event)) {
        this.logPlayerOut(player, playerId)
        break
      }

      try {
        let eventData = this.parseEventDataString(eventDataString);

        switch (+eventData[0]) {
          case Command.Move:
            this.broadcastPlayerMove(player, +eventData[1])
            break
          case Command.Login:
            duplicatedName = this.checkNameDuplicate(eventData[1], ws)
            if (duplicatedName) {
              break
            }

            this.playerNames.push(eventData[1])
            player.name = eventData[1]
            player.color = eventData[2]
            player.matrix = JSON.parse(eventData[3])
            this.broadcastPlayerConnection(playerId)
            break
          case Command.Ping:
            this.pong(player)
            break
        }

        if (duplicatedName) {
          this.logPlayerOut(player, playerId)
          break
        }

      } catch(e) {
        console.log(e)
      }
      
    }
  }
}