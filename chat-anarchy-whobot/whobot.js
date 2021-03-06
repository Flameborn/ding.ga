var set = require('set');
var util = require('util');
var escape = require ( 'escape-html' ) ; 
var Moniker = require('moniker');

module.exports = function(options) {
    var rooms = {};


function generate(length) {
var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
result=""
for (var i = length; i > 0; --i)
result += chars[Math.round(Math.random() * (chars.length - 1))]
return result
}

function contains(col,item) {
	for (var i = 0; i < col.length; i++) {
		if (col[i]==item)
			return true;
	}
	return false;
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
	var roster = rooms[socket.room];

				switch (true) {
				case /^\/who/.test(message):
                    socket.emit('announce',
{ u: "Info", m: "Members: "+roster.get().join(', ')});
break;
case /^\/nick$/.test(message):
roster.remove(socket.user);
	var namer = Moniker.generator([Moniker.adjective, Moniker.noun], {
	    glue: ' '
	});
var newnick = namer.choose().replace(/\b\w/g, l => l.toUpperCase());
socket.nsp.in(socket.room).emit('newnick',
	{ n: newnick, o: socket.user});
		roster.add(newnick);
		socket.user=newnick;
		break;
case /^\/nick\s.*/.test(message):
	var nnick=message.slice(message.indexOf(" ")).replace(/\b\w/g, l => l.toUpperCase()).trim();
if (nnick==socket.user)
	return;
roster.remove(socket.user);
if (contains(roster.get(),nnick)) {
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