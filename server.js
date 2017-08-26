var http = require('http'),
    fs = require('fs');
	var server = http.createServer(function(req, res) {
	if (fileExists.sync(__dirname + "/public" + req.url)) {
fs.createReadStream(__dirname + "/public" + req.url).pipe(res);
} else {
	    fs.createReadStream(__dirname + "/public" + '/index.html').pipe(res);
}
});

var fileExists = require ('file-exists');
require('socket.io')(server)
    .use(require('./chat-anarchy-server')())
    .use(require('./chat-anarchy-whobot')())
    .use(require('./chat-anarchy-mediabot')())
    .use(require('./ding-8ball')());
	server.listen(process.env.PORT || 1844, process.env.IP || '127.0.0.1', function() {
    console.log("Chat anarchy is listening on port %d", server.address().port);
});
