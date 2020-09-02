export enum Command {
    Login = 1,
    Move,
    Ping,
    Pong,
    Error,
    NpcMove,
    NpcsInRoom,
    Pve,
    ItemsInRoom,
    ItemPick,
    ItemDrop,
    ItemUse,
    ItemWear,
    ItemRemove,
    ItemDroped,
    Stats,
    Message,
    Dialog,
    Rank
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
    Empty = 0,
    Coffee,
    Coins,
    BronzeDagger
}

export enum ItemType {
    Money = 0,
    Consumable,
    Weareable,
    Temporary
}

export enum GearType {
    None = 0,
    Head,
    Torso,
    Legs,
    Weapon
}