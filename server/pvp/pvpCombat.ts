import { Player } from '../entities/player.ts'
import { isPvpRoom } from '../../shared/pvp.ts'
import { PvpData } from './pvpData.ts'

function delay(ms: number): Promise<unknown> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function findPlayerById(player: Player, id: string): Player | undefined {
  const inRoom = player.currentRoom.players.find(p => p.id === id)
  if (inRoom) {
    return inRoom
  }
  for (const room of player.currentRoom.clientHandler.map.rooms) {
    const found = room.players.find(p => p.id === id)
    if (found) {
      return found
    }
  }
  return undefined
}

export function stillSameFight(a: Player, b: Player): boolean {
  return (
    !a.dead &&
    !b.dead &&
    a.fightingPlayerId === b.id &&
    b.fightingPlayerId === a.id &&
    a.currentRoomId === b.currentRoomId &&
    isPvpRoom(a.currentRoomId) &&
    a.clientWs.readyState !== WebSocket.CLOSED &&
    b.clientWs.readyState !== WebSocket.CLOSED
  )
}

export function clearPvpLocks(player: Player): void {
  const oppId = player.fightingPlayerId
  player.fightingPlayerId = null
  player.pvpEngaging = false
  if (oppId) {
    const opp = findPlayerById(player, oppId)
    if (opp && opp.fightingPlayerId === player.id) {
      opp.fightingPlayerId = null
      opp.pvpEngaging = false
    }
  }
}

export async function tryEngage(attacker: Player, defender: Player): Promise<void> {
  if (!attacker || !defender) {
    return
  }
  if (attacker.id === defender.id) {
    return
  }
  if (attacker.dead || defender.dead) {
    return
  }
  if (
    attacker.clientWs.readyState === WebSocket.CLOSED ||
    defender.clientWs.readyState === WebSocket.CLOSED
  ) {
    return
  }
  if (!isPvpRoom(attacker.currentRoomId) || !isPvpRoom(defender.currentRoomId)) {
    return
  }
  if (
    attacker.currentRoomId !== defender.currentRoomId ||
    attacker.currentRoom !== defender.currentRoom
  ) {
    return
  }
  if (attacker.pvpEngaging || defender.pvpEngaging) {
    return
  }
  if (attacker.fightingNpcId != null || defender.fightingNpcId != null) {
    return
  }

  const bothFree =
    attacker.fightingPlayerId == null && defender.fightingPlayerId == null
  const mutual =
    attacker.fightingPlayerId === defender.id &&
    defender.fightingPlayerId === attacker.id
  if (!bothFree && !mutual) {
    return
  }

  await engage(attacker, defender)
}

export async function engage(attacker: Player, defender: Player): Promise<void> {
  attacker.fightingPlayerId = defender.id
  defender.fightingPlayerId = attacker.id
  attacker.pvpEngaging = true
  defender.pvpEngaging = true

  try {
    // Swing 1 — initiator
    const dmg1 = attacker.getAttackDamage()
    const def1 = defender.takeDamage(dmg1, attacker.checkCriticalHit(dmg1))
    const net1 = dmg1 - def1

    const swing1 = new PvpData(attacker.currentRoom, attacker, defender)
    swing1.damageCaused = net1
    swing1.damageDefended = def1
    attacker.currentRoom.clientHandler.roomcastPvpFight(swing1)

    if (attacker.dead || defender.dead) {
      clearPvpLocks(attacker)
      return
    }

    await delay(1000)

    // Swing 2 — counter only if still the same fight
    if (stillSameFight(attacker, defender)) {
      const dmg2 = defender.getAttackDamage()
      const def2 = attacker.takeDamage(dmg2, defender.checkCriticalHit(dmg2))
      const net2 = dmg2 - def2

      const swing2 = new PvpData(defender.currentRoom, defender, attacker)
      swing2.damageCaused = net2
      swing2.damageDefended = def2
      defender.currentRoom.clientHandler.roomcastPvpFight(swing2)

      if (attacker.dead || defender.dead) {
        clearPvpLocks(attacker)
      }
    }
  } finally {
    attacker.pvpEngaging = false
    defender.pvpEngaging = false
    // NOTE: do NOT clear fightingPlayerId here if both alive —
    // sticky 1v1 lock until death/leave/disconnect (mirrors PvE).
  }
}
