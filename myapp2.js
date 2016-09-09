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
var rpitools = require('./rpitools');

// setup view and view engine
//

// setup static file directory and favicon
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'bulb2.png')));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', routes);

//app.listen(port);
//console.log('Listening on port %d', port);
//console.log(validGPIO);  ////////


// Start Server
app.listen(port, function(){
  console.log('\n'+'Listening on port %d', port);
});


//// Release GPIOs and free up resources
//process.on('SIGINT', function(){
  //console.log('\nReleasing resource from GPIO call');
    //// Check if any GPIOs currently assigned

  //if (assignedGPIO.length !== 0){
    //for (var i=0; i< assignedGPIO.length; i++){
      //setpin[assignedGPIO[i]].unexport;
    //}
  //};

  //console.log('All GPIO resources released\n')
  
//})
