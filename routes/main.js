var express = require('express');
var router = express.Router();
const auth = require('../middlewares/authenToken');
const jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', [auth.authenToken], async function(req, res, next) {
  const userToken = req.query.userToken;
  const userTokenDecode = jwt.verify(userToken, process.env.ACCESS_TOKEN, (err, token) => {
    if(err){
        return res.redirect("/")
    }else{
        return token;
    }
});
const {email, password, avatar} = userTokenDecode;
  res.render('main', { email, password, avatar});
});

module.exports = router;
