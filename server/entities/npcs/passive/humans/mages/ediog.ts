import { Npcs } from '../../../../../../shared/Enums.ts'
import NpcBase from '../../../npcBase.ts'
import TheSacredStone from "../../../quests/humans/mages/theSacredStone.ts"
import EdiogDialog from "../../dialogs/ediogDialog.ts"

export default class Ediog extends NpcBase {
    constructor() {
        super(Npcs.Wizard3, false, 'ediog', 0, 0, 0, 0, 1000, 0.05, 0, 36, new EdiogDialog(), [], new TheSacredStone())
    }
}