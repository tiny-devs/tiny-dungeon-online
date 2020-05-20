import { Direction } from './Enums.ts'

export class Player {
    public id: string;
    public name: string;
    public color: string;
    public x: number;
    public y: number;
    public clientWs: any;

    constructor(id: string,
        name: string,
        color: string,
        x: number, y: number,
        clientWs: any) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.x = x;
        this.y = y;
        this.clientWs = clientWs;
    }

    public move(key: Direction, boardRows: number, boardColumns: number) {
        switch (key) {
            case Direction.Right:
                if (this.x + 1 < boardRows) {
                    this.x++;
                }
                break;
            case Direction.Down:
                if (this.y + 1 < boardColumns) {
                    this.y++;
                }
                break;
            case Direction.Left:
                if (this.x - 1 >= 0) {
                    this.x--;
                }
                break;
            case Direction.Up:
                if (this.y - 1 >= 0) {
                    this.y--;
                }
                break;
        }
    }
}