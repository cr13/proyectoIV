var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var apis = require('./routes/apis');
var mongoose = require('mongoose');
var ip = require('ip');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/apis', apis);

// connect to our database
var theport = process.env.PORT || 8080;
mongoose.Promise = global.Promise
var database='mongodb://localhost:27017/db_usuarios'
if(typeof process.env.MONGODB_PORT_27017_TCP_ADDR != 'undefined'){
	database='mongodb://' + process.env.MONGODB_PORT_27017_TCP_ADDR + ':' + process.env.MONGODB_PORT_27017_TCP_PORT + '/usuarios'
}
mongoose.connect( process.env.MONGODB_URI || database);
mongoose.connection.on('error', function() {
  console.info('Error: Could not connect to MongoDB. Did you forget to run mongod "sudo service mongod start"?');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(theport, function() {
   console.log('Express server ' + ip.address() + ':' + theport);
});


module.exports = app;
