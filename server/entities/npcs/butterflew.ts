import { Npcs } from '../../../shared/Enums.ts'
import NpcBase from './npcBase.ts'
import SmallHp from '../items/consumable/smallHp.ts'
import BronzeHelm from "../items/bronzeHelm.ts"

export default class ButterFlew extends NpcBase {
    constructor() {
        super(Npcs.ButterFlew, true, 'butterflew', 0, 0, 0, 17, 10000, 0.25, 6, 36, null, [new BronzeHelm(0.8), new SmallHp(0.4)], null)
    }
}