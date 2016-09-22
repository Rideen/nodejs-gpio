var rpitools = require('./rpitools');
var Gpio = require('pigpio').Gpio;
var gpio, gpioNo;

validGPIOs = [2,3,4,17,27,22,10,9, 11, 14, 15, 18, 23, 24, 25, 8, 7];

console.log(rpitools.validGPIOs());

for (i=0; i< validGPIOs.length; i++){

  gpioNo = validGPIOs[i];
  
  gpio = new Gpio(gpioNo);
  
  console.log('GPIO' + gpioNo + ':' +
    ' mode=' + gpio.getMode() +
    ' level=' + gpio.digitalRead()
  );
  console.log('\n');
  
}

for (i=0; i< validGPIOs.length; i++){

  gpioNo = validGPIOs[i];
  
  gpio = new Gpio(gpioNo, {mode: Gpio.OUTPUT});
  gpio.digitalWrite(1);
  
  console.log('GPIO' + gpioNo + ':' +
    ' mode=' + gpio.getMode() +
    ' level=' + gpio.digitalRead()
  );
  console.log('\n');
  
}

for (i=0; i< validGPIOs.length; i++){

  gpioNo = validGPIOs[i];
  
  gpio = new Gpio(gpioNo);
  
  console.log('GPIO' + gpioNo + ':' +
    ' mode=' + gpio.getMode() +
    ' level=' + gpio.digitalRead()
  );
  console.log('\n');
  
}

for (i=0; i< validGPIOs.length; i++){

  gpioNo = validGPIOs[i];
  
  gpio = new Gpio(gpioNo, {mode:gpio.INPUT});
  gpio = gpio.digitalWrite(0);
  console.log('GPIO' + gpioNo + ':' +
    ' mode=' + gpio.getMode() +
    ' level=' + gpio.digitalRead()
  );
  console.log('\n');
  
}

for (i=0; i< validGPIOs.length; i++){

  gpioNo = validGPIOs[i];
  
  gpio = new Gpio(gpioNo);
  
  console.log('GPIO' + gpioNo + ':' +
    ' mode=' + gpio.getMode() +
    ' level=' + gpio.digitalRead()
  );
  console.log('\n');
  
}

