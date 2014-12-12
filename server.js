var http = require('http'),
    fs = require('fs');

var server = http.createServer(function(req, res) {
    fs.createReadStream(__dirname + '/index.html').pipe(res);
});

require('socket.io')(server)
    .use(require('chat-anarchy-server')())
    .use(require('chat-anarchy-whobot')())
    .use(require('chat-anarchy-mediabot')());

server.listen(process.env.PORT || 1844, process.env.IP || '127.0.0.1', function() {
    console.log("Chat anarchy is listening on port %d", server.address().port);
});