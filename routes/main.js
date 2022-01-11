var express = require('express');
var router = express.Router();
const auth = require('../middlewares/authenToken')

/* GET home page. */
router.get('/', [auth.authenToken],function(req, res, next) {
  res.render('main', { title: 'Express' });
});

module.exports = router;
