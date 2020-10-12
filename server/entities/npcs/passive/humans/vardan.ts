import { Npcs } from '../../../../Enums.ts'
import NpcBase from '../../npcBase.ts'
import VardanDialog from "../dialogs/vardanDialog.ts"

export default class Vardan extends NpcBase {
    constructor() {
        super(Npcs.OldMan, false, 0, 0, 0, 0, 1000, 0, 0, 36, new VardanDialog(), [])
    }
}