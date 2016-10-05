// rpitools.js


var isRpiBRev2 = exports.isRpiBRev2 = function(){
  // check if is RpiBRev2?
  var RpiBRev2 = ["000d", "000e", "000f"];

  fs = require('fs');
  var data = fs.readFileSync('/proc/cpuinfo', 'utf8');
  var lines = data.split("\n");
  
  for (var i = 0; i < lines.length; i++){
    var pair = lines[i].split(':');
    if (pair[0].trim() === 'Revision') {
      if (pair[1].trim().indexOf(RpiBRev2)) return true;
      //break;
    }
  }  
  return false;
}
  
var validGPIOs = exports.validGPIOs = function(){
  // valid GPIOs available on Rpi
  var valid26GPIO = [2,3,4,17,27,22,10,9,11,14,15,18,23,24,25,8,7];
  var valid40GPIO = valid26GPIO.concat([5,6,13,19,26,12,16,20,21]);
  
  var validGPIOs = isRpiBRev2() ? valid26GPIO : valid40GPIO;
  return validGPIOs;
}

/*
console.log(isRpiBRev2());

validGPIOs().forEach(function(element){
  console.log(element);  
});
*/
