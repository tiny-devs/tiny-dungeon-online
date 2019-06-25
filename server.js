var port = process.env.PORT || 8084;
var io = require('socket.io').listen(port);

console.log('tiny-server> server is running on port ' + port + '...');

io.sockets.on('connection', function (socket) {
    
	socket.on('message', function (e) {
		console.log(e) 
		
		//send this message to all sockets
		io.sockets.emit('message', e);
	});
	
	socket.on('disconnect', function () { console.log('disconnected!')});
});