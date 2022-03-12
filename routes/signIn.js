var express = require('express');
var router = express.Router();
const userController = require('../controllers/user');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const facebookStrategy = require('passport-facebook').Strategy;
router.use(passport.initialize());
// router.use(passport.session());
passport.serializeUser(function(user, done){
  done(null, user);
})

passport.deserializeUser(function(id, done){
  return done(null, id);
})

/**Login With Facebook for website */

passport.use(new facebookStrategy({
  clientID: "664018878051646",
  clientSecret: "0114769e1460e2cfc3f99df2eca6ff55",
  callbackURL: "http://localhost:9000/auth/facebook/callback",
  profileFields:  ['id', 'displayName', 'name', 'gender', 'picture.type(large)','email']
},
  async function (accessToken, refreshToken, profile, cb) {
    const data = await userController.loginWithThirdParty({profile, accessToken});
    return cb(null, data);
  }
));

router.get("/auth/facebook", passport.authenticate('facebook', {scope: 'email'}))
router.get("/auth/facebook/callback", passport.authenticate('facebook', {
  successRedirect:'/profile',
  failureRedirect:'/failed'
}))

router.get("/profile", (req, res, next) => {
  console.log("profile");
  res.send("you are valid user");
});
router.get("/failed",(req, res, next)=>{
  res.send("you are not valid user");
})



/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('login', { title: 'Express' });
});

router.post("/loginWithThirdParty", async function (req, res, next){
  const data = await userController.loginWithThirdParty(req.body);
  res.json(data);
})

router.post('/',async function (req, res, next) {
  const {email, password} = req.body;
  const check = await userController.logIn(email,password);
  if(check.status){
    const token = jwt.sign({email, password, avatar: check.avatar}, process.env.ACCESS_TOKEN, {expiresIn: '1h'});
    res.json({status:check.status, token, avatar: check.avatar, email: check.email});
  }else{
    res.json({payload:check});
  }
});


module.exports = router;
