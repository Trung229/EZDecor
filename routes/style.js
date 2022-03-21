var express = require('express');
var router = express.Router();
const styleController = require('../controllers/style');
const { uploadSingleImage } = require('../middlewares/handleImages');
/* GET users listing. */
router.get('/', async function (req, res, next) {
    const style = await styleController.getAll()
    res.render('style', { style });
});

router.post('/addStyle', uploadSingleImage.single('thumbnail'), async function (req, res, next) {
    const style = await styleController.addStyle({ ...req.body }, req);
    res.send(style);
});

router.post('/deleteStyle', async (req, res, next) => {
    const { id } = req.body;
    const data = await styleController.deleteStyle(id)
    res.send({ data })
})

module.exports = router;
