import DialogBase from "./dialogBase.ts"

export default class EdwardDialog extends DialogBase {
    constructor() {
        super(['Hello adventurer',
        'I\'m Mage Edward',
        'I study and practice old magic',
        'I don\'t have any request for you',
        'Some other day maybe',''])
    }
}