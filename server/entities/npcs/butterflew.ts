import { Npcs } from '../../Enums.ts'
import NpcBase from './npcBase.ts'
import Coffee from '../items/consumable/coffee.ts'
import BronzeHelm from "../items/bronzeHelm.ts"

export default class ButterFlew extends NpcBase {
    constructor() {
        super(Npcs.ButterFlew, true, 'butterflew', 0, 0, 0, 17, 10000, 0.25, 6, 36, null, [new BronzeHelm(0.8), new Coffee(0.4)], null)
    }
}