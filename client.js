const readline = require('readline');
var socket = require('socket.io-client')('http://localhost:8084');

socket.on('connect', function () {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    socket.on('message', function (msg) {
        console.log(msg);
    });

    while (true) {
        rl.question('> ', (nome) => {
            socket.send('Jogador: ' + nome + ' entrou na dungeon.');
            rl.close();
        });
    }
});  

