var util = require('util');
var Moniker = require('moniker');

var namer = Moniker.generator([Moniker.adjective, Moniker.noun], {
    glue: ' '
});

module.exports = function(options) {
    return function(socket, next) {
        socket.user = namer.choose();
        socket
            .on('join', function(room) {
                //console.log("%s joined %s", socket.user, room);
                if (room) {
                    socket.join(socket.room = room);
                    socket.nsp.in(socket.room).emit('announce', util.format('  %s joined.', socket.user));
                }
            })
            .on('message', function(message) {
                if (socket.room) {
                    //console.log("%s: %s %s", socket.user, message, socket.room);
                    socket.nsp.in(socket.room).emit('message', {
                        u: socket.user,
                        m: message
                    });
                }
            })
            .on('disconnect', function() {
                //console.log("%s left %s", socket.user, socket.room);
                if (socket.room) {
                    socket.nsp.in(socket.room).emit('announce', util.format('  %s left.', socket.user));
                }
            });
        next();
    };
};