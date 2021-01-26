import { Npcs } from '../../../../../Enums.ts'
import NpcBase from '../../../npcBase.ts'
import JasmineDialog from "../../dialogs/jasmineDialog.ts"

export default class Jasmine extends NpcBase {
    constructor() {
        super(Npcs.CityFemale1, false, 'jasmine', 0, 0, 0, 0, 1000, 0.05, 0, 36, new JasmineDialog(), [], null)
    }
}