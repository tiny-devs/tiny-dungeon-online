import { Npcs } from '../../../../../Enums.ts'
import NpcBase from '../../../npcBase.ts'
import JamesDialog from "../../dialogs/jamesDialog.ts"

export default class James extends NpcBase {
    constructor() {
        super(Npcs.CityMale4, false, 'james', 0, 0, 0, 0, 1000, 0.05, 0, 36, new JamesDialog(), [], null)
    }
}