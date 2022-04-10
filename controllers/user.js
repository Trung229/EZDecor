const userService = require('../services/user');
var bcrypt = require('bcryptjs');
const firebase = require('../db_firebase');
const cartServices = require('../services/cart');
require('dotenv').config();


exports.logIn = async(emailF, passwordF) => {
    const user = await userService.logIn(emailF);
    const checkPass = user ? passwordF === user.password : null;
    if (!user) {
        return {
            message: 'user not exist',
            status: false,
        };
    } else if (!checkPass) {
        return {
            message: 'Passwords do not match',
            status: false,
        };
    }
    return { id: user._id, email: user.email, status: true, avatar: user.avatar };
}

exports.loginWithThirdParty = async(data) => {
    const check = await userService.loginWithThirdParty(data);
    return check;
}

exports.checkEmail = async(email) => {
    const check = await userService.checkEmail(email);
    return check;
}

exports.register = async(name, email, password, dob, code, phone) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const check = await userService.register(name, email, hash, dob, code, phone);
    return check;
}

exports.mobileLogin = async(email, password) => {
    const user = await userService.mobileLogIn(email, password);
    if (user.payload.status) {
        const checkPass = await bcrypt.compare(password, user.payload.data_user.password);
        const cart = await cartServices.getAllCart(user.payload.data_user._id.toString())
        user.cart = cart;
        console.log("user : ", user);
        return {
            checkPass,
            data: user
        };
    } else {
        return user
    }
}

exports.uploadSingleImages = async(req, res) => {
    if (!req.file) {
        res.status(400).send("Error: No files found")
    }
    const imageName = req.file;
    const finalName = Date.now() + "." + imageName.originalname.split(".").pop();
    const blob = firebase.bucket.file(finalName);
    return new Promise((resolve, reject) => {
        const blobWriter = blob.createWriteStream({
            metadata: {
                contentType: imageName.mimetype
            }
        });
        blobWriter.on('error', (err) => {
            reject(err);
        });
        blobWriter.on('finish', async() => {
            await blob.makePublic()
            req.file.firebaseUr = `https://storage.googleapis.com/${process.env.STORAGE_BUCKET}/${finalName}`
            resolve(req.file.firebaseUr)
            res.status(200).send("File uploaded.");
            return req.file;
        });
        blobWriter.end(req.file.buffer)
    });

}

exports.getAllUsers = async() => {
    return await userService.getAllUsers();
}

exports.addAddress = async(email, address) => {
    return await userService.addAddress(email, address);
}