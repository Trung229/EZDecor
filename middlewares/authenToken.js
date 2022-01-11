const jwt = require('jsonwebtoken');


exports.authenToken = async (req, res, next) => {
    const userToken = req.query.userToken;
    if (!userToken) {
        res.sendStatus(401); 
    }else{
        jwt.verify(userToken, process.env.ACCESS_TOKEN, (err, token) => {
            if(err){
                return res.redirect("/")
            }else{
                return next();
            }
        })
    }
    
}

