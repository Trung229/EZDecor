const firebase = require('../db_firebase');
const productModel = require('../models/product');

async function handleImage(req) {
    if (!req.file) {
        return "Error: No files found"
    }
    const imageName = req.file;
    const finalName = "product_"+ Date.now() + "." + imageName.originalname.split(".").pop();
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
        blobWriter.on('finish', async () => {
            await blob.makePublic()
            req.file.firebaseUr = `https://storage.googleapis.com/${process.env.STORAGE_BUCKET}/${finalName}`
            resolve(req.file.firebaseUr)
        });
        blobWriter.end(req.file.buffer)
    });

}



exports.getAll = async () => {
    const product = await productModel.find();
    return product;
}

exports.addProduct = async (product, req) => {
    const isExist = await productModel.findOne({ name: product.name });
    if (isExist) {
        return {
            payload: {
                message: "name is exist",
                status: false
            }
        }
    }
    const url = await handleImage(req)
    const newProduct = new productModel({...product, thumbnail: url,});
    await newProduct.save();
    return {
        payload: {
            message: "add Product is success",
            status: true
        }
    };
}

exports.deleteProduct = async (id) => {
    const check = await productModel.deleteOne({ _id: id });
    if (check.deletedCount) {
        return {
            payload: {
                message: "Product is deleted",
                status: true
            }
        }
    } else {
        return {
            payload: {
                message: "Product is not exist",
                status: false
            }
        }
    }
}