import { Npcs } from '../../../shared/Enums.ts'
import NpcBase from './npcBase.ts'
import Coffee from '../items/consumable/coffee.ts'
import BronzeDagger from '../items/bronzeDagger.ts'
import BronzeSword from '../items/bronzeDagger.ts'
import IronHelm from '../items/ironHelm.ts'
import BronzeArmour from "../items/bronzeArmour.ts"
import SmallHp from "../items/consumable/smallHp.ts"

export default class Skeleton extends NpcBase {
    constructor() {
        super(Npcs.Skeleton, true, 'skeleton', 0, 0, 0, 20, 10000, 0.35, 6, 36, null, [new IronHelm(0.1),new BronzeDagger(0.6),new BronzeSword(0.6),new BronzeArmour(0.6),new SmallHp(0.4)], null)
    }
}