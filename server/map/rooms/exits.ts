export default class Exits {
    public n: number | null
    public s: number | null
    public w: number | null
    public e: number | null
    public customXYN: number[]
    public customXYS: number[]
    public customXYW: number[]
    public customXYE: number[]

    constructor(n: number | null, s: number | null, w: number | null, e: number | null,
        customXYN: number[] = [],
        customXYS: number[] = [],
        customXYW: number[] = [],
        customXYE: number[] = [],
    ) {
        this.n = n
        this.s = s
        this.w = w
        this.e = e
        this.customXYN = customXYN
        this.customXYS = customXYS
        this.customXYW = customXYW
        this.customXYE = customXYE
    }

    public hasNorth(): boolean {
        return this.n !== null
    }

    public hasSouth(): boolean {
        return this.s !== null
    }
    
    public hasWest(): boolean {
        return this.w !== null
    }

    public hasEast(): boolean {
        return this.e !== null
    }
}