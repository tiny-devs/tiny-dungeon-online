import { Npcs } from '../../../../../Enums.ts'
import NpcBase from '../../../npcBase.ts'
import PeterDialog from "../../dialogs/peterDialog.ts"

export default class Peter extends NpcBase {
    constructor() {
        super(Npcs.Merchant2, false, 'peter', 0, 0, 0, 0, 1000, 0.05, 0, 36, new PeterDialog(), [], null)
    }
}