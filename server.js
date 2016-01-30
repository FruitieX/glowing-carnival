static = require('node-static');

// disable caching so we don't have to worry about that while developing
var fileServer = new static.Server('./', { cache: false });
var port = 8080;

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response);
    }).resume();
}).listen(port);
console.log('listening on: ' + port);
