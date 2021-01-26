import DialogBase from "./dialogBase.ts"

export default class BorisDialog extends DialogBase {
    constructor() {
        super(['Hello, my name is Boris',
        'I\'m a hunter, I also sell the food I hunt',
        'but I\'m not selling anything yet',''])
    }
}