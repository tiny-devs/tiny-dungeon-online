import { Npcs } from '../../../../../../shared/Enums.ts'
import LargeHp from "../../../../items/consumable/largeHp.ts";
import SmallHp from "../../../../items/consumable/smallHp.ts";
import NpcBase from '../../../npcBase.ts'
import PeterDialog from "../../dialogs/peterDialog.ts"

export default class Peter extends NpcBase {
    constructor() {
        super(Npcs.Merchant2, false, 'peter', 0, 0, 0, 0, 1000, 0.05, 0, 36, new PeterDialog(), [], null,
        true, [new LargeHp(1), new SmallHp(1)])
    }
}