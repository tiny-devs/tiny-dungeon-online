import { Direction, Npcs } from '../Enums.ts'
import Room from '../map/rooms/room.ts'
import { Player } from './player.ts'

export class Npc {
  public id: number
  public npcId: number
  public isAgressive: boolean
  public fieldOfView: number = 36
  public anger: number = 6
  public maxAnger: number = 6
  public chasing: boolean = false
  public spawnX: number
  public spawnY: number
  public x: number
  public y: number
  public boardRows: number
  public boardColumns: number
  public roomId: number
  public room: Room
  public frequency: number = 500
  public moveChance: number = 0.25
  public hp: number
  public totalHp: number
  public attack: number = 5
  public defense: number = 5
  public respawnTime: number = 10000
  public dead: boolean = false

  constructor(id: number,
      npcId: number,
      agressive: boolean,
      hp: number,
      x: number, y: number,
      boardRows: number,
      boardColumns: number,
      room: Room) {
    this.id = id
    this.npcId = npcId
    this.isAgressive = agressive
    this.spawnX = x
    this.spawnY = y
    this.x = x
    this.y = y
    this.roomId = room.id
    this.room = room
    this.boardRows = boardRows
    this.boardColumns = boardColumns
    this.totalHp = hp
    this.hp = hp

    this.heartBeat()
  }

  public move(key: Direction): any {
    let result = {valid:false,playerHit:null as unknown as Player | undefined}

    switch (key) {
      case Direction.Right:
        if (this.x + 1 < this.boardRows) {
            if (this.notCollided(this.y,this.x + 1)) {
                this.x++
                result.valid = true
            } else {
              result.playerHit = this.getPlayerAtCoords(this.y,this.x + 1)
            }
        }
        break;
      case Direction.Down:
        if (this.y + 1 < this.boardColumns) {
            if (this.notCollided(this.y + 1,this.x)) {
                this.y++
                result.valid = true
            } else {
              result.playerHit = this.getPlayerAtCoords(this.y + 1,this.x)
            }
        }
        break;
      case Direction.Left:
        if (this.x - 1 >= 0) {
            if (this.notCollided(this.y,this.x - 1)) {
                this.x--
                result.valid = true
            } else {
              result.playerHit = this.getPlayerAtCoords(this.y,this.x - 1)
            }
        }
        break;
      case Direction.Up:
        if (this.y - 1 >= 0) {
            if (this.notCollided(this.y - 1,this.x)) {
                this.y--
                result.valid = true
            } else {
              result.playerHit = this.getPlayerAtCoords(this.y - 1,this.x)
            }
        }
        break;
    }

    return result
  }

  public getReturnData() {
    return {
      id: this.id,
      npcId: this.npcId,
      x: this.x,
      y: this.y,
      roomId: this.roomId,
      hp: this.hp
    }
  }

  private passiveBehaviour() {
    let randomChance = Math.random()
    if (this.chasing && (this.anger > 0)) {
      this.anger--
      randomChance = this.moveChance
    }
    
    if (this.moveChance >= randomChance) {
      let moveResult = {valid:false,playerHit:false}
      let tryCount = 0
      while (tryCount <= 4) {
        moveResult = this.move(this.getRandomDirection())
        tryCount++

        if (moveResult.valid) {
          this.room.clientHandler.broadcastNpcMove(this)
          break
        }
      }
    }
  }

  private async agressiveBehaviour() {
    const result = this.checkSurroundings()
    if (result.found) {
      this.chasing = true
      this.anger = this.maxAnger

      let moveResult = this.move(result.direction)
      if (moveResult.playerHit) {
        await this.engage(moveResult.playerHit)
      }

      this.room.clientHandler.broadcastNpcMove(this)
    } else {
      this.passiveBehaviour()
    }
  }

  private async delay(ms: number): Promise<unknown> {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  private async engage(player: Player) {
    const damageCaused = this.getAttackDamage()
    player.takeDamage(damageCaused)

    await this.delay(500)

    const damageTaken = player.getAttackDamage()
    this.takeDamage(damageTaken)
  }

  private getAttackDamage(): number {
    return Math.floor(Math.random() * (this.attack))
  }

  private getDefenseFromDamage(): number {
    return Math.floor(Math.random() * (this.defense))
  }

  private takeDamage(dmg: number) {
    const defense = this.getDefenseFromDamage()
    const actualDamage = (dmg - defense)

    this.hp-= actualDamage < 0 ? 0 : actualDamage
    if (this.hp <= 0) {
        this.hp = 0
        this.die()
    }

    console.log(`dealt ${dmg} damage, defended ${defense} (${actualDamage}), enemy has ${this.hp}`)
  }

  private die() {
    this.dead = true
    this.x = -1
    this.y = -1
    setTimeout(() => {
      this.dead = false
      this.hp = this.totalHp
      this.x = this.spawnX
      this.y = this.spawnY
      this.heartBeat()
    }, this.respawnTime);
  }

  private checkSurroundings() {
    let result = {found: false, direction: 0}

    let playerInRange = this.room.players.find(player => 
      (Math.pow(player.x - this.x,2) + Math.pow(player.y - this.y,2)) <= this.fieldOfView
    )
    if (playerInRange) {
      result.found = true
      if (playerInRange.y > this.y) {
        result.direction = Direction.Down
      } else if (playerInRange.x < this.x) {
        result.direction = Direction.Left
      } else if (playerInRange.x > this.x) {
        result.direction = Direction.Right
      } else {
        result.direction = Direction.Up
      }
    }

    return result
  }

  private notCollided(y: number, x: number): boolean {
    const notSolidTile = this.room.solidLayer[y][x] === 0
    const notPlayer = !this.getPlayerAtCoords(y, x)

    return notSolidTile && notPlayer
  }

  private getPlayerAtCoords(y: number, x: number): Player | undefined{
    return this.room.players.find(player => player.x == x && player.y == y)
  }

  private heartBeat(): void {
    setTimeout(async () => {
      if (this.isAgressive) {
        await this.agressiveBehaviour()
      } else {
        this.passiveBehaviour()
      }

      if (!this.dead) {
        this.heartBeat()
      }
    }, this.frequency);
  }

  private getRandomDirection(): Direction {
    const directionInt = Math.floor(Math.random() * (5 - 1)) + 1
    return directionInt as Direction
  }
}