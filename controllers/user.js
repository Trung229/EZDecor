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
    return {id: user._id, email: user.email, status: true, avatar: user.avatar};
}

exports.loginWithThirdParty = async (data)=>{
    const check = await userService.loginWithThirdParty(data);
    return check;
}

exports.checkEmail =async (email)=>{
    const check = await userService.checkEmail(email);
    return check;
}

exports.register = async (name, email, password, dob, code, phone) =>{
    const check = await userService.register(name, email, password, dob, code, phone);
    return check;
}