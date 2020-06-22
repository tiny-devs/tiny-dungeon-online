export default class Exits {
    public n: number
    public s: number
    public w: number
    public e: number

    constructor(n: number, s: number, w: number, e: number) {
        this.n = n
        this.s = s
        this.w = w
        this.e = e
    }

    public hasNorth(): boolean {
        return this.n !== -1
    }

    public hasSouth(): boolean {
        return this.s !== -1
    }
    
    public hasWest(): boolean {
        return this.w !== -1
    }

    public hasEast(): boolean {
        return this.e !== -1
    }
}