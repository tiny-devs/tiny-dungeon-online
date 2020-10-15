import { Game } from '../../startup/Game'
import { Rooms } from '../../models/Enums'
import { Woods } from './Woods'
import { Woods2 } from './Woods2'
import { Woods3 } from './Woods3'
import { Woods4 } from './Woods4'
import { Woods5 } from './Woods5'
import { Woods6 } from './Woods6'
import { Woods7 } from './Woods7'
import { Woods8 } from './Woods8'
import { River14 } from './River14'
import { Woods9 } from './Woods9'
import { Woods10 } from './Woods10'
import { Woods11 } from './Woods11'
import { Gnomes1 } from './Gnomes1'
import { Gnomes2 } from './Gnomes2'
import { Woods12 } from './Woods12'
import { Woods13 } from './Woods13'
import { River12 } from './River12'
import { DeepLake } from './DeepLake'
import { River13 } from './River13'
import { Woods14 } from './Woods14'
import { Woods15 } from './Woods15'
import { Woods16 } from './Woods16'
import { Gnomes3 } from './Gnomes3'
import { Gnomes4 } from './Gnomes4'
import { Woods17 } from './Woods17'
import { River10 } from './River10'
import { River11 } from './River11'
import { Plains1 } from './Plains1'
import { Plains2 } from './Plains2'
import { Woods18 } from './Woods18'
import { Woods19 } from './Woods19'
import { Woods20 } from './Woods20'
import { Woods21 } from './Woods21'
import { Woods22 } from './Woods22'
import { River8 } from './River8'
import { River9 } from './River9'
import { Plains3 } from './Plains3'
import { Plains4 } from './Plains4'
import { Plains5 } from './Plains5'
import { GoblinCamp } from './GoblinCamp'
import { Woods23 } from './Woods23'
import { River4 } from './River4'
import { River5 } from './River5'
import { River6 } from './River6'
import { River7 } from './River7'
import { Plains6 } from './Plains6'
import { Plains7 } from './Plains7'
import { Plains8 } from './Plains8'
import { Plains9 } from './Plains9'
import { InitialRoom } from './InitialRoom'

export class Map {
    private game: Game
    public rooms: Array<InitialRoom | Woods>

    constructor(game: Game) {
        this.game = game
        this.rooms = this.buildMap()
    }

    public getRoomById(roomId: Rooms) {
        return this.rooms.find((room) => room.id === roomId) || this.rooms[roomId]
    }

    private buildMap() {
        return [new InitialRoom(this.game, Rooms.Initial), new Woods(this.game, Rooms.Woods), new Woods2(this.game, Rooms.Woods2),new Woods3(this.game, Rooms.Woods3),new Woods4(this.game, Rooms.Woods4),new Woods5(this.game, Rooms.Woods5),new Woods6(this.game, Rooms.Woods6),new Woods7(this.game, Rooms.Woods7),new Woods8(this.game, Rooms.Woods8),new River14(this.game, Rooms.River14),
        new Woods9(this.game, Rooms.Woods9), new Woods10(this.game, Rooms.Woods10), new Woods11(this.game, Rooms.Woods11), new Gnomes1(this.game, Rooms.Gnomes1), new Gnomes2(this.game, Rooms.Gnomes2), new Woods12(this.game, Rooms.Woods12), new Woods13(this.game, Rooms.Woods13), new River12(this.game, Rooms.River12), new DeepLake(this.game, Rooms.DeepLake), new River13(this.game, Rooms.River13),
        new Woods14(this.game, Rooms.Woods14), new Woods15(this.game, Rooms.Woods15), new Woods16(this.game, Rooms.Woods16), new Gnomes3(this.game, Rooms.Gnomes3), new Gnomes4(this.game, Rooms.Gnomes4), new Woods17(this.game, Rooms.Woods17), new River10(this.game, Rooms.River10), new River11(this.game, Rooms.River11), new Plains1(this.game, Rooms.Plains1), new Plains2(this.game, Rooms.Plains2),
        new Woods18(this.game, Rooms.Woods18), new Woods19(this.game, Rooms.Woods19), new Woods20(this.game, Rooms.Woods20), new Woods21(this.game, Rooms.Woods21), new Woods22(this.game, Rooms.Woods22), new River8(this.game, Rooms.River8), new River9(this.game, Rooms.River9), new Plains3(this.game, Rooms.Plains3), new Plains4(this.game, Rooms.Plains4), new Plains5(this.game, Rooms.Plains5),
        new GoblinCamp(this.game, Rooms.GoblinCamp), new Woods23(this.game, Rooms.Woods23), new River4(this.game, Rooms.River4), new River5(this.game, Rooms.River5), new River6(this.game, Rooms.River6), new River7(this.game, Rooms.River7), new Plains6(this.game, Rooms.Plains6), new Plains7(this.game, Rooms.Plains7), new Plains8(this.game, Rooms.Plains8), new Plains9(this.game, Rooms.Plains9)]
    }
}
