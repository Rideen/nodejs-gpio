var express = require('express');
var router = express.Router();

// Log to console each request receive - for all routes
router.use(function(req, res, next){
  console.log('>> Request received from '+req.ip+': '+req.method+' - '+req.originalUrl);
  next();
});

// declare sub-routes here
router.use('/gpio', require('./gpio2'));
router.use('/ozw', require('./ozw'));

// routes in main file
router.get('/', function(req, res){
  res.send('Home page');
});

router.get('/about', function(req, res){
  res.send('About page');
});

// Catch all other routes
router.get('*', function(req, res){
  res.status(400).send('Invalid API route: '+req.method+' '+req.originalUrl);
});



module.exports = router;
