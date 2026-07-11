import { Rooms } from './Enums.ts'

export function isPvpRoom(roomId: number): boolean {
  const name = Rooms[roomId]
  return typeof name === 'string' && name.startsWith('Desert')
}
