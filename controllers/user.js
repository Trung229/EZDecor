const userService = require('../services/user');

exports.logIn = async (emailF, passwordF)=>{
    const user = await userService.logIn(emailF);
    const checkPass = user ? passwordF === user.password : null;
    if(!user){
        return {
            message: 'user not exist',
            status: false,
        };
    }else if(!checkPass){
        return {
            message: 'Passwords do not match',
            status: false,
        };
    }
    return {id: user._id, email: user.email, status: true};
}

