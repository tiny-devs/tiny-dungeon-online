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
    Woods2,
    Woods3,
    Woods4,
    Woods5,
    Woods6,
    Woods7,
    Woods8,
    River14,
    Woods9,
    Woods10,
    Woods11,
    Gnomes1,
    Gnomes2,
    Woods12,
    Woods13,
    River12,
    DeepLake,
    River13,
    Woods14,
    Woods15,
    Woods16,
    Gnomes3,
    Gnomes4,
    Woods17,
    River10,
    River11,
    Plains1,
    Plains2,
    Woods18,
    Woods19,
    Woods20,
    Woods21,
    Woods22,
    River8,
    River9,
    Plains3,
    Plains4,
    Plains5,
    GoblinCamp,
}

export enum Npcs {
    Dog = 1,
    Spider,
    Zero,
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