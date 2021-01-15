import { Npcs } from '../../Enums.ts'
import NpcBase from './npcBase.ts'
import BluriteHelm from '../items/bluriteHelm.ts'
import BluriteDagger from "../items/bluriteDagger.ts"
import BluriteArmour from "../items/bluriteArmour.ts"
import AdamantHelm from "../items/adamantHelm.ts"

export default class Zombie extends NpcBase {
    constructor() {
        super(Npcs.Zombie, true, 'zombie', 0, 0, 0, 45, 10000, 0.25, 6, 36, null, [new AdamantHelm(0.1), new BluriteArmour(0.3), new BluriteHelm(0.4), new BluriteDagger(0.8)], null)
    }
}