const firebase = require('../db_firebase');
const productServices = require('../services/product');
require('dotenv').config();

async function handleImage(req) {
    if (!req.file) {
        return "Error: No files found"
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
        blobWriter.on('finish', async () => {
            await blob.makePublic()
            req.file.firebaseUr = `https://storage.googleapis.com/${process.env.STORAGE_BUCKET}/${finalName}`
            resolve(req.file.firebaseUr)
        });
        blobWriter.end(req.file.buffer)
    });

}

exports.getAll = function () {
    const product = productServices.getAll();
    return product;
}

exports.addProduct = async function (data, req) {
    if (!data.admin) return "you need an account to add a new product";
    if (!data.name) return "name is empty";
    if (!data.price) return "price is empty";
    if (!data.description) return "description is empty";
    if (!data.inventory) return "inventory is empty";
    if (!data.origin) return "origin is empty";    
    const url = await handleImage(req)
    const message = productServices.addProduct({
        name: data.name,
        price: data.price,
        image: data.image ?? [],
        thumbnail: url,
        description: data.description,
        inventory: data.inventory,
        origin: data.origin,
        quality: data.quality ?? "Good",
        discounts: data.discounts ?? [],
        sold: data.sold ?? 0,
        styleId: data.styleId ?? "6221ba0e1d0074afe4b8566a",
        category: data.category ?? "507f191e810c19729de860ea",
        createdAt: Date.now(),
        admin: data.admin
    });
    return message;
}


exports.deleteProduct = (id) =>{
    return productServices.deleteProduct(id);
}