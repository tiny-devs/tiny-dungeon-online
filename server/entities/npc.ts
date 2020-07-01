import { Direction } from '../Enums.ts'
import Room from '../map/rooms/room.ts'

export class Npc {
  public id: number
  public npcId: number
  public name: string
  public color: string
  public x: number
  public y: number
  public boardRows: number
  public boardColumns: number
  public matrix: number[][] = []
  public currentRoomId: number
  public currentRoom: Room
  public frequency: number = 200
  public moveChance: number = 0.25

  constructor(id: number,
      npcId: number,
      name: string,
      color: string,
      x: number, y: number,
      frequency: number,
      moveChance: number,
      boardRows: number,
      boardColumns: number,
      currentRoom: Room) {
    this.id = id
    this.npcId = npcId
    this.name = name
    this.color = color
    this.x = x
    this.y = y
    this.currentRoomId = currentRoom.id
    this.currentRoom = currentRoom
    this.frequency = frequency
    this.moveChance = moveChance
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
      name: this.name,
      color: this.color,
      x: this.x,
      y: this.y,
      matrix: this.matrix,
      currentRoomId: this.currentRoomId
    }
  }

  private notCollided(y: number, x: number): boolean {
    return this.currentRoom.solidLayer[y][x] === 0
  }

  private heartBeat(): void {
    setTimeout(() => {
      const randomChance = Math.random()
      if (this.moveChance >= randomChance) {
        const moveWasValid = this.move(this.getRandomDirection())
        if (moveWasValid) {
          this.currentRoom.clientHandler.broadcastNpcMove(this)
        }
      }

      this.heartBeat()
    }, this.frequency);
  }

  getRandomDirection(): Direction {
    const directionInt = Math.floor(Math.random() * (4 - 2) ) + 1
    return directionInt as Direction
  }
}