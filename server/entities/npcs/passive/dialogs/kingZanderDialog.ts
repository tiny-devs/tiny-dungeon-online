import DialogBase from "./dialogBase.ts"

export default class KingZanderDialog extends DialogBase {
    constructor() {
        super(['Hello traveller!',
        'I\'m king Zander, carer of Subitnof',
        'I take very good care of my people',
        'but recently I\'ve been having trouble',
        'dealing with Ogres',
        'could you help our city by getting rid of some?',
        '-quest: somebody once told me-',''])
    }
}