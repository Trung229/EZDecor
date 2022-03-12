var express = require('express');
var router = express.Router();
const userController = require('../controllers/user');


/* GET users listing. */
router.get('/test', function(req, res, next) {
  // userController.test();
});



module.exports = router;
