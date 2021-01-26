import { Npcs } from '../../../../../Enums.ts'
import NpcBase from '../../../npcBase.ts'
import KinleyDialog from "../../dialogs/kinleyDialog.ts"

export default class Kinley extends NpcBase {
    constructor() {
        super(Npcs.Merchant1, false, 'kinley', 0, 0, 0, 0, 1000, 0.05, 0, 36, new KinleyDialog(), [], null)
    }
}