import DialogBase from "./dialogBase.ts"

export default class ZeroDialog extends DialogBase {
    constructor() {
        super(['Hi! My name is Zero', 'I know the secret to become One!'])
    }
}