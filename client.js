const colors = require('colors');
const readline = require('readline');
let connectedToUrl = false;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function questionUrl() {
    rl.question('> Type URL to connect: ', (url) => {
        init(url);
        setTimeout(() => {
            if (!connectedToUrl) {
                console.log(`Failed to connect to ${url}.\n`);
                questionUrl();
            }
        }, 7000);
    });
}

function init(url) {
    const socket = require('socket.io-client')(url);

    socket.on('connect', () => {
        connectedToUrl = true;
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

questionUrl();
