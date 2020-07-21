import { Direction, Npcs } from '../Enums.ts'
import Room from '../map/rooms/room.ts'

export class Npc {
  public id: number
  public npcId: number
  public isAgressive: boolean
  public fieldOfView: number = 6
  public anger: number = 6
  public maxAnger: number = 6
  public chasing: boolean = false
  public x: number
  public y: number
  public boardRows: number
  public boardColumns: number
  public roomId: number
  public room: Room
  public frequency: number = 500
  public moveChance: number = 0.25
  public isFollowing: boolean = false

  constructor(id: number,
      npcId: number,
      agressive: boolean,
      x: number, y: number,
      boardRows: number,
      boardColumns: number,
      room: Room) {
    this.id = id
    this.npcId = npcId
    this.isAgressive = agressive
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

  private passiveBehaviour() {
    let randomChance = Math.random()
    if (this.chasing && (this.anger > 0)) {
      this.anger--
      randomChance = this.moveChance
    }
    
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
  }

  private agressiveBehaviour() {
    const result = this.checkSurroundings()
    if (result.found) {
      this.chasing = true
      this.anger = this.maxAnger
      this.move(result.direction)
      this.room.clientHandler.broadcastNpcMove(this)
    } else {
      this.passiveBehaviour()
    }
  }

  private checkSurroundings() {
    let result = {found: false, direction: 0}
    for(let i=1; i<5; i++) {
      let foundPlayer = this.checkDirection(i as Direction)
      if (foundPlayer) {
        result.found = true
        result.direction = i as Direction
        break
      }
    }

    return result
  }

  private checkDirection(direction: Direction): boolean {
    let viewed = 1
    let foundPlayer = false

    switch (direction) {
      case Direction.Right:
        while (viewed <= this.fieldOfView) {
          if (this.hasPlayer(this.y,this.x + viewed)) {
            foundPlayer = true
            viewed=this.fieldOfView
          }
          viewed++
        }
        
        break
      case Direction.Down:
        while (viewed <= this.fieldOfView) {
          if (this.hasPlayer(this.y + viewed,this.x)) {
            foundPlayer = true
            viewed=this.fieldOfView
          }
          viewed++
        }
        
        break
      case Direction.Left:
        while (viewed <= this.fieldOfView) {
          if (this.hasPlayer(this.y,this.x - viewed)) {
            foundPlayer = true
            viewed=this.fieldOfView
          }
          viewed++
        }
        
        break
      case Direction.Up:
        while (viewed <= this.fieldOfView) {
          if (this.hasPlayer(this.y - viewed,this.x)) {
            foundPlayer = true
            viewed=this.fieldOfView
          }
          viewed++
        }
        
        break
    }

    return foundPlayer
  }

  private notCollided(y: number, x: number): boolean {
    const notSolidTile = this.room.solidLayer[y][x] === 0
    const notPlayer = !this.hasPlayer(y, x)

    return notSolidTile && notPlayer
  }

  private hasPlayer(y: number, x: number) {
    return this.room.players.some(player => player.x == x && player.y == y)
  }

  private heartBeat(): void {
    setTimeout(() => {
      if (this.isAgressive) {
        this.agressiveBehaviour()
      } else {
        this.passiveBehaviour()
      }
      

      this.heartBeat()
    }, this.frequency);
  }

  private getRandomDirection(): Direction {
    const directionInt = Math.floor(Math.random() * (5 - 1)) + 1
    return directionInt as Direction
  }
}