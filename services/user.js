const userModel = require('../models/user');

exports.logIn = async (email) => {
    console.log("myEmail: ",email);
    const user = await userModel.findOne({email: email},'id email password avatar');
    console.log('user : ',user);
    return user;
}
