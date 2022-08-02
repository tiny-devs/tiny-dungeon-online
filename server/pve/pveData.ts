import { Player } from "../entities/player.ts";
import { Npc } from "../entities/npc.ts";
import Room from "../map/rooms/room.ts";
import { PveAttacker } from "../../shared/Enums.ts";

export class PveData {
	public room: Room
	public player: Player
	public npc: Npc
	public attacker: PveAttacker
	public damageCaused: number
	public damageDefended: number

	constructor(room: Room,
	player: Player,
	npc: Npc,
	attacker: PveAttacker) {
		this.room = room
		this.player = player
		this.npc = npc
		this.attacker = attacker
		this.damageCaused = 0
		this.damageDefended = 0
	}
}