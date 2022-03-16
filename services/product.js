const productModel = require('../models/product');


exports.getAll = async () => {
    const product = await productModel.find();
    return product;
}

exports.addProduct = async (product) => {
    const isExist = await productModel.findOne({ name: product.name });
    if (isExist) {
        return {
            payload: {
                message: "name is exist",
                status: false
            }
        }
    }
    const newProduct = new productModel(product);
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