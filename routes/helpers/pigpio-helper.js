// gpio-controller.js
// contains logic used by routes in gpio.js
// used by gpio.js from routes

var rpitools = require('./rpitools');
var pigpio = require('pigpio').Gpio;    // this module uses "PIGPIO" module to control GPIO

var validGPIOs = rpitools.validGPIOs();
// var assignedGPIOs = [];
var assignedGPIOs = exports.assignedGPIOs = [];

var isValidGPIOs = exports.isValidGPIOs = function(gpio_no){
  // if found, indexOf returns value > -1
  if (validGPIOs.indexOf(gpio_no) > -1) {
    return true;
  } else {
    return false;
  };
};

var isAssignedGPIO = exports.isAssignedGPIO = function(gpio_no){
  // if found, indexOf return value > -1
  if (assignedGPIOs.indexOf(gpio_no) > -1) {
    return true
  } else {
    return false
  };
};

var storeAssignedGPIO = exports.storeAssignedGPIO = function(gpio_no){
  // Store GPIO number into assigned pin list
  assignedGPIOs.push(gpio_no);
  console.log('++ GPIO'+gpio_no+' added to assigned GPIO list');
};

var removeAssignedGPIO = exports.removeAssignedGPIO = function(gpio_no){
  // Remove GPIO number from assigned pin list 
  var index = assignedGPIO.indexOf(gpio_no);  // get location of GPIO in array
  assignedGPIO.splice(index, 1);
  console.log('GPIO'+gpioVal+' removed from assigned GPIO list');
};

// Read all GPIOs
/*
var readAllGPIOs = exports.readAllGPIOs = function(){
  var allValues = [];
  for (var i=0; i< validGPIOs.length; i++){
    
    gpio_no = validGPIOs[i];  // loop thru all valid GPIOs
    gpio = new pigpio(gpio_no);
  
    // == JSON format - Example ==
    // array= ['"2":{"mode":4, "level":1}', '"7":{"mode":4, "level":0}'];
    // console.log(JSON.parse('{'+array+'}'));
    allValues.push('"'+gpio_no.toString()+'":{ '+
      '"mode":'+gpio.getMode()+', '+
      '"level":'+gpio.digitalRead()+' }');
  }
  
  console.log('++ GPIO values retrieved\n');
  return JSON.parse('{'+allValues+'}');
};
*/

// Read all GPIOs
var readAllGPIOs = exports.readAllGPIOs = function(){
  if (assignedGPIOs.length == 0){
    // no GPIOs assigned yet. Return nothing
    console.log('++ No GPIOs assigned\n');
    return JSON.parse('{ "status": "No GPIOs assigned. Available GPIOs: '+ validGPIOs +'" }');
  };
  
  var allValues = [];
  
  for (var i=0; i < assignedGPIOs.length; i++){
  
    gpio_no = assignedGPIOs[i];
    gpio = new pigpio(gpio_no);
    
    allValues.push('"'+gpio_no.toString()+'":{ '+
      '"mode":'+gpio.getMode()+', '+
      '"level":'+gpio.digitalRead()+' }');
  }
  console.log('++ GPIO values retrieved\n');
  return JSON.parse('{'+allValues+'}');
};


var readOneGPIO = exports.readOneGPIO = function(gpio_no){
  // Read single GPIO
  gpio = new pigpio(gpio_no);
  
  console.log('++ GPIO' + gpio_no + ':' +
    ' mode=' + gpio.getMode() +
    ' level=' + gpio.digitalRead()
  );
  
  gpioValue = '"'+gpio_no.toString()+'"'+' : {'+
                  '"mode" : '+gpio.getMode()+','+
                  '"level" : '+gpio.digitalRead()+'}';

  return JSON.parse('{'+gpioValue+'}');
};


var setGPIOOn = exports.setGPIOOn = function(gpio_no){
  // Set GPIO on
  var initialRead = readOneGPIO(gpio_no);
  if (initialRead[gpio_no].level === 1){
    // already on
    return JSON.parse('{ "error" : "GPIO already ON" }');
  };
  
  // change level to 1
  gpio = new pigpio(gpio_no, {mode: pigpio.OUTPUT});
  gpio.digitalWrite(1);
    
  // insert GPIO into assigned list
  if (!isAssignedGPIO(gpio_no)){
    storeAssignedGPIO(gpio_no);
  };
  
  return readOneGPIO(gpio_no);
};

var setGPIOOff = exports.setGPIOOff = function(gpio_no){
  // Set GPIO off
  var initialRead = readOneGPIO(gpio_no);
  if (initialRead[gpio_no].level === 0){
    // already off
    return JSON.parse('{ "error" : "GPIO already OFF" }');
  };
  
  // change level to 0
  gpio = new pigpio(gpio_no, {mode: pigpio.OUTPUT});
  gpio.digitalWrite(0);
  
  // insert GPIO into assigned list
  if (!isAssignedGPIO(gpio_no)){
    storeAssignedGPIO(gpio_no);
  };
  
  return readOneGPIO(gpio_no);
};

var toggleGPIO = exports.toggleGPIO = function(gpio_no){
  // Toggle GPIO current setting
  var initialRead = readOneGPIO(gpio_no);
  var initialMode = initialRead[gpio_no].mode;
  var initialLevel = initialRead[gpio_no].level;
  
  gpio = new pigpio(gpio_no, {mode: pigpio.OUTPUT});

  // toggle level
  if (initialLevel === 0){
    gpio.digitalWrite(1);
  } else {
    gpio.digitalWrite(0);
  };
  
  // insert GPIO into assigned list
  if (!isAssignedGPIO(gpio_no)){
    storeAssignedGPIO(gpio_no);
  };
  
  return readOneGPIO(gpio_no);
};

// Release GPIOs and free up resources
var releaseGPIOs = exports.releaseGPIOs = function(){
  // Check if any GPIOs are currently assigned
  if (assignedGPIOs.length == 0){
    console.log('++ No GPIOs assigned\n');
    return JSON.parse('{ "status" : "No GPIOs assigned" }');
  };
  
  console.log('++ Releasing GPIO resources\n')
  
  for (var i=0; i< assignedGPIOs.length; i++){
      
    gpio_no = assignedGPIOs[i];
      
    gpio = new pigpio(gpio_no, {
      mode: pigpio.INPUT,
      pullUpDown: pigpio.PUD_DOWN
    });
    // gpio.digitalWrite(0);

    console.log('++ GPIO' + gpio_no + ':' +
        ' mode=' + gpio.getMode() +
        ' level=' + gpio.digitalRead()
    );
  }
  assignedGPIOs = [];
  
  console.log('\n++ All GPIO resources released\n');
  return JSON.parse('{ "status" : "All GPIO resources released" }');
};

/*
function shutdownGPIO(){
  console.log("run shutdown");
  releaseGPIOs();

  setTimeout(function(){
    process.exit(0);
  }, 3000);
};

process.stdin.resume();
process.on('SIGINT', shutdownGPIO);
process.on('SIGTERM', shutdownGPIO);
process.on('SIGHUP', shutdownGPIO);
process.on('SIGCONT', shutdownGPIO);
*/
