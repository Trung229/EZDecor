var express = require('express');
var router = express.Router();
const orderController = require('../controllers/order');
const userController = require('../controllers/user');
const productController = require('../controllers/product');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const moment = require('moment');

function addCommas(numbers) {
    var n = parseInt(numbers.toString().replace(/\D/g, ''), 10);
    return n.toLocaleString()
}

router.post('/createOrder', async function(req, res, next) {
    const { Address, products_id, transportation, price, voucher, payment, customer_id, status } = req.body;

    if (!Address || !products_id || !payment || !transportation || !price || !customer_id) {
        res.send({
            message: 'some fields is empty',
            status: false
        })
    } else {
        const check = await orderController.createOrder({...req.body })
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
    console.log(order);
    if (order.payload.status) {
        const products = await Promise.all(order.payload.data.products_id.map(async(item) => {
            return await productController.getProductDetail(item.product_id.toString())
        }));
        const user = await userController.getDetailUser(user_id);
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'dtrtr2@gmail.com',
                pass: '22112015ak'
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
            from: 'dtrtr2@gmail.com',
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
module.exports = router;