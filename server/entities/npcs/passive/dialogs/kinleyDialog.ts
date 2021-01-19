import DialogBase from "./dialogBase.ts"

export default class KinleyDialog extends DialogBase {
    constructor() {
        super(['Hello traveller.',
        'My name is Kinley',
        'my friend there is Peter',
        'We have some of the best items',
        'to sell around here',
        'but we are not yet open',
        'come back another time',''])
    }
}