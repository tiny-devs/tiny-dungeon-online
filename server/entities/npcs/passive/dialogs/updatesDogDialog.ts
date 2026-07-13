import DialogBase from "./dialogBase.ts"

export default class UpdatesDogDialog extends DialogBase {
    constructor() {
        super(['Hi, Im the woofdates dog',
        'The most recent woofdate is...',
        'PVP and BANK! 2026-07-13',
        'PVP means player vs player',
        'Becareful with the DESERT',
        'If you go there now, its a PVP zone!',
        'If you die to PVP...',
        'you lose all gold!',
        'But you can store gold (and items)',
        'In the new bank in Subitnof!',
        'Enjoy!',
        '-woofdate read-'])
    }
}