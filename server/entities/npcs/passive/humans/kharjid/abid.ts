import { Npcs } from '../../../../../../shared/Enums.ts'
import AdamantDagger from "../../../../items/adamantDagger.ts";
import AdamantSword from "../../../../items/adamantSword.ts";
import BluriteArmour from "../../../../items/bluriteArmour.ts";
import BluriteHelm from "../../../../items/bluriteHelm.ts";
import BluriteLegs from "../../../../items/bluriteLegs.ts";
import NpcBase from '../../../npcBase.ts'
import AbidDialog from "../../dialogs/abidDialog.ts"

export default class Abid extends NpcBase {
    constructor() {
        super(Npcs.DesertMale3, false, 'abid', 0, 0, 0, 0, 1000, 0.05, 0, 36, new AbidDialog(), [], null,
        true, [new BluriteArmour(1), new BluriteLegs(1), new BluriteHelm(1), new AdamantDagger(1), new AdamantSword(1)])
    }
}