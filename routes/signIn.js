var express = require('express');
var router = express.Router();
const userController = require('../controllers/user');
const jwt = require('jsonwebtoken');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('login', { title: 'Express' });
});

router.post('/',async function (req, res, next) {
  const {email, password} = req.body;
  const check = await userController.logIn(email,password);
  if(check.status){
    const token = jwt.sign({email, password}, process.env.ACCESS_TOKEN, {expiresIn: '60s'});
    res.json({status:check.status, token});
  }else{
    res.json({payload:check});
  }
});


module.exports = router;
