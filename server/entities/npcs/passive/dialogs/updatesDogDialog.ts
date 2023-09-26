import DialogBase from "./dialogBase.ts"

export default class UpdatesDogDialog extends DialogBase {
    constructor() {
        super(['Hi, Im the woofdates dog',
        'The most recent woofdate is...',
        'Classic Zelda-like transitions!',
        'It may slow down your traversal a bit',
        'but this is intended',
        'I hope you like this beautiful effect!',
        '-woofdate read-'])
    }
}