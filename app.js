const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
var hbs = require('hbs');

const indexRouter = require('./routes/signIn');
const usersRouter = require('./routes/users');
const mainRouter = require('./routes/main');
const styleRouter = require('./routes/style');
const categoryRouter = require('./routes/category');
const mobile = require('./routes/mobile')
const product = require('./routes/product')
const mongoose = require('mongoose');



hbs.registerHelper('returnData',(data)=>{
  console.log(data);
})

mongoose.connect(process.env.MONGODB,{useNewUrlParser: true})
.then((res)=> console.log(">>>>>DB connected"))
.catch((err)=> console.error("Connect fail", err));

const app = express();

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
app.use('/product', product);

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
