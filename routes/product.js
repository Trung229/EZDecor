var express = require('express');
var router = express.Router();
const productController = require('../controllers/product');
const userController = require('../controllers/user');
const { uploadSingleImage } = require('../middlewares/handleImages');
const categoryController = require('../controllers/category');
const styleController = require('../controllers/style');
let socket = require('../socket.io');



router.get('/', async function(req, res, next) {
    const product = await productController.getAll();
    const user = await userController.getAllUsers();
    res.render('product', {
        product,
        user
    });
});

/* GET users listing. */
router.post('/uploadSingleImage', uploadSingleImage.single('thumbnail'), async function(req, res, next) {
    const store = userController.uploadSingleImages(req, res);
    const message = await store.then((res) => res);
    console.log("my message ", message);
});


router.post('/addProduct', uploadSingleImage.single('thumbnail'), async function(req, res, next) {
    const product = await productController.addProduct({...req.body }, req)
    res.send(product);
});

router.post('/deleteProduct', async(req, res, next) => {
    const { id } = req.body;
    const data = await productController.deleteProduct(id)
    res.send({ data })
})


router.get('/productDetail/:id', async function(req, res, next) {
    const { id } = req.params;
    const product = await productController.getProductDetail(id)
    const images = product.images ? product.images : [];
    const category = product.category ? product.category : [];
    const style = product.styleId ? product.styleId : [];
    const allCategory = await categoryController.getAll();
    const allStyle = await styleController.getAll();
    console.log(product);
    res.render('productDetail', { product, images, category, allCategory, style, allStyle });
});


router.post('/updateImagesProduct', uploadSingleImage.array("images", 20), async function(req, res, next) {
    const { id } = req.body;
    const result = await productController.updateImagesProduct(id, req);
    res.send({ result });
})

router.post('/updateCategories', async function(req, res, next) {
    const { id, category } = req.body;
    console.log(id, category);
    const result = await productController.updateCategories(id, category);
    res.send({ result });
})


router.post('/updateStyle', async function(req, res, next) {
    const { id, styleId } = req.body;
    const result = await productController.updateStyle(id, styleId);
    res.send({ result });
})

router.post('/deleteImages', async(req, res, next) => {
    const { imageName } = req.body;
    const result = await productController.deleteImages(imageName);
    res.send({ ok: "ok" });
})

router.post('/updateProduct', uploadSingleImage.single('thumbnail'), async(req, res, next) => {
    const product = await productController.updateProduct({...req.body }, req)
    res.send(product);
})


router.post('/getProductOnCategory', async(req, res, next) => {
    const { categoryId } = req.body;
    console.log(categoryId)
    const product = await productController.getProductOnCategory(categoryId);
    res.send(product);
})


router.post('/getProductOnStyles', async(req, res, next) => {
    const { styleID } = req.body;
    const product = await productController.getProductOnStyles(styleID);
    res.send(product);
})


module.exports = router;