var express = require('express');
var router = express.Router();
const auth = require('../middlewares/authenToken');
const jwt = require('jsonwebtoken');
const orderController = require('../controllers/order');

/* GET home page. */
router.get('/', [auth.authenToken], async function(req, res, next) {
    const userToken = req.query.userToken;
    const userTokenDecode = jwt.verify(userToken, process.env.ACCESS_TOKEN, (err, token) => {
        if (err) {
            return res.redirect("/")
        } else {
            return token;
        }
    });
    const { email, password, avatar } = userTokenDecode;
    const arrMoney = await orderController.earnInMonth();
    const traffic = await orderController.traffic();
    const orderRequest = await orderController.orderRequest()
    const totalUserDevice = await orderController.totalUserDevice()
    res.render('main', { email, password, avatar, arrMoney, traffic, orderRequest, totalUserDevice });
});

module.exports = router;