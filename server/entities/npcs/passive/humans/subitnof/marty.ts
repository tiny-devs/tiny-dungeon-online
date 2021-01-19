import { Npcs } from '../../../../../Enums.ts'
import NpcBase from '../../../npcBase.ts'
import MartyDialog from "../../dialogs/martyDialog.ts"

export default class Marty extends NpcBase {
    constructor() {
        super(Npcs.CityMale7, false, 'marty', 0, 0, 0, 0, 1000, 0.05, 0, 36, new MartyDialog(), [], null)
    }
}