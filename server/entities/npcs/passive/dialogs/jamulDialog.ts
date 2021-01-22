import DialogBase from "./dialogBase.ts"

export default class JamulDialog extends DialogBase {
    constructor() {
        super(['Hi kid. I\'m Jamul',
        'I have a coconut business',
        'but i\'ve lost my machete',
        'I believe some zombie stole it',
        'do you think you can help me?',
        '-quest: Jamul\'s Machete-',''])
    }
}