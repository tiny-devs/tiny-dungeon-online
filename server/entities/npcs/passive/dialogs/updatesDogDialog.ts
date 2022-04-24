import DialogBase from "./dialogBase.ts"

export default class UpdatesDogDialog extends DialogBase {
    constructor() {
        super(['Hi, Im the woofdates dog',
        'The most recent woofdate is...',
        'you can drop money now!',
        'this update will allow player transactions',
        'and stores wont be the only way to buy or sell',
        'enjoy!',
        'woof woof!',
        '-woofdate read-'])
    }
}