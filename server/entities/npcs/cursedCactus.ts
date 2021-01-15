import { Npcs } from '../../Enums.ts'
import NpcBase from './npcBase.ts'
import AdamantHelm from '../items/adamantHelm.ts'

export default class CursedCactus extends NpcBase {
    constructor() {
        super(Npcs.CursedCactus, true, 'cursedcactus', 0, 0, 0, 40, 10000, 0.25, 6, 36, null, [new AdamantHelm(0.3)], null)
    }
}