import DialogBase from "./dialogBase.ts"

export default class ElexiusDialog extends DialogBase {
    constructor() {
        super(['Hi there dear traveller',
        'I\'m Wizard Elexius',
        'I study the sacred stone',
        'We\'re trying to uncover the history',
        'Of this land',
        'We must know our past to understand our present.',
        'Never forget this.',''])
    }
}