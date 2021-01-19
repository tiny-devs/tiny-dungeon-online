import { Npcs } from '../../../../../Enums.ts'
import NpcBase from '../../../npcBase.ts'
import OswaldDialog from "../../dialogs/oswaldDialog.ts"

export default class Oswald extends NpcBase {
    constructor() {
        super(Npcs.CityMale1, false, 'oswald', 0, 0, 0, 0, 1000, 0.05, 0, 36, new OswaldDialog(), [], null)
    }
}