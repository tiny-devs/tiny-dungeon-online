import { Npcs } from '../../Enums.ts'
import NpcBase from './npcBase.ts'
import BluriteDagger from '../items/bluriteDagger.ts'
import BluriteSword from '../items/bluriteSword.ts'
import IronArmour from "../items/ironArmour.ts"
import IronLegs from "../items/ironLegs.ts"

export default class Ogre extends NpcBase {
    constructor() {
        super(Npcs.Ogre, true, 'ogre', 0, 0, 0, 30, 10000, 0.25, 6, 36, null, [new BluriteDagger(0.2), new BluriteSword(0.5), new IronArmour(0.8), new IronLegs(0.8)], null)
    }
}