import { Npcs } from '../../Enums.ts'
import NpcBase from './npcBase.ts'
import FireDagger from '../items/fireDagger.ts'
import FireHelm from '../items/fireHelm.ts'
import AdamantSword from "../items/adamantSword.ts"

export default class FireBlob extends NpcBase {
    constructor() {
        super(Npcs.FireBlob, true, 'fireblob', 0, 0, 0, 50, 10000, 0.25, 6, 36, null, [new FireHelm(0.1), new FireDagger(0.1), new AdamantSword(0.9)], null)
    }
}