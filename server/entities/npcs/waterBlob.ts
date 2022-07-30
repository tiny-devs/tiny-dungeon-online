import { Npcs } from '../../../shared/Enums.ts'
import NpcBase from './npcBase.ts'
import IronSword from '../items/ironSword.ts'
import BluriteDagger from "../items/bluriteDagger.ts"
import BluriteSword from "../items/bluriteSword.ts"
import LargeHp from "../items/consumable/largeHp.ts"

export default class WaterBlob extends NpcBase {
    constructor() {
        super(Npcs.WaterBlob, true, 'waterblob', 0, 0, 0, 30, 10000, 0.25, 6, 36, null, [new BluriteSword(0.5), new BluriteDagger(0.4), new IronSword(0.7), new LargeHp(0.7)], null)
    }
}