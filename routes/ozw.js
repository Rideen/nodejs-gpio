var express = require('express');
var router = express.Router();

// middleware specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});
// define the home page route
router.get('/', function(req, res) {
  res.send('Birds home page');
});
// define the about route
router.get('/about', function(req, res) {
  res.send('About birds');
});

// Catch all other routes
router.get('*', function(req, res){
  res.send('Invalid API route: '+req.method+' '+req.originalUrl);
});


module.exports = router;
