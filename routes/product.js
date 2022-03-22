var express = require('express');
var router = express.Router();
const productController = require('../controllers/product');
const userController = require('../controllers/user');
const { uploadSingleImage } = require('../middlewares/handleImages');
let socket = require('../socket.io');



router.get('/', async function (req, res, next) {
  const product = await productController.getAll();
  const user = await userController.getAllUsers();
  res.render('product', {
    product,
    user
  });
});

/* GET users listing. */
router.post('/uploadSingleImage', uploadSingleImage.single('thumbnail'), async function (req, res, next) {
  console.log(req.body);
  const store = userController.uploadSingleImages(req, res);
  const message = await store.then((res) => res);
  console.log("my message ", message);
});


router.post('/addProduct', uploadSingleImage.single('thumbnail'), async function (req, res, next) {
  const product = await productController.addProduct({ ...req.body }, req)
  res.send(product);
});

router.post('/deleteProduct', async (req, res, next) => {
  const { id } = req.body;
  console.log(id);
  const data = await productController.deleteProduct(id)
  res.send({ data })
})


router.get('/productDetail', async function (req, res, next) {
  res.render('productDetail');
});


module.exports = router;
