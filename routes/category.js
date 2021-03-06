var express = require('express');
var router = express.Router();
const categoryController = require('../controllers/category');
const { uploadSingleImage } = require('../middlewares/handleImages');


router.get('/', async function (req, res, next) {
    const category = await categoryController.getAll();
    res.render('category', { category });
});


router.post('/addCategory', uploadSingleImage.single('thumbnail'), async function (req, res, next) {
    const category = await categoryController.addCategory({ ...req.body }, req)
    res.send(category);
});


router.post('/deleteCategory', async (req, res, next) => {
    const { id } = req.body;
    const data = await categoryController.deleteCategory(id)
    res.send({ data })
})

router.post('/getCategoryDetail', async (req, res, next) => {
    const { id } = req.body;
    const data = await categoryController.getCategoryDetail(id)
    res.send(data);
})

router.post('/updateCategory', uploadSingleImage.single('thumbnail'), async (req, res, next) => {
    const category = await categoryController.updateCategoryDetail({ ...req.body }, req)
    res.send(category);
})



module.exports = router;
