var express = require('express');
var router = express.Router();
const styleController = require('../controllers/style');
const { uploadSingleImage } = require('../middlewares/handleImages');
var socket = require('../socket.io')
    /* GET users listing. */
    // socket.io.on("update", (msg) => {
    //     console.log("myMsg: ", msg)
    // })

router.get('/', async function(req, res, next) {
    const style = await styleController.getAll()
    res.render('style', { style });
});

router.post('/addStyle', uploadSingleImage.single('thumbnail'), async function(req, res, next) {
    const style = await styleController.addStyle({...req.body }, req);
    socket.io.emit("UpdateStyle", {
        message: "from API"
    });
    res.send(style);
});

router.post('/deleteStyle', async(req, res, next) => {
    const { id } = req.body;
    const data = await styleController.deleteStyle(id)
    res.send({ data })
})

router.post('/getStyleDetail', async(req, res, next) => {
    const { id } = req.body;
    const data = await styleController.getStyleDetail(id)
    res.send(data);
})

router.post('/updateStyle', uploadSingleImage.single('images'), async(req, res, next) => {
    const category = await styleController.updateStyle({...req.body }, req)
    res.send(category);
})


module.exports = router;