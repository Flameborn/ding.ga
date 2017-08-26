module.exports = function(options) {
    return function(socket, next) {
        //console.log("%s connected.", socket.user);
        socket
            .on('message', function(message) {
				if (/^\/coin$/.test(message)) {
					var coin = '';
					switch (Math.floor(Math.random()*2)+1) {
					case 1:
						socket.nsp.to(socket.room).emit('message', { u: "Info", m: socket.user+" tosses a coin into the air. It comes up as heads." });
						break;
					case 2:
						socket.nsp.to(socket.room).emit('message', { u: "Info", m: socket.user+" tosses a coin into the air. It comes up as tails." });
					}
}
});
next();
};
};