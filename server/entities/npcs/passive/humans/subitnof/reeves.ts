import { Npcs } from '../../../../../../shared/Enums.ts'
import NpcBase from '../../../npcBase.ts'
import ReevesDialog from "../../dialogs/reevesDialog.ts"

export default class Reeves extends NpcBase {
    constructor() {
        super(Npcs.CityMale3, false, 'reeves', 0, 0, 0, 0, 1000, 0.05, 0, 36, new ReevesDialog(), [], null)
    }
}