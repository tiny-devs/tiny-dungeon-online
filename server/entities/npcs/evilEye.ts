import { Npcs } from '../../Enums.ts'
import NpcBase from './npcBase.ts'
import Coffee from '../items/consumable/coffee.ts'
import IronSword from "../items/ironSword.ts"
import BronzeSword from "../items/bronzeSword.ts"

export default class EvilEye extends NpcBase {
    constructor() {
        super(Npcs.EvilEye, true, 'evileye', 0, 0, 0, 25, 10000, 0.25, 6, 42, null, [new IronSword(0.8), new BronzeSword(0.9), new Coffee(0.4)], null)
    }
}