var remix = require('webremix');
var url = /^https?\:\/\//;

module.exports = function(options) {
    return function(socket, next) {
        //console.log("%s connected.", socket.user);
        socket
            .on('message', function(message) {
                if (!message) return;
                message = message.trim();
                if (url.test(message)) {
                    remix.generate(message, function(err, resp) {
                        if (!err && resp) {
                            //console.log("%s: %s %s", socket.user, message, socket.room);
                            socket.nsp.to(socket.room).emit('inject', resp);
                        }
                    });
                }
            });
        next();
    };
};