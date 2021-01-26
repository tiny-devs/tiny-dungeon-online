import { Npcs } from '../../Enums.ts'
import NpcBase from './npcBase.ts'
import BronzeSword from '../items/bronzeSword.ts'
import Bread from "../items/consumable/bread.ts"

export default class Rat extends NpcBase {
    constructor() {
        super(Npcs.Rat, true, 'rat', 0, 0, 0, 15, 10000, 0.25, 6, 36, null, [new Bread(0.4), new BronzeSword(0.4)], null)
    }
}