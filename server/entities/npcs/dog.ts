import { Npcs } from "../../Enums.ts"
import NpcBase from "./npcBase.ts"

export default class Dog extends NpcBase {
    constructor() {
        super(Npcs.Dog, false, 1, 0, 0, 1000, 500, 0.25, 0, 36)
    }
}