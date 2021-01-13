import { Npcs } from '../../Enums.ts'
import NpcBase from './npcBase.ts'

export default class Chicken extends NpcBase {
    constructor() {
        super(Npcs.Chicken, false, 'chicken', 0, 0, 0, 0, 1000, 0.25, 0, 36, null, [], null)
    }
}