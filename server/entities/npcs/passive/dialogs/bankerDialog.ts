import DialogBase from "./dialogBase.ts"

export default class BankerDialog extends DialogBase {
    constructor() {
        super([
            'Welcome to the bank.',
            'I keep your belongings safe.',
            'Store and withdraw anytime.',
            ''
        ])
    }
}
