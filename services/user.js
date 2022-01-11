const userModel = require('../models/user');

exports.logIn = async (email) => {
    const user = await userModel.findOne({email: email},'id email password');
    return user;
}