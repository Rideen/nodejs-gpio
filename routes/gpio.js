// Start with this
var express = require('express');
var router = express.Router();
// =================

var gpioHelper = require('./helpers/pigpio-helper');
// var validGPIOs = gpioHelper.validGPIOs;
var assignedGPIOs = gpioHelper.assignedGPIOs;

// Validate parameters for GPIO rouc
router.param('gpio_no', function(req, res, next, gpio_no){
  // validate pin number received
  gpio_no = parseInt(gpio_no);
  
  if (gpioHelper.isValidGPIOs(gpio_no)){
      req.params.gpio_no = gpio_no;
      // console.log('assignedGPIOs ='+assignedGPIOs);   // troubleshooting only
      next();
  } else {
    console.log('++ Error: Invalid GPIO pin request\n');
    res.status(400).send({ 'error':'Invalid GPIO pin request' });
  };
});

router.param('pwm_level', function(req, res, next, pwm_level){
  // validate pwm level number received
  pwm_level = parseInt(pwm_level);
  
  if (pwm_level>=0 && pwm_level<=255){
    req.params.pwm_level = pwm_level;
    next();
  } else {
    console.log('++ Error: Invalid PWM value request\n');
    res.status(400).send({ 'error':'Invalid PWM value request'});
  };
});

// Start routes
//
router.get('/', function(req, res){
  
  // respond with all pin mode and value
  var readAllGPIOs = gpioHelper.readAllGPIOs();
  res.send(readAllGPIOs);
  
  // respond with all assigned GPIO - mode and level

  
});

// Start API Routes
router.get('/release', function(req, res){    // test release module
  var json_data = gpioHelper.releaseGPIOs();
  //console.log(json_data);
  res.send(json_data);
});

router.get('/PWM/:gpio_no/:pwm_level', function(req, res){
  // GPIO PWM value set
  console.log('Set PWM');
  res.send(['PWM route']);
});

router.get('/:gpio_no', function(req, res){
  var gpio_no = req.params.gpio_no;

  var json_data = gpioHelper.readOneGPIO(gpio_no);
  res.send(json_data);

});

router.get('/:gpio_no/ON', function(req, res){
  // set GPIO on
  var gpio_no = req.params.gpio_no;
  var json_data = gpioHelper.setGPIOOn(gpio_no);
  
  res.send(json_data);
});

router.get('/:gpio_no/OFF', function(req, res){
  // set GPIO off
  var gpio_no = req.params.gpio_no;
  var json_data = gpioHelper.setGPIOOff(gpio_no);
  
  res.send(json_data);
});

router.get('/:gpio_no/TOGGLE', function(req, res){
  // TOGGLE GPIO setting
  var gpio_no = req.params.gpio_no;
  var json_data = gpioHelper.toggleGPIO(gpio_no);
  
  res.send(json_data);
});

// Catch all other routes  
router.get('*', function(req, res){
  res.send({ 'error': 'Invalid GPIO API route: '+req.method+' '+req.baseUrl });
});

// Close API Routes
//app.use('/', router);

// end with this
// export this router for use in index.js
module.exports = router;
