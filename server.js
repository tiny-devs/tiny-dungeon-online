var port = process.env.PORT || 8084;
var io = require('socket.io').listen(port);
var players = [];
var serverPrefix = 'tiny-server> ';

console.log(serverPrefix + 'server is running on port ' + port + '...');

io.sockets.on('connection', function (socket) {
	players.push({ name: '', id: socket.id});

	socket.on('message', function (e) {
		if (getPlayerName(socket.id) == '') {
			setPlayerName(socket.id, e);
			let welcomeMessage = serverPrefix + 'Welcome, ' + e;
			io.sockets.emit('message', welcomeMessage);
			console.log(welcomeMessage);
		}
		else {
			let formattedMessage = getPlayerName(socket.id) + '> ' + e;
			console.log(formattedMessage);

			io.sockets.emit('message', formattedMessage);
		}
	});
	
	socket.on('disconnected', function () {
		console.log(serverPrefix + getPlayerName(playerId) + ' disconnected!');
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