import DialogBase from "./dialogBase.ts"

export default class UpdatesDogDialog extends DialogBase {
    constructor() {
        super(['Hi, Im the woofdates dog',
        'The most recent woofdate is...',
        'Item inspection! 2024-11-01',
        'After THREE YEARS the lazy dev',
        'decided to be nostalgic',
        'and now you can right click items!',
        '-woofdate read-'])
    }
}