import { Npcs } from '../../../../../../shared/Enums.ts'
import IronArmour from "../../../../items/ironArmour.ts";
import IronHelm from "../../../../items/ironHelm.ts";
import IronLegs from "../../../../items/ironLegs.ts";
import IronSword from "../../../../items/ironSword.ts";
import NpcBase from '../../../npcBase.ts'
import KinleyDialog from "../../dialogs/kinleyDialog.ts"

export default class Kinley extends NpcBase {
    constructor() {
        super(Npcs.Merchant1, false, 'kinley', 0, 0, 0, 0, 1000, 0.05, 0, 36, new KinleyDialog(), [], null,
        true, [new IronSword(1), new IronLegs(1), new IronArmour(1), new IronHelm(1)])
    }
}