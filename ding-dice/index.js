var diceRegex=/\/dice\s(\d+)d(\d+)([+-]\d+)?([ad]?)/

function roll(str) {

var results = str.match(diceRegex).splice(0,5);
var rolls=[];

for (i = 0; i < results[1]; i++) {
rolls.push(Math.floor(Math.random()*results[2])+1)
}

var total=rolls.reduce((a, b) => a + b, 0);
if (results[3])
	total=eval(total+results[3]);

if (results[4]) {
	switch (results[4]) {
	case 'a':
		rolls.sort(function(a, b){ return a-b});
		break;
	case 'd':
		rolls.sort(function(a, b){ return b-a});
		break;
	}
}

var dice='a die:';
if (results[1]>1)
	dice=results[1]+" dice:";
var totalString=" Total: "+total+".";
if (results[3])
	totalString=" Modifying it by "+results[3]+", the total is "+total+".";
if (results[1]==1 && !results[3])
	totalString="";
return " rolls "+dice+" "+rolls.join(', ')+"."+totalString;
}

module.exports = function(options) {
    return function(socket, next) {
        //console.log("%s connected.", socket.user);
        socket
            .on('message', function(message) {
				if (diceRegex.test(message)) {
						socket.nsp.to(socket.room).emit('message', { u: "Info", m: socket.user+roll(message)});
					} else if (/\/dice/.test(message)) {
						socket.nsp.to(socket.room).emit('message', { u: "Info", m: socket.user+roll("/dice 1d6")});
					}
});
next();
};
};
