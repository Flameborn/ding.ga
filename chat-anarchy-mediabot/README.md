mediabot – a chat anarchy bot for embedding content from URLs
=============================================================
mediabot embeds images, youtube videos, and http links when you send them to
the room.

mediabot currently only works if the entire message is a URL or if the message
begins with a URL.

Usage
-----
`mediabot` is socket.io middleware for chat anarchy.

    npm install --save chat-anarchy-mediabot

### server.js
```js
var http = require('http'),
    fs = require('fs');

var server = http.createServer(function(req, res) {
    fs.createReadStream(__dirname + '/index.html').pipe(res);
});

require('socket.io')(server)
    .use(require('chat-anarchy-server')())
    .use(require('chat-anarchy-mediabot')());

server.listen(process.env.PORT || 1844, process.env.IP || '127.0.0.1', function() {
    console.log("Chat anarchy is listening on port %d", server.address().port);
});
```

### index.html
```html
<!doctype html>
<title>/</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
    * {
        font: 18px monospace;
    }
</style>
<input autofocus style="width:75%">
<script src="/socket.io/socket.io.js"></script>
<script>
    var socket = io()
        .on('connect', function() {
            document.title = location.pathname;
            socket.emit('join', location.pathname);
        })
        .on('announce', log)
        .on('inject', inject)
        .on('message', function(data) {
            log(data.u + ': ' + data.m);
        })

    var input = document.getElementsByTagName('input')[0];
    input.onchange = function() {
        socket.send(this.value);
        this.value = '';
    };

    function inject(html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        div.title = Date();
        document.body.insertBefore(div, input);
        div.scrollIntoView();
    }
    function log(m) {
        var p = document.createElement('p');
        p.appendChild(document.createTextNode(m));
        p.title = Date();
        document.body.insertBefore(p, input);
        p.scrollIntoView();
    }
</script>

License
-------

The MIT License (MIT)
Copyright © 2014 Benjamin Barber

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
