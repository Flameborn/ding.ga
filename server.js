var http = require('http'),
    fs = require('fs'),
    Moniker = require('moniker');

var names = Moniker.generator([Moniker.adjective, Moniker.noun], {
    glue: ' '
});

var server = http.createServer(function(req, res) {
    fs.createReadStream(__dirname + '/index.html').pipe(res);
});

var io = require('socket.io')(server);
io.on('connection', function(socket) {
    socket.user = names.choose();
    //console.log("%s connected.", socket.user);
    socket
        .on('join', function(room) {
            //console.log("%s joined %s", socket.user, room);
            socket.join(socket.room = room);
            io.to(socket.room).emit('joined', socket.user);
        })
        .on('message', function(message) {
            //console.log("%s: %s %s", socket.user, message, socket.room);
            io.to(socket.room).emit('message', {
                u: socket.user,
                m: message
            });
        })
        .on('disconnect', function() {
            //console.log("%s left %s", socket.user, socket.room);
            io.to(socket.room).emit('left', socket.user);
        });
});

server.listen(process.env.PORT || 1844, process.env.IP || '127.0.0.1', function() {
    console.log("Chat anarchy is listening on port %d", server.address().port);
});