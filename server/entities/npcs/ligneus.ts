import { Npcs } from '../../Enums.ts'
import NpcBase from './npcBase.ts'
import Coffee from '../items/coffee.ts'
import WoodenDagger from '../items/woodenDagger.ts'
import BronzeDagger from '../items/bronzeDagger.ts'
import WoodenSword from '../items/woodenSword.ts'
import WoodenArmour from '../items/woodenArmour.ts'

export default class Ligneus extends NpcBase {
    constructor() {
        super(Npcs.Ligneus, true, 'ligneus', 0, 0, 0, 15, 10000, 0.15, 8, 36, null, [new WoodenDagger(0.7),new WoodenSword(0.7),new WoodenArmour(0.7),new BronzeDagger(0.1),new Coffee(0.5)], null)
    }
}