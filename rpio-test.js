var rpio = require('rpio');

rpio.open(11, rpio.INPUT);
console.log(rpio.read(11));
console.log('Pin 11 is currently set '+(rpio.read(11)? 'high':'low'));


