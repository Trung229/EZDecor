const userModel = require('../models/user');
const accountAuth = require('../models/accountAuth');
const moment = require('moment');
const cartModel = require('../models/cart');


exports.logIn = async (email) => {
    const user = await userModel.findOne({ email: email });
    return user;
}

exports.loginWithThirdParty = async (data) => {
    const check = await userModel.findOne({ uid: data.res.id });
    if (check) {
        return {
            message: "Login is successful",
            isSuccess: true,
        };
    } else {
        const newUser = new userModel({
            name: data.res.name,
            email: data.res.email || "invalid email",
            password: data.res.password || "invalid password",
            isAdmin: data.res.isAdmin || true,
            avatar: data.res.picture.data.url || "https://img.freepik.com/free-vector/flat-creativity-concept-illustration_52683-64279.jpg",
            token: data.token || "invalid token",
            dob: data.res.dob || "06-03-2022",
            createdAt: data.res.createdAt || "06-03-2022",
            phone: data.res.phone || 036296041,
            addresses: data.res.addresses || [],
            uid: data.res.id || "account doesn't come from third party"
        });
        await newUser.save();
        return {
            message: "Sign Up is successful",
            isSuccess: true,
        };
    }
}

exports.checkEmail = async (email) => {
    const check = await userModel.findOne({ email: email });
    const checkInAccountAuth = await accountAuth.findOne({ email: email });
    if (!check && !checkInAccountAuth) {
        const newAccount = new accountAuth({
            email,
            numberAuth: Math.floor(100000 + Math.random() * 900000).toString(),
            createdAt: new Date()
        });
        await newAccount.save();
        return {
            payload: {
                message: "you can use this email",
                status: true
            },
            data: {
                newAccount
            }
        }
    } else {
        return {
            payload: {
                message: "Registered account",
                status: false
            },
            data: null
        }
    }
}

exports.register = async (name, email, password, dob, code, phone) => {
    const checkInAccountAuth = await accountAuth.findOne({ email: email }, "numberAuth");
    const user = await userModel.findOne({ email: email });
    const newCart = new cartModel();
    if (!user) {
        if (checkInAccountAuth) {
            if (code === checkInAccountAuth.numberAuth) {
                const newUser = new userModel({
                    name: name,
                    email: email || "invalid email",
                    password: password || "invalid password",
                    isAdmin: false,
                    avatar: "https://img.freepik.com/free-vector/flat-creativity-concept-illustration_52683-64279.jpg",
                    token: "invalid token",
                    dob: dob || "06/03/2022",
                    createdAt: new Date(),
                    phone: phone || 036296041,
                    addresses: [],
                    uid: "account doesn't come from third party"
                });
                newCart.customer_id = newUser._id.toString();
                await newCart.save();
                await newUser.save();
                return {
                    message: "create account is success",
                    status: true
                }
            } else {
                return {
                    message: "code is wrong",
                    status: false
                }
            }
        } else {
            return {
                message: "Expired code",
                status: false
            }
        }
    } else {
        return {
            message: "Email is taken",
            status: false
        }
    }
}

exports.mobileLogIn = async (email) => {
    const user = await userModel.findOne({ email: email });
    if (user) {
        user.dateActivity = moment().startOf("day").format("MM-DD-YYYY");
        await user.save();
        return {
            payload: {
                status: true,
                data: user
            }
        }
    } else {
        return {
            payload: {
                status: false
            }
        }
    }
}

exports.getAllUsers = async () => {
    return await userModel.find({}, 'id name');
}

exports.addAddress = async (email, address) => {
    const user = await userModel.findOne({ email: email });
    if (user) {
        const isExist = await user.addresses.some((item) => {
            return item.place === address
        })
        if (!isExist && address.length !== 0) {
            user.addresses = address;
            await user.save();
            return {
                message: "Update successful",
                status: true
            }
        } else {
            return {
                message: "address is exist or your address is empty, please check again!!",
                status: false
            }
        }
    } else {
        return {
            message: "Email is not exist",
            status: false
        }
    }
}

exports.getDetailUser = async (userID) => {
    if (userID) {
        const user = await userModel.findOne({ _id: userID });
        return user;
    } else {
        return {
            message: "user is not exist"
        }
    }
}


exports.updateInfoUser = async (data) => {
    const user = await userModel.findOne({ _id: data.id }, (err, doc) => null).clone().catch(function (err, arr) {
        if (err) {
            return {
                message: 'Wrong format Id',
                status: false
            }
        } else {
            console.log("my arr: ", arr)
        }
    });
    if (user) {
        user.name = data.name ? data.name : user.name;
        user.phone = data.phone ? data.phone : user.phone;
        user.dob = data.dob ? data.dob : user.dob;
        user.save();
        return {
            message: "update success",
            status: true
        }
    } else {
        return {
            message: "user is not exist",
            status: false
        }
    }
}