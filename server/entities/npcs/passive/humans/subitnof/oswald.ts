import { Npcs } from '../../../../../../shared/Enums.ts'
import BronzeSword from "../../../../items/bronzeSword.ts";
import Bread from "../../../../items/consumable/bread.ts";
import Coffee from "../../../../items/consumable/coffee.ts";
import SmallHp from "../../../../items/consumable/smallHp.ts";
import NpcBase from '../../../npcBase.ts'
import OswaldDialog from "../../dialogs/oswaldDialog.ts"

export default class Oswald extends NpcBase {
    constructor() {
        super(Npcs.CityMale1, false, 'oswald', 0, 0, 0, 0, 1000, 0.05, 0, 36, new OswaldDialog(), [], null, true,
        [new Bread(1), new Coffee(1), new SmallHp(1), new BronzeSword(1)])
    }
}