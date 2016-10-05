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
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({ defaultLayout:'main' }));
app.set('view engine', 'handlebars');

// setup static file directory and favicon
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'bulb3.png')));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', routes);


// Trap Ctrl+C interrupt and shutdown
process.on('SIGINT', appshutdown);



// Start Server
app.listen(port, function(){
  console.log('Raspberry Pi REST API Server');
  console.log('============================');
  console.log('cServer started on port %d', port);
  console.log('\n'+'Hit CTRL+C to stop the server');
});


function appshutdown(){
  console.log('shutdown call from myapp2');
  
  process.exit(0);
};

/*
process.stdin.resume();

process.on('SIGINT', appshutdown);
process.on('SIGTERM', appshutdown);

*/
