export enum Direction {
    Up = 1,
    Down = 2,
    Left = 3,
    Right = 4,
}

export enum Command {
    Login = 1,
    Move = 2,
    Ping = 3,
    Pong = 4,
    Error = 5,
    NpcMove = 6,
    NpcsInRoom = 7,
    Pve = 8,
}

export enum Rooms {
    Initial = 0,
    Woods = 1,
}

export enum PveAttacker {
    Player = 0,
    Npc = 1,
}
