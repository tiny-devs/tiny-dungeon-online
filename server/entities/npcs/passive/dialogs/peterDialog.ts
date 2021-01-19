import DialogBase from "./dialogBase.ts"

export default class PeterDialog extends DialogBase {
    constructor() {
        super(['Hi adventurer!',
        'Looking for some goods to buy?',
        'well keep looking',
        '\'cause we\'re not selling anything',
        'YET...',
        'come back some other time',''])
    }
}