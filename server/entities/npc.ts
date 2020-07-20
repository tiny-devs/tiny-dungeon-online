import { Direction, Npcs } from '../Enums.ts'
import Room from '../map/rooms/room.ts'

export class Npc {
  public id: number
  public npcId: number
  public x: number
  public y: number
  public boardRows: number
  public boardColumns: number
  public roomId: number
  public room: Room
  public frequency: number = 500
  public moveChance: number = 0.25

  constructor(id: number,
      npcId: number,
      x: number, y: number,
      boardRows: number,
      boardColumns: number,
      room: Room) {
    this.id = id
    this.npcId = npcId
    this.x = x
    this.y = y
    this.roomId = room.id
    this.room = room
    this.boardRows = boardRows
    this.boardColumns = boardColumns

    this.heartBeat()
  }

  public move(key: Direction): boolean {
    let validMove = false

    switch (key) {
      case Direction.Right:
        if (this.x + 1 < this.boardRows) {
            if (this.notCollided(this.y,this.x + 1)) {
                this.x++
                validMove = true
            }
        }
        break;
      case Direction.Down:
        if (this.y + 1 < this.boardColumns) {
            if (this.notCollided(this.y + 1,this.x)) {
                this.y++
                validMove = true
            }
        }
        break;
      case Direction.Left:
        if (this.x - 1 >= 0) {
            if (this.notCollided(this.y,this.x - 1)) {
                this.x--
                validMove = true
            }
        }
        break;
      case Direction.Up:
        if (this.y - 1 >= 0) {
            if (this.notCollided(this.y - 1,this.x)) {
                this.y--
                validMove = true
            }
        }
        break;
    }

    return validMove
  }

  public getReturnData() {
    return {
      id: this.id,
      npcId: this.npcId,
      x: this.x,
      y: this.y,
      roomId: this.roomId
    }
  }

  private notCollided(y: number, x: number): boolean {
    const notSolidTile = this.room.solidLayer[y][x] === 0
    const notPlayer = !this.room.players.some(player => player.x == x && player.y == y)

    return notSolidTile && notPlayer
  }

  private heartBeat(): void {
    setTimeout(() => {
      const randomChance = Math.random()
      if (this.moveChance >= randomChance) {
        let moveWasValid = false
        let tryCount = 0
        while (tryCount <= 4) {
          moveWasValid = this.move(this.getRandomDirection())
          tryCount++

          if (moveWasValid) {
            this.room.clientHandler.broadcastNpcMove(this)
            break
          }
        }
      }

      this.heartBeat()
    }, this.frequency);
  }

  private getRandomDirection(): Direction {
    const directionInt = Math.floor(Math.random() * (5 - 1)) + 1
    return directionInt as Direction
  }
}