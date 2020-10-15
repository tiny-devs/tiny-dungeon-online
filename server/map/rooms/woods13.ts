import Room from './room.ts'
import { Rooms } from '../../Enums.ts'
import Exits from "./exits.ts"
import { ClientHandler } from '../../clientHandler.ts'
import { SolidLayers } from "../../../shared/solidLayers.ts"
import ImpMage from "../../entities/npcs/impMage.ts"
import Slime from "../../entities/npcs/slime.ts"
import Bee from "../../entities/npcs/bee.ts"

export default class Woods13 extends Room{
  constructor(id: number, clientHandler: ClientHandler) {
    super (id, new Exits(Rooms.Woods6, Rooms.River10, Rooms.Woods12, Rooms.River12), clientHandler)
    this.solidLayer = SolidLayers.Woods13
    this.npcSpawns = this.buildNpcSpawns()
    this.spawnNpcs()
  }

  private buildNpcSpawns(): any {
    return [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,new Slime(),0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,new ImpMage(),0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,new Bee(),0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,new Bee(),0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]
  }
}