import { Npcs } from '../../../../Enums.ts'
import NpcBase from '../../npcBase.ts'
import FeemlunkDialog from "../dialogs/feemlunkDialog.ts"

export default class Feemlunk extends NpcBase {
    constructor() {
        super(Npcs.AncientGnome, false, 0, 0, 0, 0, 1000, 0, 0, 36, new FeemlunkDialog(), [])
    }
}