var port = process.env.PORT || 8084;
var io = require('socket.io').listen(port);
var x=0;
var y=0;
console.log('tiny-server> server is running...');
io.sockets.on('connection', function (socket) {
    
	socket.on('message', function (e) {
		console.log(e) 
		switch (e) {
			case 'left':
				if(x>0)
					x = x - 10;
				break;
			case 'up':
				if(y>0)
					y = y - 10;
				break;
			case 'right':
				if(x<1270)
					x = x + 10;
				break;
			case 'down':
				if(y<710)
					y = y + 10;
				break;
		}
		
		//send this message to all sockets
		io.sockets.emit('message', {'left':x,'top':y});
	});
	
	socket.on('disconnect', function () { console.log('disconnected!')});
});