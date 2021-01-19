import DialogBase from "./dialogBase.ts"

export default class BeatriceDialog extends DialogBase {
    constructor() {
        super(['Hello! I\'m Beatrice',
        'I can\'t talk much right now',
        'I\'m training to become a doctor!',
        'This place needs good doctors',
        'and great warriors.',
        'So we can heal the weak and fight the monsters',''])
    }
}