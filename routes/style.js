var express = require('express');
var router = express.Router();
const styleController = require('../controllers/style');
/* GET users listing. */
router.get('/', async function (req, res, next) {
    const style = await styleController.getAll()
    res.render('style',{style});
});

router.post('/addStyle', async function (req, res, next) {
    const {name, description, images} = req.body;
    const style = await styleController.addStyle({name, description, images})
    console.log(style)
});

module.exports = router;
