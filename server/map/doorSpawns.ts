import { Rooms, RoomsInsides } from "../../shared/Enums.ts";
import { SolidLayersInsides } from "../../shared/solidLayers.ts";
import { NpcSpawnsInsides } from "./npcSpawns.ts";
import Door from "./rooms/door.ts";
import Exits from "./rooms/exits.ts";

export const DoorSpawns = {
  Mages: [
    new Door(8,11,RoomsInsides.MagesTower1,new Exits(null,Rooms.Mages,null,null,[],[8,12]),SolidLayersInsides.MagesTower1,NpcSpawnsInsides.MagesTower1,[8,15])
  ],
  Subitnof4: [
    new Door(10,9,RoomsInsides.SubitnofCastle1,new Exits(null,Rooms.Subitnof4,null,null,[],[10,10]),SolidLayersInsides.SubitnofCastle1,NpcSpawnsInsides.SubitnofCastle1,[8,15])
  ]
}