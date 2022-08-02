import { Npcs } from '../../../shared/Enums.ts'
import NpcBase from './npcBase.ts'
import BluriteHelm from '../items/bluriteHelm.ts'
import IronHelm from "../items/ironHelm.ts"
import IronLegs from "../items/ironLegs.ts"
import SmallHp from "../items/consumable/smallHp.ts"

export default class SandCat extends NpcBase {
    constructor() {
        super(Npcs.SandCat, true, 'sandcat', 0, 0, 0, 30, 10000, 0.25, 6, 36, null, [new BluriteHelm(0.2), new IronHelm(0.8), new IronLegs(0.8), new SmallHp(0.9)], null)
    }
}