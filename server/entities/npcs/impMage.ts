import { Npcs } from '../../Enums.ts'
import NpcBase from './npcBase.ts'
import Coffee from '../items/coffee.ts'
import WoodenLegs from '../items/woodenLegs.ts'

export default class ImpMage extends NpcBase {
    constructor() {
        super(Npcs.ImpMage, true, 0, 1, 0, 5, 10000, 0.25, 4, 36, null, [new WoodenLegs(0.2),new Coffee(0.4)])
    }
}