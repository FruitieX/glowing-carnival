static = require('node-static');

var fileServer = new static.Server('./');
var port = 8080;

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response);
    }).resume();
}).listen(port);
console.log('listening on: ' + port);
