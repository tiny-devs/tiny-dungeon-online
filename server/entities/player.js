class Player {
    constructor(id, name, color, x, y) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.x = x;
        this.y = y;
    }

    move(key, boardRows, boardColumns) {
        switch (key) {
            case 'right':
                if (this.x + 1 < boardRows) {
                    this.x++;
                }
                break;
            case 'down':
                if (this.y + 1 < boardColumns) {
                    this.y++;
                }
                break;
            case 'left':
                if (this.x - 1 >= 0) {
                    this.x--;
                }
                break;
            case 'up':
                if (this.y - 1 >= 0) {
                    this.y--;
                }
                break;
        }
    }
}

module.exports = Player;