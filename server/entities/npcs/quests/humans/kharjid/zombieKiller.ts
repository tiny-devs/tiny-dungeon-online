import { Npcs, Quests, RewardType, StepType } from "../../../../../../shared/Enums.ts"
import QuestBase from "../../questBase.ts"
import StepBase from "../../stepBase.ts"
import { MonstersToKillBase } from "../../monstersToKillBase.ts"

export default class ZombieKiller extends QuestBase {
    constructor() {
        super(Quests.ZombieKiller,
            [
                new StepBase(StepType.MonstersToKill,
                [
                    new MonstersToKillBase(Npcs.Zombie, 50),
                ],
                'mathuis',[],[],0),
                new StepBase(StepType.NpcToTalk,[],'mathuis',
                [
                    'Thanks for killing all those zombies',
                    'I still hate this place, but I feel',
                    'a tiny bit better now',
                    '-you received 2500xp!-'
                ],[],0),
            ],
            RewardType.Xp,
            null,
            2500,
            'I hate the desert, thanks for killing some zombies tho...')
    }
}