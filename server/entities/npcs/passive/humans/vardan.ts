import { Npcs } from '../../../../Enums.ts'
import NpcBase from '../../npcBase.ts'
import HelpTheLakeVillage from "../../quests/humans/helpTheLakeVillage.ts"
import VardanDialog from "../dialogs/vardanDialog.ts"

export default class Vardan extends NpcBase {
    constructor() {
        super(Npcs.OldMan, false, 'vardan', 0, 0, 0, 0, 1000, 0, 0, 36, new VardanDialog(), [], new HelpTheLakeVillage())
    }
}