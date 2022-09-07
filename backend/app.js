var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var http = require('http');
var mongoose = require('mongoose');
var passport = require('passport');
var app = express();
var server = http.createServer(app);

var userRouter = require('./routes/userRouter');


const dotenv = require('dotenv');
const cors = require('cors'); // frontend and backend alag hosted hai, to cross origin request bhjne ke liye
dotenv.config();

// Connect to the MongoDB
const url = process.env.MONGO_URI;
const connect = mongoose.connect(url,{useUnifiedTopology: true, useNewUrlParser: true});

connect.then((db) => {
  console.log("Connected to database successfully!\n");
}, (err) => {
  console.log(err);
})


app.use(cors());

// Middlewares
app.use(passport.initialize());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


var port = normalizePort(process.env.PORT || '8001');
app.set('port', port);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// Routers
app.use('/users', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});



/*
* Normalize a port into a number, string, or false.
*/
function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }
  return false;
  }

/*
* Event listener for HTTP server "error" event.
*/
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/*
* Event listener for HTTP server "listening" event.
*/
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}

module.exports = app;