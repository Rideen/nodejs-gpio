// button is attaced to pin 17, led to 18
var GPIO = require('onoff').Gpio,
    led = new GPIO(18, 'out'),
    button = new GPIO(17, 'in', 'both');
/* 
// define the callback function
function light(err, state) {
  
  // check the state of the button
  // 1 == pressed, 0 == not pressed
  if(state == 1) {
    // turn LED on
    led.writeSync(1);
  } else {
    // turn LED off
    led.writeSync(0);
  }
  
}
 
// pass the callback function to the
// as the first argument to watch()
button.watch(light);
*/
(function blink(count){
  if (count <= 0){
    return led.unexport();
  }
  
  led.read(function(err, value){
    if (err) {
      throw err;
    }
    
    led.write(value ^1, function(err){
      if (err) {
        throw err;
      }
    });
    
  });
  
  setTimeout(function(){
    blink(count -1);
  }, 200);
  
}(25));

console.log('===========================');

validGPIOs = [2,3,4,17,27,22,10,9];

targetpin = new GPIO(27, 'in');
console.log(targetpin.readSync());
// targetpin.unexport();

targetpin = new GPIO(27, 'out');
targetpin.writeSync(1);
console.log('write 1 to pin');
//targetpin.unexport();

//targetpin = new GPIO(27, 'in');
console.log(targetpin.readSync());
targetpin.unexport();

//console.log(validGPIOs.splice( validGPIOs.indexOf(10), 1));
//console.log(validGPIOs);

var arrpin = [];
console.log(arrpin.length);
arrpin[10] = new GPIO(10, 'in');
console.log(arrpin[10].readSync());
arrpin[10].unexport;

console.log(arrpin.length);

for (var i=0; i<arrpin.length; i++){
  console.log(typeof(arrpin[i]));
  console.log(arrpin[i]);
}

console.log(arrpin[10].gpio);

console.log('=====================');
for (i in arrpin){
  console.log(arrpin[i]);
}
console.log('=====================');

arrpin.forEach(function(element){
  console.log(element);
});

/*
var pinArray = [];
for (var i=0; i < validGPIOs.length; i++) {

  console.log(validGPIOs[i]);
  var targetpin = new GPIO(validGPIOs[i], 'in');
  // var value = targetpin.readSync();
  // pinArray.push({ 'pin': validGPIOs[i], 'value' : value });
    
  targetpin.read(function(err, value){
    if (err) {
      throw err;
    }
    console.log(validGPIOs[i]);
    console.log(value);  
    pinArray.push({ 'pin': validGPIOs[i], 'value' : value }); 
  });
    
  targetpin.unexport();
  
}

console.log('\n'+'end.');
console.log(pinArray);

*/
