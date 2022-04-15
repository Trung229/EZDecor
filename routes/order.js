var express = require('express');
var router = express.Router();
const orderController = require('../controllers/order');
const userController = require('../controllers/user');
const productController = require('../controllers/product');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const moment = require('moment');
var socket = require('../socket.io')

function addCommas(numbers) {
    var n = parseInt(numbers.toString().replace(/\D/g, ''), 10);
    return n.toLocaleString()
}

function sendMail(id, user, products, order) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    transporter.use('compile', hbs({
        viewEngine: {
            extname: '.handlebars',
            partialDir: path.resolve('../app/views/productEmail'),
            defaultLayout: false
        },
        viewPath: path.resolve('../app/views/productEmail'),
        extname: '.handlebars',
    }))

    var mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: 'XÁC NHẬN ĐƠN HÀNG',
        template: 'index',
        context: {
            id: id,
            name: user.name,
            products: products.map((item) => item.toJSON()),
            address: order.payload.data.Address,
            price: addCommas(order.payload.data.price),
            date: moment(order.payload.data.date).add(3, "days").format('DD-MM-YYYY')
        }
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

router.post('/createOrder', async function(req, res, next) {
    const { Address, products_id, transportation, price, customer_id, status, isOnlinePayment } = req.body;

    if (!Address || !products_id || !transportation || !price || !customer_id || !isOnlinePayment) {
        res.send({
            message: 'some fields are empty',
            status: false
        })
    } else {
        const check = await orderController.createOrder({...req.body })
        const user = await userController.getDetailUser(check.payload.data.customer_id);
        const products = await Promise.all(check.payload.data.products_id.map(async(item) => {
            return await productController.getProductDetail(item.product_id.toString())
        }));
        sendMail(check.payload.data._id, user, products, check)
        res.send(check)
    }
});

router.get('/getList', async function(req, res, next) {
    const order = await orderController.getAll()
    const user = await userController.getAllUsers();
    res.render('order', { order, user });
})

router.post('/updateStatus', async function(req, res, next) {
    const { id, user_id } = req.body;
    const order = await orderController.updateStatus(id);
    if (order.payload.status) {
        const products = await Promise.all(order.payload.data.products_id.map(async(item) => {
            return await productController.getProductDetail(item.product_id.toString())
        }));
        const user = await userController.getDetailUser(user_id);
        sendMail(id, user, products, order)
        res.json({ status: "email is sent" })
    } else {
        res.send("failed")
    }

})

router.get('/static', async function(req, res, next) {
    const arrMoney = await orderController.static()
    res.send({ arrMoney });
})

router.get('/earnInMonth', async function(req, res, next) {
    const arrMoney = await orderController.earnInMonth()
    res.send({ arrMoney });
})
router.get('/traffic', async function(req, res, next) {
    const traffic = await orderController.traffic()
    res.send({ traffic });
})
router.get('/orderRequest', async function(req, res, next) {
    const orderRequest = await orderController.orderRequest()
    res.send({ orderRequest });
})
router.get('/totalUserDevice', async function(req, res, next) {
    const totalUserDevice = await orderController.totalUserDevice()
    res.send({ totalUserDevice });
})

router.post('/getOrderByID', async function(req, res, next) {
    const { id } = req.body;
    const order = await orderController.getOrderByID(id)
    res.send({ order });
})


router.post('/create_payment_url', async function(req, res, next) {
    const { isOnlinePayment, Address, products_id, transportation, price, customer_id } = req.body;

    if (!isOnlinePayment) {
        if (!Address || !products_id || !transportation || !price || !customer_id) {
            res.send({
                message: 'some fields are empty',
                status: false
            })
        } else {
            const check = await orderController.createOrder({...req.body })
            res.send(check)
        }
    } else {
        var ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        var tmnCode = process.env.VNP_TMN_CODE;
        var secretKey = process.env.VNP_HASH_SECRET;
        var vnpUrl = process.env.VNP_URL;
        var returnUrl = process.env.VNP_RETURN_URL;
        var date = new Date();

        var createDate = moment(date).format('yyyyMMDDHHmmss');
        var orderId = moment(date).format('HHmmss');
        var amount = req.body.infoATM.amount;
        var bankCode = req.body.infoATM.bankCode;

        var orderInfo = req.body.infoATM.orderDescription;
        var orderType = req.body.infoATM.orderType;
        var locale = req.body.infoATM.language;
        if (locale === null || locale === '') {
            locale = 'vn';
        }
        var currCode = 'VND';
        var vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        // vnp_Params['vnp_Merchant'] = ''
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = orderInfo;
        vnp_Params['vnp_OrderType'] = orderType;
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require("crypto");
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
        res.send({ vnpUrl })
    }

});

router.get('/vnpay_return', function(req, res, next) {
    var vnp_Params = req.query;

    var secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    console.log(vnp_Params);
    var tmnCode = process.env.VNP_TMN_CODE;
    var secretKey = process.env.VNP_HASH_SECRET;

    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

    if (secureHash === signed) {
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
        socket.io.emit("FromAPI", {
            message: "Payment is success",
            status: true,
            data: vnp_Params,
        });
    } else {
        console.log("out")
        res.render('success', { code: '97' })
    }
});


function sortObject(obj) {
    var sorted = {};
    var str = [];
    var key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = router;