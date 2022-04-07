var express = require('express');
var router = express.Router();
const cartController = require('../controllers/cart');


router.post('/createCart', async function(req, res, next) {
    const { userId } = req.body;
    const cart = await cartController.createCart(userId)
    res.send({ cart })
});


router.post('/updateCart', async function(req, res, next) {
    const { id, data } = req.body;
    const cart = await cartController.updateCart(id, data)
    res.send({ cart })
});


router.post('/', async function(req, res, next) {
    const { id } = req.body;
    const cart = await cartController.getAllCart(id)
    res.send({ cart })
});

router.post("/delete", async function(req, res, next) {
    const { id, productId } = req.body;
    if (id, productId) {
        const cart = await cartController.deleteItemInCart(id, productId)
        res.send({ cart })
    } else {
        res.send({
            payload: {
                message: "some field is required",
                status: false
            }
        })
    }
})



module.exports = router;