import { Npcs } from '../../../../../../shared/Enums.ts'
import NpcBase from '../../../npcBase.ts'
import WarriorSomeday from "../../../quests/humans/subitnof/warriorSomeday.ts"
import EphanDialog from "../../dialogs/ephanDialog.ts"

export default class Ephan extends NpcBase {
    constructor() {
        super(Npcs.CityMale2, false, 'ephan', 0, 0, 0, 0, 1000, 0.05, 0, 36, new EphanDialog(), [], new WarriorSomeday())
    }
}