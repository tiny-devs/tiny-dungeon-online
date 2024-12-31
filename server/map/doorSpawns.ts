import { ItemsIds, Quests, Rooms, RoomsInsides } from "../../shared/Enums.ts";
import { SolidLayersInsides } from "../../shared/solidLayers.ts";
import { NpcSpawnsInsides } from "./npcSpawns.ts";
import Door from "./rooms/door.ts";
import DoorConditions from "./rooms/doorConditions.ts";
import Exits from "./rooms/exits.ts";

export const DoorSpawns = {
  Gnomes1: [
    new Door(12,7,RoomsInsides.MagesTower1,new Exits(null,Rooms.Gnomes1,null,null,[],[11,7]),SolidLayersInsides.MagesTower1,NpcSpawnsInsides.MagesTower1,[8,15], new DoorConditions([ItemsIds.JamulsGuitar],[],[],0,0,0,'You need a magic instrument to get in'))
  ],
  Mages: [
    new Door(8,11,RoomsInsides.MagesTower1,new Exits(null,Rooms.Mages,null,null,[],[8,12]),SolidLayersInsides.MagesTower1,NpcSpawnsInsides.MagesTower1,[8,15], null)
  ],
  Subitnof4: [
    new Door(10,9,RoomsInsides.SubitnofCastle1,new Exits(null,Rooms.Subitnof4,null,null,[],[10,10]),SolidLayersInsides.SubitnofCastle1,NpcSpawnsInsides.SubitnofCastle1,[8,15], null)
  ]
}