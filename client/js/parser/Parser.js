class Parser {
    constructor(client) {
        this.client = client;
    }

    parse(data) {
        try {
            const command = +data.split(',')[0];

            switch (command) {
                case Command.Login:
                    this.parseLogin(data);
                    break
                case Command.Move:
                    this.parseMove(data);
                    break
                case Command.Error:
                    this.parseError(data);
                    break
            }

        } catch(e) {
            console.log(e)
        }
    }

    parseLogin(data) {
        const loginData = new ParseLogin(data);

        this.client.game.applyServerRules(loginData.serverRules);
        this.client.game.spritesLayer.addPlayers(loginData.players);
        if (this.client.playerId === '') {
            this.client.playerId = loginData.playerId;
        }
        this.client.drawSprites();
    }

    parseMove(data) {
        const moveData = new ParseMove(data);

        this.client.updatePlayer(moveData);
    }

    parseError(data) {
        const errorData = new ParseError(data);

        if(!alert(errorData.message)) {
            window.location.reload();
        }
    }
}