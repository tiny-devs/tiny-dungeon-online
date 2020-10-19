import { Npcs } from '../../../../Enums.ts'
import NpcBase from '../../npcBase.ts'
import MytklashsFlowerDialog from "../dialogs/mytklashsFlowerDialog.ts"

export default class MytklashsFlower extends NpcBase {
    constructor() {
        super(Npcs.MytklashsFlower, false, 'mytklashs flower', 0, 0, 0, 0, 1000, 0, 0, 36, new MytklashsFlowerDialog(), [], null)
    }
}