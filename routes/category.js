var express = require('express');
var router = express.Router();
const categoryController = require('../controllers/category');
/* GET users listing. */
router.get('/', async function (req, res, next) {
    const category = await categoryController.getAll()
    console.log(category)
    res.send('respond with a resource');
});

router.get("/category", async function (req, res, next) {
  res.render("category", { title: "Category" });
});

router.post('/addCategory', async function (req, res, next) {
    const {name, thumbnail } = req.body;
    const category = await categoryController.addCategory({name, thumbnail})
    console.log(category)
    res.send('respond with a resource');
});

module.exports = router;
