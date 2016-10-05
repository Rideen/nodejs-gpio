// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');

// configure routes
//var r_gpio = require('./routes/gpio');
//var r_ozw = require('./routes/ozw');


// configure middleware
app.use(morgan('dev')); // log requests to the console
app.use(bodyParser.urlencoded({ extended: true }));  // get data from POST
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set our port

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;  // IP Addr v6
  console.log('Client IP address:'+ip);
  console.log(req.connection.localAddress);
  console.log('Request received from '+req.hostname+": "+req.originalUrl);
  next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' }); 
});

// on routes that end in /gpio
router.route('/gpio')

  /* Template
  .get(function(req, res){

    bear.save(function(err) {
      if (err)
        res.send(err);

      res.json({ message: 'Bear created!' });

  OR
  
  .post(functionname.method);

  */  
  

  // get all gpio status
  .get(function(req, res){
    
    res.json({ status: 'All GPIO pin status' });
    console.log('Responded: GET /gpio');
    
  });

// on routes that end in /gpio/:gpio_no
router.route('/gpio/:gpio_no')
  // when read pin value, pin mode already INPUT
  // read pin value
  .get(function(req, res){
    
    res.json({ GPIO_no: req.params.gpio_no});
    console.log('Responded: GET /gpio/gpio_pin');
    
  });
  
router.route('/gpio/:gpio_no/OUTPUT/:gpio_value')
  // when set pin value, pin mode must be OUTPUT
  // set pin value
  .get(function(req, res){
    pin_no = req.params.gpio_no;
    pin_value = req.params.gpio_value;
  
    console.log('Received. Pin Type:'+'OUTPUT'+' Pin Value:'+pin_value);
    res.json({ status: "Set: Pin #"+pin_no+" : "+pin_value}); 
   
  });


/*
// on routes that end in /bears
// ----------------------------------------------------
router.route('/bears')

  // create a bear (accessed at POST http://localhost:8080/bears)
  .post(function(req, res) {
    
    var bear = new Bear();    // create a new instance of the Bear model
    bear.name = req.body.name;  // set the bears name (comes from the request)

    bear.save(function(err) {
      if (err)
        res.send(err);

      res.json({ message: 'Bear created!' });
    });

    
  })

  // get all the bears (accessed at GET http://localhost:8080/api/bears)
  .get(function(req, res) {
    Bear.find(function(err, bears) {
      if (err)
        res.send(err);

      res.json(bears);
    });
  });

// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/bears/:bear_id')

  // get the bear with that id
  .get(function(req, res) {
    Bear.findById(req.params.bear_id, function(err, bear) {
      if (err)
        res.send(err);
      res.json(bear);
    });
  })

  // update the bear with this id
  .put(function(req, res) {
    Bear.findById(req.params.bear_id, function(err, bear) {

      if (err)
        res.send(err);

      bear.name = req.body.name;
      bear.save(function(err) {
        if (err)
          res.send(err);

        res.json({ message: 'Bear updated!' });
      });

    });
  })

  // delete the bear with this id
  .delete(function(req, res) {
    Bear.remove({
      _id: req.params.bear_id
    }, function(err, bear) {
      if (err)
        res.send(err);

      res.json({ message: 'Successfully deleted' });
    });
  });

*/

// REGISTER OUR ROUTES -------------------------------
// all routes will be prefix with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server started on port ' + port);
console.log('\n'+'Hit CTRL+C to stop the server');
