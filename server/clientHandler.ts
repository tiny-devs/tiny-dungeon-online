import { WebSocket, isWebSocketCloseEvent } from 'https://deno.land/std/ws/mod.ts'
import { v4 } from 'https://deno.land/std/uuid/mod.ts'
import { Player } from './player.ts'
import { Command, Direction } from './Enums.ts'

export class ClientHandler {
  private boardColumns: number = 5
  private boardRows: number = 5
  public players: Player[] = []


  constructor(serverConfigs: any) {
    this.boardRows = serverConfigs.boardRows
    this.boardColumns = serverConfigs.boardColumns
  }

  private broadcastPlayerMove(playerMoved: Player, direction: Direction): void {
    playerMoved.move(direction, this.boardRows, this.boardColumns)

    for (const player of this.players) {
      player.clientWs.send(`${Command.Move},`+
      `${playerMoved.id},`+
      `${playerMoved.x},`+
      `${playerMoved.y}`)
    }
  }

  private broadcastPlayerConnection(playerId: string): void {
    const data = JSON.stringify(this.getAllPlayers())

    for (const player of this.players) {
      player.clientWs.send(`${Command.Login},`+
      `${playerId},`+
      `${this.boardRows},`+
      `${this.boardColumns},`+
      `${data}`)
    }
  }

  private getAllPlayers() {
    let playersReturn = []
    for (const player of this.players) {
      playersReturn.push(player.getReturnData())
    }
    return playersReturn
  }

  private pong(player: Player): void {
    this.players.filter(p => p.name == player.name)[0];
    player.clientWs?.send(`${Command.Pong}`);
  }

  public async handleClient(ws: WebSocket): Promise<void> {
    const playerId = v4.generate()
    const player = new Player(playerId, '', '', 0, 0, ws)

    this.players.push(player)
  
    for await (const event of ws) {
      const eventDataString = event as string

      if (isWebSocketCloseEvent(event)) {
        const index = this.players.indexOf(player)
        if (index > -1) {
          this.players.splice(index, 1)
        }
        this.broadcastPlayerConnection(playerId)
        break
      }

      try {
        let rawDataString = eventDataString
        let matrix = ''
        if (eventDataString.includes(',[')) {
          rawDataString = eventDataString.substr(0, eventDataString.indexOf(',['))
          matrix = eventDataString.substr(eventDataString.indexOf('['), eventDataString.length)
        }

        const eventData = rawDataString.split(',')

        switch (+eventData[0]) {
          case Command.Move:
            this.broadcastPlayerMove(player, +eventData[1])
            break
          case Command.Login:
            player.name = eventData[1]
            player.color = eventData[2]
            player.matrix = JSON.parse(matrix)
            this.broadcastPlayerConnection(playerId)
            break
          case Command.Ping:
            this.pong(player)
            break
        }

      } catch(e) {
        console.log(e)
      }
      
    }
  }
}