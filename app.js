var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var indexRouter = require('./routes/index');
const api = require('./routes/api');
const rooomRouter = require('./routes/room');
require('dotenv').config();
let PORT = process.env.PORT || 3001;
var app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1', api);
app.use('/room', rooomRouter);

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
const server = app.listen(PORT, () => {
  console.log('Server connecter: ' + PORT);
});

// MongoDB setup

mongoose
  .connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB CONNECTION SUCCESSFULL !'))
  .catch((err) => {
    console.log('DB connection failed');
  });

//initialize socket for the server

const socketServe = require('./socketio');
socketServe.sock(server);
