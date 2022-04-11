const firebase = require('../db_firebase');
const productModel = require('../models/product');

async function handleImage(req) {
    if (!req.file) {
        return "Error: No files found"
    }
    const imageName = req.file;
    const finalName = "product_" + Date.now() + "." + imageName.originalname.split(".").pop();
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
        });
        blobWriter.end(req.file.buffer)
    });

}


async function deleteImagesOnFireBase(imageName) {
    await firebase.bucket.file(imageName).delete();
}

async function handleArrImages(req) {
    if (!req) {
        return "Error: No files found"
    }
    const imageName = req;
    let finalName = "product_" + Date.now() + "." + imageName.originalname;
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
            req.firebaseUr = `https://storage.googleapis.com/${process.env.STORAGE_BUCKET}/${finalName}`
            resolve(req.firebaseUr)
        });
        blobWriter.end(req.buffer)
    });

}


exports.getAll = async() => {
    const product = await productModel.find();
    return product;
}

exports.addProduct = async(product, req) => {
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
    const newProduct = new productModel({...product, thumbnail: url, });
    await newProduct.save();
    return {
        payload: {
            message: "add Product is success",
            status: true
        }
    };
}

exports.deleteProduct = async(id) => {
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

exports.getProductDetail = async(id) => {
    const check = await productModel.findById(id);
    if (check) {
        return check
    } else {
        return "Product not found"
    }
}

exports.updateImagesProduct = async(id, req) => {
    const product = await productModel.findById(id.toString());
    if (!product) {
        return {
            payload: {
                message: "product is not exist",
                status: false,
            }
        }
    } else {
        const images = await Promise.all(req.files.map(async(item) => {
            const url = await handleArrImages(item)
            return { url };
        }))
        product.images = images;
        await product.save();
        return {
            payload: {
                message: "Updating is success",
                status: true,
            }
        };
    }
}

exports.updateCategories = async(id, category) => {
    const product = await productModel.findById(id.toString());
    if (!product) {
        return {
            payload: {
                message: "product is not exist",
                status: false,
            }
        }
    } else {
        product.category = category ? category : product.categories;
        await product.save();
        return {
            payload: {
                message: "Updating category is success",
                status: true,
            }
        };
    }
}

exports.updateStyle = async(id, styleId) => {
    const product = await productModel.findById(id.toString());
    if (!product) {
        return {
            payload: {
                message: "product is not exist",
                status: false,
            }
        }
    } else {
        product.styleId = styleId ? styleId : product.styleId;
        await product.save();
        return {
            payload: {
                message: "Updating style is success",
                status: true,
            }
        };
    }
}

exports.deleteImages = async(imagesName) => {
    deleteImagesOnFireBase(imagesName)
}

exports.updateProduct = async(product, req) => {
    const row = await productModel.findById(product.id.toString());
    if (!row) {
        return {
            payload: {
                message: "product is not exist",
                status: false,
            }
        }
    } else {
        row.name = product ? product.name : row.name;
        row.price = product ? product.price : row.price;
        row.thumbnail = !req.file ? row.thumbnail : await handleImage(req);
        row.description = product ? product.description : row.description;
        row.inventory = product ? product.inventory : row.inventory;
        await row.save();
        return {
            payload: {
                message: "Updating is success",
                status: true,
            }
        };
    }
}

exports.getProductOnCategory = async function(categoryId) {
    if (categoryId) {
        const product = await productModel.find();
        const productWithCategoryId = product.filter((item) => {
            const check = item.category.some((itemInSome) => {
                return itemInSome._id.toString() === categoryId
            })
            if (check) {
                return item;
            }
        })
        return {
            payload: {
                message: "get success",
                status: true,
                data: productWithCategoryId
            }
        };
    } else {
        return {
            payload: {
                message: "Category is required",
                status: false,
            }
        };
    }
}


exports.getProductOnStyles = async function(stylesId) {
    if (stylesId) {
        const product = await productModel.find();
        const productWithStylesId = product.filter((item) => {
            const check = item.styleId.some((itemInSome) => {
                return itemInSome._id.toString() === stylesId
            })
            if (check) {
                return item;
            }
        })
        return {
            payload: {
                message: "get success",
                status: true,
                data: productWithStylesId
            }
        };
    } else {
        return {
            payload: {
                message: "styles is required",
                status: false,
            }
        };
    }
}