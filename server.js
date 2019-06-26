const port = process.env.PORT || 8084;
const io = require('socket.io').listen(port);
const serverPrefix = 'tiny-server>';
let formattedMessage = '';
let players = [];

console.log(`${serverPrefix} server is running on port ${port}...`);

io.sockets.on('connection', (socket) => {
	players.push({ name: '', id: socket.id});

	socket.on('message', (e) => {
		if (getPlayerName(socket.id) == '') {
			setPlayerName(socket.id, e);
			formattedMessage = `${serverPrefix} Welcome ${e}`;
			io.sockets.emit('message', formattedMessage);
			console.log(formattedMessage);
		}
		else {
			formattedMessage = getPlayerName(socket.id) + '> ' + e;
			console.log(formattedMessage);

			socket.broadcast.emit('message', formattedMessage);
		}
	});
	
	socket.on('disconnect', () => {
		formattedMessage = `${serverPrefix} ${getPlayerName(socket.id)} disconnected!`;
		io.sockets.emit('message', formattedMessage);
		console.log(formattedMessage);
		removePlayer(socket.id);
	});
});

function getPlayerName(playerId) {
	let playerIndex = players.map(p => p.id).indexOf(playerId);
	return players[playerIndex].name;
}

function setPlayerName(playerId, name) {
	let playerIndex = players.map(p => p.id).indexOf(playerId);
	players[playerIndex].name = name;
}

function removePlayer(playerId) {
	let playerIndex = players.map(p => p.id).indexOf(playerId);
	players.splice(playerIndex, 1);
}