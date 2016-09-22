/*var interval = setInterval(function(str1, str2){
	console.log(str1+' '+str2);
}, 1000, "Hello.", "How are you?");

clearInterval(interval);

setTimeout(function(){
	console.log('timeout completed.');
}, 1000);

setInterval(function(){
	console.log('second passed');
}, 1000);
*/

var count = 0;

var intervalObject = setInterval(function(){
	count++;
	console.log(count, 'seconds passed');
	if (count == 5){
		console.log('exiting');
		clearInterval(intervalObject);
	}
}, 1000);
