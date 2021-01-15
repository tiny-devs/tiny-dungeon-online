import { Npcs } from '../../Enums.ts'
import NpcBase from './npcBase.ts'
import Coffee from '../items/coffee.ts'
import BronzeSword from '../items/bronzeSword.ts'

export default class Rat extends NpcBase {
    constructor() {
        super(Npcs.Rat, true, 'rat', 0, 0, 0, 15, 10000, 0.25, 6, 36, null, [new Coffee(0.4), new BronzeSword(0.4)], null)
    }
}