var answers = [
'It is certain.',
'It is decidedly so.',
'Without a doubt',
'Yes definitely.',
'You may rely on it.',
'As I see it, yes.',
'Most likely.',
'Outlook good.',
'Yes.',
'Signs point to yes.',
'Reply hazy... try again.',
'Ask again later.',
'Better not tell you now.',
'Cannot predict now.',
'Concentrate and ask again.',
"Don't count on it.",
'My reply is no.',
'My sources say no.',
'Outlook not so good.',
'Very doubtful'
]

module.exports = function(options) {
    return function(socket, next) {
        //console.log("%s connected.", socket.user);
        socket
            .on('message', function(message) {
				if (/^\/8.*\?$/.test(message)) {
var answer = answers [ Math . floor ( Math . random () * answers . length )];
socket.nsp.to(socket.room).emit('message', {u: "Magic 8-ball", m: socket.user+" has just asked me: "+message.slice(3)+" My answer: "+answer });
}
});
next();
};
};