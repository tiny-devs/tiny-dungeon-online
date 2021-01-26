import { Npcs } from '../../../../../Enums.ts'
import NpcBase from '../../../npcBase.ts'
import BeatriceDialog from "../../dialogs/beatriceDialog.ts"

export default class Beatrice extends NpcBase {
    constructor() {
        super(Npcs.CityFemale2, false, 'beatrice', 0, 0, 0, 0, 1000, 0.05, 0, 36, new BeatriceDialog(), [], null)
    }
}