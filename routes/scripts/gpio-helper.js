// gpio-helper.js
// used by gpio.js from routes

var rpitools = require('./rpitools');

// var gpio = require('pi-gpio');
var Gpio = require('onoff').Gpio;

var validGPIOs = exports.validGPIOs = rpitools.validGPIOs();
var assignedGPIO = exports.assignedGPIO = [];
var setpin = exports.setpin = [];

var isAssignedGPIO = exports.isAssignedGPIO = function(gpioVal){
  // if found, indexOf return value > -1
  if (assignedGPIO.indexOf(gpioVal) > -1) {
    return true  
  } else {
    return false
  };
};

var storeAssignedGPIO = exports.storeAssignedGPIO = function(gpioVal){
  gpioVal = parseInt(gpioVal);
  assignedGPIO.push(gpioVal);
  console.log('GPIO '+gpioVal+' added to initialised GPIO list')
};

var removeAssignedGPIO = exports.removeAssignedGPIO = function(gpioVal){
  gpioVal = parseInt(gpioVal);
  var index = assignedGPIO.indexOf(gpioVal);
  assignedGPIO.splice(index, 1);
};


// Release GPIOs and free up resources
var releaseGPIOs = exports.releaseGPIOs = function(){
  // Check if any GPIOs are currently assigned
  if (assignedGPIO.length !== 0){
    for (var i=0; i< assignedGPIO.length; i++){
      setpin[assignedGPIO[i]].unexport;
    }
  };
  console.log('All GPIO resources released\n');
};
