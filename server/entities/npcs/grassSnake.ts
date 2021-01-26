import { Npcs } from '../../Enums.ts'
import NpcBase from './npcBase.ts'
import BronzeHelm from "../items/bronzeHelm.ts"
import BronzeSword from "../items/bronzeSword.ts"
import IronArmour from "../items/ironArmour.ts"
import SmallHp from "../items/consumable/smallHp.ts"

export default class GrassSnake extends NpcBase {
    constructor() {
        super(Npcs.GrassSnake, true, 'grasssnake', 0, 0, 0, 20, 10000, 0.25, 6, 36, null, [new IronArmour(0.4), new BronzeSword(0.8), new BronzeHelm(0.8), new SmallHp(0.4)], null)
    }
}