const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('> Type URL to connect: ', (url) => {
    init(url);
});

function init(url) {
    var socket = require('socket.io-client')(url);

    socket.on('connect', function () {

        socket.on('message', function (msg) {
            console.log(msg);
        });

        loop ();

        function loop () {
            rl.question('> ', (message) => {
                socket.send(message);
                loop();
            });
        }
    });
}
  

