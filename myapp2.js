// Declare Express
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

// Add routes here
var routes = require('./routes/index');

var app = express();

// Declare Misc
var port = process.env.PORT || 8080;
//var rpitools = require('./rpitools');

// setup view and view engine
//

// setup static file directory and favicon
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'bulb3.png')));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', routes);

// Start Server
app.listen(port, function(){
  console.log('Raspberry Pi REST API Server');
  console.log('============================');
  console.log('\n'+'Listening on port %d', port);
});

/*
function appshutdown(){
  console.log('shutdown on myapp2');
  process.exit(0);
};

process.stdin.resume();

process.on('SIGINT', appshutdown);
process.on('SIGTERM', appshutdown);

*/
