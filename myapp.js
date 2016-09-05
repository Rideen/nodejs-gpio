var rpitools = require('./rpitools');

var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app = express();

// var gpio = require('pi-gpio');
var Gpio = require('onoff').Gpio;

var validGPIO = rpitools.validGPIOs();
var assignedGPIO = [];
var setpin = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

var port = process.env.PORT || 8080;

function isAssignedGPIO(gpioVal){
  if (assignedGPIO.indexOf(gpioVal) > -1) {
    // found
    return true  
  } else {
    return false
  };
};

function storeAssignedGPIO(gpioVal){
  gpioVal = parseInt(gpioVal);
  assignedGPIO.push(gpioVal);
  console.log('GPIO '+gpioVal+' added to initialised GPIO list')
};

function removeAssignedGPIO(gpioVal){
  gpioVal = parseInt(gpioVal);
  var index = assignedGPIO.indexOf(gpioVal);
  assignedGPIO.splice(index, 1);
  
};

var router = express.Router();

// Log console feedback for each request received
router.use(function(req, res, next){
  console.log('>> Request received from '+req.ip+': '+req.method+' : '+req.originalUrl);
  next();
});

// Validate parameters received
router.param('pin_no', function(req, res, next, pin_no){
  // validate pin number received
  // indexOf() returns -1 if not found
  if (validGPIO.indexOf(parseInt(pin_no)) > -1) {
    req.params.pin_no = parseInt(pin_no);
    next();
  } else {
    console.log('++ Error: Invalid GPIO pin request\n');
    res.status(400).send({ 'error':'Invalid GPIO pin request' });
  }
});

router.get('/', function(req, res){
  // respond with all pin current value
 /* var pinArray = [];  // store the value of pins read
  
  for (var i=0, length = validGPIOs.length; i < length; i++){
    // check if pin is already init
    gpioVal = validGPIOs[i];
    if (validGPIOs.indexOf(gpioVal) > -1){  // found in init list 
      // just read
      var value = 
    };
  };
  // if assigned, do not init again
  // read data
  // if not assigned, init pin 
  // read data  */

  // Check if any GPIOs currently assigned
  if (assignedGPIO.length === 0){
    console.log('++ Error: GPIO pins not set\n');
    res.status(400).send({ 'error':'GPIO pins not set' });
    return;
  }
  
  for (var i in assignedGPIO){
  
    console.log(i);
  }
  /*
  for (var i=0; i < validGPIOs.length; i++) {
    
    var targetpin = new Gpio(validGPIOs[i], 'in');
    var value = targetpin.readSync();
    targetpin.unexport();  // release pin
    
    //pinArray.push({ 'pin': validGPIOs[i], 'value' : value });
    string = validGPIOs[i].toString();
    pinArray.push({ string : value });
  }
  res.send({ 'allpins' : pinArray });
  console.log('++ Responded: Pin values sent\n');*/
});

// Start API Routes
router.get('/:pin_no', function(req, res){
  var pin_no = req.params.pin_no;
  // Check if any GPIOs currently assigned
  /*if (assignedGPIO.length === 0){
    console.log('++ Error: No GPIO pins assigned\n');
    res.status(400).send({ 'error':'No GPIO pins assigned' });
    return;
  }*/
  // Check if requested pin is currently assigned
  if (isAssignedGPIO(pin_no)){
    // is found in assign list
    setpin[pin_no].read(function(err, value){
      if (err){
        throw err;
      }
    });
    res.send({ 'pin' : pin_no, 'value': value });
    console.log('Responded: Pin:'+pin_no+' , value:'+value+'\n');
  } else {  // not found
    console.log('++ Error: Cannot read. GPIO pin '+pin_no+' not set\n');
    res.status(400).send({ 'error':'Cannot read. GPIO pin '+pin_no+' not set' });
  };
  
  /*gpio.open(pin, 'input', function(err){
    gpio.read(pin, function(err, value){
      res.send(200, {value: value});
      gpio.close(pin);  
    });
  }); */
});

/* router.put('/:pin_no', function(req, res){

}); */

router.post('/:pin_no', function(req, res){

  var pin_no = req.params.pin_no;
  
  // Check if pin is already assigned
  if (!isAssignedGPIO(pin_no)){
    // not assigned, initialise GPIO and add into assigned list
    setpin[pin_no] = new Gpio(pin_no, 'out');
    storeAssignedGPIO(pin_no);
  }
  
  var value = parseInt(req.body.value);
  
  if ([0,1].indexOf(value) < 0) { // value not 0 or 1 - invalid
    console.log('++ Error: Send ON(1) or OFF(0) only\n')
    res.status(400).send({ 'error': 'Send ON(1) or OFF(0) only' });
    setpin[pin_no].unexport;
    removeAssignedGPIO(pin_no);
    return;
  } else { // value is 0 or 1
    // check if current value is same as requested value
    if (value == setpin[pin_no].readSync()) {
      //error - same
      console.log('++ Error: Already at requested setting\n');
      res.status(400).send({ 'error' : 'Already at requested setting' });
      setpin[pin_no].unexport;
      removeAssignedGPIO(pin_no);
    } else {
      setpin[pin_no].writeSync(value);
      res.send({ 'pin' : pin_no, 'value': value });
      console.log('++ Responded: Pin:'+pin_no+' , value:'+value+'\n');
    };
  }
      
      /*
      targetpin.write(value, function(err){  // asynchronous write
        if (err){
          throw err;
        }
        targetpin.unexport();
        res.send({ 'pin' : pin_no, 'value': value });
        console.log('++ Responded: Pin:'+pin_no+' , value:'+value+'\n');
        });*/
});
  
  
  /*
  // var value = req.params.value;
  var targetpin = new Gpio(pin_no, 'out');
  
  targetpin.write(value, function()value);
  
  targetpin.unexport();  // release pin
  
  res.send({ status : 'Pin#:'+pin_no+' set to '+value });
  console.log('Responded: Pin#:'+pin_no+' set to '+value }););
  /*
  gpio.open(pin, 'output', function(err){
    gpio.write(pin, value, function(err){
      res.send(200);
      gpio.close(pin);  
    });
  }); */

router.get('*', function(req, res){
  res.send('Invalid API route '+req.method+' '+req.baseUrl);
});

// Close API Routes
app.use('/', router);


app.listen(port);
console.log('Listening on port %d', port);
console.log(validGPIO);  ////////


// Start reading from stdin so program don't exit
//process.stdin.resume();

// Release GPIOs and free up resources
process.on('SIGINT', function(){
  console.log('\nReleasing resource from GPIO call');
    // Check if any GPIOs currently assigned

  if (assignedGPIO.length !== 0){
    for (var i=0; i< assignedGPIO.length; i++){
      setpin[assignedGPIO[i]].unexport;
    }
  };

  console.log('All GPIO resources released\n')
  
})
