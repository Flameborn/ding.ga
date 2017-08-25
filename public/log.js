(function () {
    "use strict";

    var baseLogFunction = console.log;
    console.log = function(){
        baseLogFunction.apply(console, arguments);

        var args = Array.prototype.slice.call(arguments);
        for(var i=0;i<args.length;i++){
            var node = createLogNode(args[i]);
            document.querySelector("#mylog").appendChild(node);
        }
        
    }

    function createLogNode(message){
        var node = document.createElement("div");
        var textNode = document.createTextNode(message);
        node.appendChild(textNode);
        return node;
    }

    window.onerror = function(message, url, linenumber) {
        console.log("JavaScript error: " + message + " on line " +
            linenumber + " for " + url);
    };

})();
