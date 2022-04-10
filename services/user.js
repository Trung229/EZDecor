const userModel = require('../models/user');
const accountAuth = require('../models/accountAuth');
const moment = require('moment');

exports.logIn = async(email) => {
    const user = await userModel.findOne({ email: email }, 'id email password avatar');
    return user;
}

exports.loginWithThirdParty = async(data) => {
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

exports.checkEmail = async(email) => {
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

exports.register = async(name, email, password, dob, code, phone) => {
    const checkInAccountAuth = await accountAuth.findOne({ email: email }, "numberAuth");
    if (checkInAccountAuth) {
        if (code === checkInAccountAuth.numberAuth) {
            const newUser = new userModel({
                name: name,
                email: email || "invalid email",
                password: password || "invalid password",
                isAdmin: false,
                avatar: "https://img.freepik.com/free-vector/flat-creativity-concept-illustration_52683-64279.jpg",
                token: "invalid token",
                dob: dob || "06-03-2022",
                createdAt: new Date(),
                phone: phone || 036296041,
                addresses: [],
                uid: "account doesn't come from third party"
            });
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
}

exports.mobileLogIn = async(email, password) => {
    const user = await userModel.findOne({ email: email });
    if (user) {
        user.dateActivity = moment().startOf("day").format("MM-DD-YYYY");
        await user.save();
        return {
            payload: {
                message: "Login success",
                data: user,
                status: true
            }
        }
    } else {
        return {
            payload: {
                message: "email is not exist",
                status: false
            }
        }
    }
}

exports.getAllUsers = async() => {
    return await userModel.find({}, 'id name');
}

exports.addAddress = async(email, address) => {
    const user = await userModel.findOne({ email: email });
    if (user) {
        const isExist = await user.addresses.some((item) => {
            return item.place === address
        })
        console.log()
        if (!isExist && address.length !== 0) {
            console.log(email)
            console.log(address)
            const newArr = [...user.addresses];
            newArr.push({ "place": address });
            console.log("newArr", newArr);
            user.addresses = newArr;
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