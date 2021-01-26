import { Npcs } from '../../Enums.ts'
import NpcBase from './npcBase.ts'
import Coffee from '../items/consumable/coffee.ts'
import WoodenDagger from '../items/woodenDagger.ts'
import WoodenSword from '../items/woodenDagger.ts'
import WoodenHelm from '../items/woodenHelm.ts'
import BronzeLegs from "../items/bronzeLegs.ts"

export default class Witch extends NpcBase {
    constructor() {
        super(Npcs.Witch, true, 'witch', 0, 0, 0, 10, 10000, 0.25, 5, 36, null, [new BronzeLegs(0.1), new WoodenDagger(0.3),new WoodenSword(0.4),new WoodenHelm(0.5),new Coffee(0.4)], null)
    }
}