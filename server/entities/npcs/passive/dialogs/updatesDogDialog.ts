import DialogBase from "./dialogBase.ts"

export default class UpdatesDogDialog extends DialogBase {
    constructor() {
        super(['Hi, Im the woofdates dog',
        'The most recent woofdate is...',
        'You can target different enemies!!',
        'before this update you were forced to',
        'only hit the first enemy you touched',
        'but now you can walk towards any enemy',
        'arround you to switch your target!',
        'but you still cant fight enemies that',
        'are already fighting someone else',
        'thanks Douglas!',
        'woof woof!',
        '-woofdate read-'])
    }
}