import { Direction, PveAttacker, ItemType, StepType } from '../Enums.ts'
import Room from '../map/rooms/room.ts'
import { Player } from './player.ts'
import { PveData } from '../pve/pveData.ts'
import NpcBase from './npcs/npcBase.ts'
import ItemBase from './items/itemBase.ts'
import DialogBase from "./npcs/passive/dialogs/dialogBase.ts"
import QuestBase from "./npcs/quests/questBase.ts"

export class Npc {
  public id: number
  public npcId: number
  public isAgressive: boolean
  public fieldOfView: number
  public anger: number
  public maxAnger: number
  public isChasing: boolean = false
  public fightingPlayer: null | Player = null
  public spawnX: number
  public spawnY: number
  public x: number
  public y: number
  public boardRows: number
  public boardColumns: number
  public roomId: number
  public room: Room
  public frequency: number
  public moveChance: number
  public moveCounter: number = 0
  public hp: number
  public maxHp: number
  public attack: number
  public defense: number
  public level: number
  public xpGiven: number
  public respawnTime: number
  public dead: boolean = false
  public dialog: DialogBase | null
  public drops: ItemBase[]
  public name: string
  public quest: QuestBase | null

  constructor(id: number,
      npcData: NpcBase,
      x: number, y: number,
      boardRows: number,
      boardColumns: number,
      room: Room) {
    this.id = id
    this.spawnX = x
    this.spawnY = y
    this.x = x
    this.y = y
    this.roomId = room.id
    this.room = room
    this.boardRows = boardRows
    this.boardColumns = boardColumns

    this.maxHp = npcData.hp
    this.hp = npcData.hp
    this.npcId = npcData.id
    this.isAgressive = npcData.agressive
    this.anger = npcData.anger
    this.maxAnger = npcData.anger
    this.fieldOfView = npcData.fieldOfView
    this.frequency = npcData.frequency
    this.moveChance = npcData.moveChance
    this.respawnTime = npcData.respawnTime
    this.attack = npcData.attack
    this.defense = npcData.defense
    this.level = npcData.level
    this.xpGiven = npcData.xpGiven
    this.dialog = npcData.dialog
    this.drops = npcData.drops
    this.name = npcData.name
    this.quest = npcData.quest

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
      hp: this.hp,
      maxHp: this.maxHp
    }
  }

  // all dialog logic was done in quite a rush to finish
  // please dont mind this messy code
  public talkTo(player: Player) {
    const playerQuest = player.quests.find(q => q.id == this.quest?.id)
    const npcFromQuestStep = player.quests.find(q => q.steps[q.currentStep].npcToTalk == this.name)
    const npcFromAnyQuestStep = player.quests.find(q => q.steps.find(s => s.npcToTalk == this.name))
    const questStepItemRetrieve = player.quests.find(q => q.steps[q.currentStep].type == StepType.ItemsToHave)
    const questStepItemReceive = player.quests.find(q => q.steps[q.currentStep].type == StepType.ItemsToReceive)
    const questStepLevelReach = player.quests.find(q => q.steps[q.currentStep].type == StepType.LevelToReach)
    let tradedItems = false

    if (this.dialog != null) {
      const hasEverTalked = this.dialog.playerCurrentLine.some(d => d.playerId == player.id)
      if (hasEverTalked || npcFromAnyQuestStep) {
        if (npcFromQuestStep && questStepLevelReach) {
          questStepLevelReach.checkLevelToReach(player)
        }
        if (npcFromQuestStep && (questStepItemRetrieve || questStepItemReceive)) {
          if (questStepItemRetrieve) {
            tradedItems = questStepItemRetrieve.checkItemsToHave(player)
            if (tradedItems) {
              this.room.clientHandler.unicastDialog(player, '-you give the quest items-')
              return
            } else {
              let newLine = npcFromQuestStep.checkNpcDialog(this.name, player)
              if (newLine != '') {
                this.room.clientHandler.unicastDialog(player, newLine)
                return
              }
            }
            return
          }
          if (questStepItemReceive) {
            tradedItems = questStepItemReceive.checkGaveItems(player)
            if (tradedItems) {
              this.room.clientHandler.unicastDialog(player, '-you receive some quest items-')
              return
            } else {
              this.room.clientHandler.unicastDialog(player, '-you dont have enough space-')
              return
            }
          }
        }
        if (npcFromQuestStep && !tradedItems) {
          let newLine = npcFromQuestStep.checkNpcDialog(this.name, player)
          if (newLine != '') {
            this.room.clientHandler.unicastDialog(player, newLine)
            return
          } else {
            var index = this.dialog.playerCurrentLine.map(d => d.playerId).indexOf(player.id)
            if (this.dialog.playerCurrentLine[index].line+1 >= this.dialog.playerCurrentLine[index].totalLines) {
              this.dialog.playerCurrentLine[index].line = 0
            } else {
              this.dialog.playerCurrentLine[index].line += 1
            }
            this.room.clientHandler.unicastDialog(player, this.dialog.dialogs[this.dialog.playerCurrentLine[index].line])
            return
          }
        } else if (!npcFromQuestStep){
          if (npcFromAnyQuestStep) {
            let newLine = npcFromAnyQuestStep.checkNpcDialog(this.name, player)
            if (newLine != '') {
              this.room.clientHandler.unicastDialog(player, newLine)
              return
            } else {
              var index = this.dialog.playerCurrentLine.map(d => d.playerId).indexOf(player.id)
              if (this.dialog.playerCurrentLine[index].line+1 >= this.dialog.playerCurrentLine[index].totalLines-1) {
                if (this.quest != null && !playerQuest){
                  player.getNewQuest(this.quest)
                }

                if (this.dialog.playerCurrentLine[index].line+1 >= this.dialog.playerCurrentLine[index].totalLines) {
                  this.dialog.playerCurrentLine[index].line = 0
                } else {
                  this.dialog.playerCurrentLine[index].line += 1
                }
              }
              else {
                this.dialog.playerCurrentLine[index].line += 1
              }
              this.room.clientHandler.unicastDialog(player, this.dialog.dialogs[this.dialog.playerCurrentLine[index].line])
              return
            }
          } else {
            var index = this.dialog.playerCurrentLine.map(d => d.playerId).indexOf(player.id)
            if (this.dialog.playerCurrentLine[index].line+1 >= this.dialog.playerCurrentLine[index].totalLines-1) {
              if (this.quest != null && !playerQuest){
                player.getNewQuest(this.quest)
              }

              if (this.dialog.playerCurrentLine[index].line+1 >= this.dialog.playerCurrentLine[index].totalLines) {
                this.dialog.playerCurrentLine[index].line = 0
              } else {
                this.dialog.playerCurrentLine[index].line += 1
              }
            }
            else {
              this.dialog.playerCurrentLine[index].line += 1
            }
            this.room.clientHandler.unicastDialog(player, this.dialog.dialogs[this.dialog.playerCurrentLine[index].line])
          }
        }
      } else {
        this.dialog.playerCurrentLine.push({playerId:player.id, line:0,totalLines:this.dialog.dialogs.length})
        this.room.clientHandler.unicastDialog(player, this.dialog.dialogs[0])
      }
    }
  }

  private passiveBehaviour() {
    let randomChance = Math.random()
    if (this.isChasing && (this.anger > 0)) {
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
          this.room.clientHandler.roomcastNpcMove(this)
          break
        }
      }
    }
  }

  private async agressiveBehaviour() {
    const result = this.checkSurroundings()
    if (result.found) {
      this.isChasing = true
      this.anger = this.maxAnger

      let moveResult = this.move(result.direction)
      if (moveResult.playerHit) {
        this.fightingPlayer = moveResult.playerHit
        if (moveResult.playerHit.fightingNpcId == null) {
          moveResult.playerHit.fightingNpcId = this.id
        }
        await this.engage(moveResult.playerHit)
      }

      this.room.clientHandler.roomcastNpcMove(this)
    } else {
      this.passiveBehaviour()
    }
  }

  private async delay(ms: number): Promise<unknown> {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  private async engage(player: Player) {
    let enemyAttackData = new PveData(this.room, player, this, PveAttacker.Npc)

    const damageCaused = this.getAttackDamage()
    let playerDefended = player.takeDamage(damageCaused, this.checkCriticalHit(damageCaused))

    enemyAttackData.damageCaused =  damageCaused - playerDefended
    enemyAttackData.damageDefended = playerDefended
    this.room.clientHandler.roomcastPveFight(enemyAttackData)

    await this.delay(1000)

    if (player.fightingNpcId == this.id) {
      let playerAttackData = new PveData(this.room, player, this, PveAttacker.Player)

      const damageTaken = player.getAttackDamage()
      let enemyDefended = this.takeDamage(damageTaken, player.checkCriticalHit(damageTaken), player)
  
      playerAttackData.damageCaused = damageTaken - enemyDefended
      playerAttackData.damageDefended = enemyDefended
      this.room.clientHandler.roomcastPveFight(playerAttackData)
    }

    if (this.dead) {
      player.fightingNpcId = null
      player.addXp(this.xpGiven)
      player.checkNpcKillForQuest(this.npcId)
      this.fightingPlayer = null
    }
  }

  private checkCriticalHit(hit: number): boolean {
    return hit > (this.attack - (this.attack/8))
  }

  private getAttackDamage(): number {
    const luckFactor = Math.random()
    if (luckFactor > 0.9) {
      return this.attack
    }
    return Math.floor(luckFactor * (this.attack))
  }

  private getDefenseFromDamage(crit: boolean): number {
    const minimalDefenseFromBadLuck = 0.5
    let luckFactor = Math.random() * (1 - minimalDefenseFromBadLuck) + minimalDefenseFromBadLuck
    if (luckFactor > 0.9) {
      return this.defense
    }
    if ((luckFactor < (minimalDefenseFromBadLuck + (luckFactor/2))) && crit) {
      luckFactor = Math.random() * (minimalDefenseFromBadLuck - 0.2) + 0.2
    }
    return Math.floor(luckFactor * (this.defense))
  }

  private takeDamage(dmg: number, crit: boolean, player: Player): number {
    let defense = this.getDefenseFromDamage(crit)
    defense = defense > dmg ? dmg : defense
    const actualDamage = (dmg - defense)

    this.hp-= actualDamage < 0 ? 0 : actualDamage
    if (this.hp <= 0) {
        this.hp = 0
        this.die(player)
    }

    return defense
  }

  private die(player: Player) {
    this.dropStuff(player)
    this.dead = true
    this.x = -1
    this.y = -1
    setTimeout(() => {
      this.dead = false
      this.hp = this.maxHp
      this.x = this.spawnX
      this.y = this.spawnY
      this.heartBeat()
    }, this.respawnTime);
  }

  private dropStuff(player: Player) {
    for(const drop of this.drops) {
      const randomChance = Math.random()
      if (drop.dropChance >= randomChance) {
        if (this.room.itemsLayer[this.y][this.x] == 0) {
          if (drop.type == ItemType.Money) {
            drop.coins = Math.floor(Math.random() * drop.coins) + 1 
          }
          if (drop.type == ItemType.Quest) {
            var isOnQuestStepThatNeedsItem = player.quests.some(
              q => q.steps[q.currentStep].itemsToHave.some(s => s.item == drop.itemId))
            if (isOnQuestStepThatNeedsItem) {
              this.room.addItem(this.y,this.x,drop)
            }
          } else {
            this.room.addItem(this.y,this.x,drop)
          }
        }
      }
    }
  }

  private checkSurroundings() {
    let playerInRange = null as null | Player
    let result = {found: false, direction: 0}

    if (this.fightingPlayer == null) {
      let playersInRange = this.room.players.filter(player => 
        ((Math.pow(player.x - this.x,2) + Math.pow(player.y - this.y,2)) <= this.fieldOfView)
      )
  
      playersInRange?.sort((a, b) => { 
        return (Math.pow(a.x - this.x,2) + Math.pow(a.y - this.y,2)) -
        (Math.pow(b.x - this.x,2) + Math.pow(b.y - this.y,2));
      })
  
      playerInRange = playersInRange[0]
    } else {
      if (this.fightingPlayer.currentRoomId == this.roomId) {
        playerInRange = this.fightingPlayer
      } else {
        this.fightingPlayer = null
      }
    }

    if (playerInRange) {
      if (playerInRange.clientWs.isClosed) {
        this.anger = 0
        this.isChasing = false
        if (this.fightingPlayer) {
          this.fightingPlayer = null
        }
        return result
      }

      result.found = true

      if (this.moveCounter == 0) {
        if (playerInRange.y != this.y) {
          this.moveCounter = 1
        }

        if (playerInRange.x < this.x) {
          result.direction = Direction.Left
        } else {
          result.direction = Direction.Right
        }
      } else {
        if (playerInRange.x != this.x) {
          this.moveCounter = 0
        }
        
        if (playerInRange.y > this.y) {
          result.direction = Direction.Down
        } else {
          result.direction = Direction.Up
        }
      }
    }

    return result
  }

  private notCollided(y: number, x: number): boolean {
    const notSolidTile = this.room.solidLayer[y][x] === 0
    const notPlayer = !this.getPlayerAtCoords(y, x)
    const notNpc = !this.hasNpc(y, x)

    return notSolidTile && notPlayer && notNpc
  }

  private hasNpc(y: number, x: number) {
    return this.room.npcs.some(npc => npc.x == x && npc.y == y)
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