import { Npcs } from '../../../shared/Enums.ts'
import NpcBase from './npcBase.ts'
import IronSword from '../items/ironSword.ts'
import IronDagger from '../items/ironDagger.ts'
import IronHelm from '../items/ironHelm.ts'
import BronzeHelm from '../items/bronzeHelm.ts'
import BronzeLegs from "../items/bronzeLegs.ts"
import SmallHp from "../items/consumable/smallHp.ts"

export default class SkeletonKnight extends NpcBase {
    constructor() {
        super(Npcs.SkeletonKnight, true, 'skeleton knight', 0, 0, 0, 25, 10000, 0.15, 6, 36, null, [new IronDagger(0.2),new IronSword(0.1),new IronHelm(0.3),new BronzeHelm(0.7),new BronzeLegs(0.7),new SmallHp(0.4)], null)
    }
}