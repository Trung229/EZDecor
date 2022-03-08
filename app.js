var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();


var indexRouter = require('./routes/signIn');
var usersRouter = require('./routes/users');
var mainRouter = require('./routes/main');
var styleRouter = require('./routes/style');
var categoryRouter = require('./routes/category');
var mobile = require('./routes/mobile')
const mongoose = require('mongoose');



console.log(process.env.MONGODB);

mongoose.connect(process.env.MONGODB,{useNewUrlParser: true})
.then((res)=> console.log(">>>>>DB connected"))
.catch((err)=> console.error("Connect fail", err));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/main', mainRouter);
app.use('/style', styleRouter);
app.use('/category', categoryRouter);
app.use('/mobile', mobile);

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
  res.render('error');
});

module.exports = app;
