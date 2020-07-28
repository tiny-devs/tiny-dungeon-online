export enum Command {
    Login = 1,
    Move,
    Ping,
    Pong,
    Error,
    NpcMove,
    NpcsInRoom,
    Pve
}

export enum Direction {
    Up = 1,
    Down,
    Left,
    Right,
}

export enum Rooms {
    Initial = 0,
    Woods,
}

export enum Npcs {
    Dog = 1,
    Spider,
}

export enum PveAttacker {
	Player = 0,
    Npc,
}

export enum Items {
    Coffee = 0,
}