import { Direction } from './Enums.ts'

export class Player {
    public id: string;
    public name: string;
    public color: string;
    public x: number;
    public y: number;
    public matrix: number[][] = [];
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

    public move(key: Direction, boardRows: number, boardColumns: number, collisionLayer: any): boolean {
        let validMove = true

        switch (key) {
            case Direction.Right:
                if ((this.x + 1 < boardRows) && (collisionLayer[this.y][this.x + 1] === 0)) {
                    this.x++;
                } else {
                    validMove = false
                }
                break;
            case Direction.Down:
                if ((this.y + 1 < boardColumns) && (collisionLayer[this.y + 1][this.x] ===  0)) {
                    this.y++;
                } else {
                    validMove = false
                }
                break;
            case Direction.Left:
                if ((this.x - 1 >= 0) && (collisionLayer[this.y][this.x - 1] ===  0)) {
                    this.x--;
                } else {
                    validMove = false
                }
                break;
            case Direction.Up:
                if ((this.y - 1 >= 0) && (collisionLayer[this.y - 1][this.x] ===  0)) {
                    this.y--;
                } else {
                    validMove = false
                }
                break;
        }

        return validMove
    }

    public getReturnData() {
        return {
            id: this.id,
            name: this.name,
            color: this.color,
            x: this.x,
            y: this.y,
            matrix: this.matrix
        }
    }
}