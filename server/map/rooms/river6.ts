import Room from './room.ts'
import { Rooms } from '../../Enums.ts'
import Exits from "./exits.ts"
import { ClientHandler } from '../../clientHandler.ts'
import { SolidLayers } from "../../../shared/solidLayers.ts"
import Slime from "../../entities/npcs/slime.ts"
import ImpMeelee from "../../entities/npcs/impMeelee.ts"
import Witch from "../../entities/npcs/witch.ts"

export default class River6 extends Room{
  constructor(id: number, clientHandler: ClientHandler) {
    super (id, new Exits(Rooms.Woods22, -1, Rooms.River5, Rooms.River7), clientHandler)
    this.solidLayer = SolidLayers.River6
    this.npcSpawns = this.buildNpcSpawns()
    this.spawnNpcs()
  }

  private buildNpcSpawns(): any {
    return [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,new ImpMeelee(),0,0,0,0,0,0,new ImpMeelee(),0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,new Slime(),0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,new ImpMeelee(),0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,new Witch(),0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]
  }
}