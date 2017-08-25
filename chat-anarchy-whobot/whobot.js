var set = require('set');
var util = require('util');
var escape = require ( 'escape-html' ) ; 

module.exports = function(options) {
    var rooms = {};


function generate(length) {
var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
result=""
for (var i = length; i > 0; --i)
result += chars[Math.round(Math.random() * (chars.length - 1))]
return result
}

    return function(socket, next) {
        socket
            .on('join', function(room) {
                //console.log("whobot hears that %s joined %s", socket.user, socket.room);
                if (room) {
                    var roster = rooms[room];
                    if (!roster) {
                        roster = rooms[room] = new set();
                    }
                    roster.add(socket.user);
                    socket.nsp.in(socket.room).emit('count', roster.size());
                }
            })
            .on('message', function(message) {
                if (!message || !socket.room || !rooms[socket.room]) return;

				switch (true) {
				case /^\/who/.test(message):
					var roster = rooms[socket.room];
                    socket.nsp.in(socket.room).emit('announce',
{ u: "Info", m: "Members: "+roster.get().join(', ')});
break;
case /^\/nick\s.*/.test(message):
	var roster = rooms[socket.room];
	var nnick=message.slice(message.indexOf(" ")).replace(/\b\w/g, l => l.toUpperCase());
if (nnick==socket.user)
	return;
roster.remove(socket.user);
if (roster.get().join(', ').toLowerCase().indexOf(nnick.toLowerCase())>=0) {
	nnick+="-"+generate(5);
}
nnick=escape(nnick);
roster.add(nnick);
socket.nsp.in(socket.room).emit('newnick',
	{ n: nnick, o: socket.user});
socket.user=nnick;
	break;
                }
            })
            .on('disconnect', function() {
                //console.log("whobot hears that %s left %s", socket.user, socket.room);
                if (socket.room) {
                    var roster = rooms[socket.room];
                    if (roster) {
                        roster.remove(socket.user);
                        socket.nsp.in(socket.room).emit('count', roster.size());
                    }
                }
            });
        next();
    };
};