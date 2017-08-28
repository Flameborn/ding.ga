					var WordNet=require('node-wordnet')
var word;

module.exports = function(options) {
    return function(socket, next) {
        //console.log("%s connected.", socket.user);
        socket
            .on('message', function(message) {
				if (/^\/dic\s.*$/.test(message)) {
word=message.slice(5).trim();
					var wordnet = new WordNet()
					wordnet.lookup(word, function(results) {
					    results.forEach(function(result) {
							if (word==result.lemma)
					socket.emit('message', {u: "Dictionary", m: '<p>'+result.lemma.bold()+' ('+result.pos+')</p><p>'+result.gloss+'</p><p>Synonyms: '+result.synonyms+'</p>', dictionary: true});
					});
					});


}
});
next();
};
};