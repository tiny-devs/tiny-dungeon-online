import DialogBase from "./dialogBase.ts"

export default class OswaldDialog extends DialogBase {
    constructor() {
        super(['Hello traveller, I\'m Oswald',
        'Looking for something to buy?',
        'The store will be opened soon',
        'please, comeback later!',''])
    }
}