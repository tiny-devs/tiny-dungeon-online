import DialogBase from "./dialogBase.ts"

export default class UpdatesDogDialog extends DialogBase {
    constructor() {
        super(['Hi, Im the woofdates dog',
        'The most recent woofdate is...',
        'PVP! 2026-07-10',
        'PVP means player vs player',
        'Becareful with the DESERT',
        'If you go there now, its a PVP zone!',
        'If you die to PVP...',
        'you lose all gold!',
        '-woofdate read-'])
    }
}