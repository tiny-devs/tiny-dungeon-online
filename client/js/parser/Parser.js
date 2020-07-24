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
                case Command.NpcsInRoom:
                        this.parseNpcsInRoom(data);
                        break
                case Command.NpcMove:
                        this.parseNpcMove(data);
                        break
                case Command.Pve:
                        this.parsePve(data);
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
        
        this.client.game.spritesLayer.addPlayers(loginData.players);
        if (this.client.loggedIn === false) {
            this.client.loggedIn = true;
            this.client.playerId = loginData.playerId;
            this.client.game.applyServerRules(loginData.serverRules);
        }
        this.client.drawSprites();
    }

    parseMove(data) {
        const moveData = new ParseMove(data);

        this.client.updatePlayer(moveData);
    }

    parseNpcMove(data) {
        const npcMoveData = new ParseNpcMove(data);

        this.client.updateNpc(npcMoveData);
    }

    parseNpcsInRoom(data) {
        const npcsInRoomData = new ParseNpcsInRoom(data);
        
        this.client.game.spritesLayer.addNpcs(npcsInRoomData.npcs);
        this.client.drawSprites();
    }

    parsePve(data) {
        const pveData = new ParsePve(data)

        this.client.drawPve(pveData)
    }

    parseError(data) {
        const errorData = new ParseError(data);

        if(!alert(errorData.message)) {
            window.location.reload();
        }
    }
}