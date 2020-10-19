

export default class DialogBase {
    public dialogs: string[]
    public playerCurrentLine: {playerId:string,line:number,totalLines:number}[] = []
    constructor(dialogs: string[]) {
        this.dialogs = dialogs
    }
}