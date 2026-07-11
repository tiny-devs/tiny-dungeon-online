export class ParsePvp {
  public attackerPlayerId: string
  public defenderPlayerId: string
  public damageCaused: number
  public attackerHp: number
  public defenderHp: number
  public roomId: number

  constructor(data: string) {
    const p = data.split(',')
    this.attackerPlayerId = p[1]
    this.defenderPlayerId = p[2]
    this.damageCaused = +p[3]
    this.attackerHp = +p[4]
    this.defenderHp = +p[5]
    this.roomId = +p[6]
  }
}
