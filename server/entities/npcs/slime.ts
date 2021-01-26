import { Npcs } from '../../Enums.ts'
import NpcBase from './npcBase.ts'
import Coffee from '../items/consumable/coffee.ts'

export default class Slime extends NpcBase {
    constructor() {
        super(Npcs.Slime, true, 'slime', 0, 0, 0, 1, 10000, 0.1, 3, 24, null, [new Coffee(0.4)], null)
    }
}