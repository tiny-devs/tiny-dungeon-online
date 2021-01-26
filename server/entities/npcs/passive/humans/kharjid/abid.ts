import { Npcs } from '../../../../../Enums.ts'
import NpcBase from '../../../npcBase.ts'
import AbidDialog from "../../dialogs/abidDialog.ts"

export default class Abid extends NpcBase {
    constructor() {
        super(Npcs.DesertMale3, false, 'abid', 0, 0, 0, 0, 1000, 0.05, 0, 36, new AbidDialog(), [], null)
    }
}