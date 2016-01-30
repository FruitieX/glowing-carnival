var bs;

try {
  bs = require('browser-sync').create();
} catch(e) {
  console.log('ERROR: failed to load the browser-sync module, forgot to run "npm install"?');
  process.exit(0); // quit with success code so npm doesn't spew out a huge error message
}

bs.watch('*.html').on('change', bs.reload);
bs.watch('js/*.js').on('change', bs.reload);

var port = 8080;
bs.init({
  server: './',
  port: port
});

// old node-static based solution
/*
var static = require('node-static');

// disable caching so we don't have to worry about that while developing
var fileServer = new static.Server('./', { cache: false });
var port = 8080;

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response);
    }).resume();
}).listen(port);
console.log('listening on: ' + port);
*/
