import DialogBase from "./dialogBase.ts"

export default class UpdatesDogDialog extends DialogBase {
    constructor() {
        super(['Hi, Im the woofdates dog',
        'Every time a new woofdate comes, I tell you',
        'The most recent woofdate is...',
        'well, me',
        'but I swear, lazy dev will make stores',
        'THIS MONTH',
        'woof woof!',
        '-woofdate read-'])
    }
}