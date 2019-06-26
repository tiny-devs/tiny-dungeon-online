const colors = require('colors');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('> Type URL to connect: ', (url) => {
    init(url);
});

function init(url) {
    const socket = require('socket.io-client')(url);

    socket.on('connect', () => {
        console.log('connected! type your name:'.green);

        socket.on('message', function (msg) {
            console.log(msg);
        });

        loop ();

        function loop () {
            rl.question('', (message) => {
                socket.send(message);
                loop();
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('connection interrupted, please run the client again'.red);
        socket.close();
    });
}
  

