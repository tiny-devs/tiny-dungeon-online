import { Npcs } from "../../Enums.ts"
import NpcBase from "./npcBase.ts"

export default class Spider extends NpcBase {
    constructor() {
        super(Npcs.Spider, true, 10, 3, 3, 10000, 500, 0.25, 6, 36)
    }
}