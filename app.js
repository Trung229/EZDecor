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
const cart = require('./routes/cart');
const order = require('./routes/order');
const mongoose = require('mongoose');

hbs.registerHelper('addCommas', (number, t) => {
    var n = parseInt(number.toString().replace(/\D/g, ''), 10);
    return n.toLocaleString()
})

hbs.registerHelper('getNameUser', (data, users, t) => {
    return users.find((item) => item._id.toString() == data.toString()).name;
})

hbs.registerHelper('convertBooleanPayment', (flag, t) => {
    if (flag) {
        return "Online"
    } else {
        return "Offline"
    }
})


hbs.registerHelper('formatDate', (a, t) => {
    let date = new Date(a);
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    month = month.toString().length == 1 ? '0' + month : month;
    let day = date.getDate().toString().length == 1 ? '0' + date.getDate().toString() : date.getDate().toString();
    return day + "/" + month + "/" + year;
})

hbs.registerHelper('isValidURL', (string, t) => {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
})


hbs.registerHelper("checkLength", (arr, t) => {
    if (arr.length !== 0) {
        return true;
    } else {
        return false;
    }
})

hbs.registerHelper("returnNewArr", (arrID, arrObj, t) => {
    const newArr = arrID.map((item) => {
        return arrObj.find((obj) => obj._id.toString() == item._id.toString());
    })
    return newArr
})

hbs.registerHelper("isCheck", (arrProduct, id, t) => {
    const check = arrProduct.some((item) => {
        return item._id.toString() === id.toString();
    })
    return check;
})


hbs.registerHelper("countLength", (arrProduct, t) => {
    return arrProduct.length;
})
hbs.registerHelper("checkStatus", (status, t) => {
    console.log(status);
    return status === "request"
})


mongoose.connect(process.env.MONGODB, { useNewUrlParser: true })
    .then((res) => console.log(">>>>>DB connected"))
    .catch((err) => console.error("Connect fail", err));

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
app.use("/cart", cart);
app.use("/order", order);
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