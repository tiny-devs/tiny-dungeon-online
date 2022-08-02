import { Npcs } from '../../../../../../shared/Enums.ts'
import NpcBase from '../../../npcBase.ts'
import EdmondDialog from "../../dialogs/edmondDialog.ts"

export default class Edmond extends NpcBase {
    constructor() {
        super(Npcs.BlackMaleFarmer, false, 'edmond', 0, 0, 0, 0, 1000, 0.05, 0, 36, new EdmondDialog(), [], null)
    }
}