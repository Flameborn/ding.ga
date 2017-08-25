var util = require('util');
var Moniker = require('moniker');
var maxEmits=4; //Maximum number of flood emits allowed
var emitInterval=2; //emitCount will be increased if two messages arrive in X seconds.
var ipList = {};
var maxKicks=3; //user will be banned after kicked X times.
var banTime=1800; //Ban for X seconds

var namer = Moniker.generator([Moniker.adjective, Moniker.noun], {
    glue: ' '
});

module.exports = function(options) {
    return function(socket, next) {
        socket.user = namer.choose().replace(/\b\w/g, l => l.toUpperCase());
		socket.floodTimer=0;
		socket.emitCount=0;

		if (socket.request.connection.remoteAddress in ipList) {
			if (ipList[socket.request.connection.remoteAddress].banned) {
				if ((timeInSeconds()-ipList[socket.request.connection.remoteAddress].time)>banTime) {
					console.log("Unbanned "+socket.request.connection.remoteAddress);
					delete ipList[socket.request.connection.remoteAddress];
				} else {
					socket.disconnect();
				}
						}
		}


		function timeInSeconds() {
			var date = new Date();
			return (date.getTime()/1000);
		}

        socket
            .on('join', function(room) {
                //console.log("%s joined %s", socket.user, room);
                if (room) {
                    socket.join(socket.room = room);
                    socket.nsp.in(socket.room).emit('join', {u: "Info", m: socket.user+" joined."});
					socket.emit('welcome',{u: socket.user})
                }
            })
            .on('message', function(message) {
                if (socket.room) {
                    //console.log("%s: %s %s", socket.user, message, socket.room);
					var curTime=timeInSeconds();
					if ((curTime-socket.floodTimer)<emitInterval) {
						//console.log(socket.user+" is flooding.");
						socket.emitCount+=1;
						if (socket.emitCount==maxEmits) {
							socket.disconnect();
							socket.nsp.in(socket.room).emit('message', {u: "Info", m: socket.user+" has been disconnected due to sending too many messages."});
							if (socket.request.connection.remoteAddress in ipList) {
								ipList[socket.request.connection.remoteAddress].kickCount+=1;
								ipList[socket.request.connection.remoteAddress].time=curTime;
								console.log("KickCount increased for "+socket.request.connection.remoteAddress);
								if (ipList[socket.request.connection.remoteAddress].kickCount==maxKicks) {
									console.log("Banned "+socket.request.connection.remoteAddress);
ipList[socket.request.connection.remoteAddress].banned=true;
								}
} else {
								ipList[socket.request.connection.remoteAddress]={kickCount:1, banned:false, time:curTime};
								console.log("KickCount is 1 for "+socket.request.connection.remoteAddress);
}
//}
							return;
}
						} else {
							if (socket.emitCount)
								socket.emitCount-=1;
						}
						socket.floodTimer=curTime;
					var mIndex=message.indexOf(" ");
					if (mIndex==-1) {
socket.nsp.in(socket.room).emit('message', {
	                        u: socket.user,
	                        m: message
});
return;
					}
					switch (message.slice(0,mIndex)) {
						case 'me':
message="*"+socket.user+" "+message.slice(mIndex)+"*";
break;
}
						socket.nsp.in(socket.room).emit('message', {
						                        u: socket.user,
						                        m: message
						                    });
                }
            })
            .on('disconnect', function() {
                //console.log("%s left %s", socket.user, socket.room);
                if (socket.room) {
                    socket.nsp.in(socket.room).emit('leave', {u: "Info", m: socket.user+" left."});
                }
			});
        next();
    };
};