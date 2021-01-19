import { Npcs } from '../../../../../Enums.ts'
import NpcBase from '../../../npcBase.ts'
import LugrusDialog from "../../dialogs/lugrusDialog.ts"

export default class Lugrus extends NpcBase {
    constructor() {
        super(Npcs.CityMale8, false, 'lugrus', 0, 0, 0, 0, 1000, 0.05, 0, 36, new LugrusDialog(), [], null)
    }
}