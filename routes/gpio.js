// Start with this
var express = require('express');
var router = express.Router();
// =================

var gpioHelper = require('./scripts/gpio-helper');

// Validate parameters for GPIO route
router.param('pin_no', function(req, res, next, pin_no){
  // validate pin number received
  // indexOf() returns -1 if not found
  if (gpioHelper.validGPIOs.indexOf(parseInt(pin_no)) > -1) {
    req.params.pin_no = parseInt(pin_no);
    next();
  } else {
    console.log('++ Error: Invalid GPIO pin request\n');
    res.status(400).send({ 'error':'Invalid GPIO pin request' });
  }
});

// Start routes
//
router.get('/', function(req, res){
  // respond with all pin current value
  // Check if any GPIOs currently assigned
  if (gpioHelper.assignedGPIO.length === 0){
    console.log('++ Error: GPIO pins not set\n');
    res.status(400).send({ 'error':'GPIO pins not set' });
    return;
  } else {
    // display pin and values already assigned
    for (var i in gpioHelper.assignedGPIO){
      
      console.log(i);
      res.send({'All Settings': i});
    }
  };
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
  if (gpioHelper.isAssignedGPIO(pin_no)){
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
  if (!gpioHelper.isAssignedGPIO(pin_no)){
    // not assigned, initialise GPIO and add into assigned list
    setpin[pin_no] = new Gpio(pin_no, 'out');
    gpioHelper.storeAssignedGPIO(pin_no);
  }
  
  var value = parseInt(req.body.value);
  
  if ([0,1].indexOf(value) < 0) { // value not 0 or 1 - invalid
    console.log('++ Error: Send ON(1) or OFF(0) only\n')
    res.status(400).send({ 'error': 'Send ON(1) or OFF(0) only' });
    setpin[pin_no].unexport;
    gpioHelper.removeAssignedGPIO(pin_no);
    return;
  } else { // value is 0 or 1
    // check if current value is same as requested value
    if (value == setpin[pin_no].readSync()) {
      //error - same
      console.log('++ Error: Already at requested setting\n');
      res.status(400).send({ 'error' : 'Already at requested setting' });
      setpin[pin_no].unexport;
      gpioHelper.removeAssignedGPIO(pin_no);
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

// Catch all other routes  
router.get('*', function(req, res){
  res.send('Invalid API route: '+req.method+' '+req.baseUrl);
});

// Close API Routes
//app.use('/', router);

// end with this
// export this router for use in index.js
module.exports = router;
