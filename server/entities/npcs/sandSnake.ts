import { Npcs } from '../../Enums.ts'
import NpcBase from './npcBase.ts'
import BluriteHelm from '../items/bluriteHelm.ts'
import BluriteDagger from "../items/bluriteDagger.ts"
import BluriteArmour from "../items/bluriteArmour.ts"
import AdamantLegs from "../items/adamantLegs.ts"

export default class SandSnake extends NpcBase {
    constructor() {
        super(Npcs.SandSnake, true, 'sandsnake', 0, 0, 0, 40, 10000, 0.25, 6, 36, null, [new AdamantLegs(0.1), new BluriteArmour(0.3), new BluriteHelm(0.4), new BluriteDagger(0.8)], null)
    }
}