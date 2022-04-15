const productServices = require('../services/product');
require('dotenv').config();


exports.getAll = function() {
    const product = productServices.getAll();
    return product;
}

exports.addProduct = async function(data, req) {
    if (!data.admin) return "you need an account to add a new product";
    if (!data.name) return "name is empty";
    if (!data.price) return "price is empty";
    if (!data.description) return "description is empty";
    if (!data.inventory) return "inventory is empty";
    if (!data.origin) return "origin is empty";
    const message = productServices.addProduct({
        name: data.name,
        price: data.price,
        image: data.image ? data.image : [],
        description: data.description,
        inventory: data.inventory || 0,
        origin: data.origin,
        quality: data.quality ? data.quality : "Good",
        discounts: data.discounts ? data.discounts : [],
        sold: data.sold ? data.sold : 0,
        styleId: data.styleId ? data.styleId : [],
        category: data.category ? data.category : [],
        createdAt: Date.now(),
        admin: data.admin
    }, req);
    return message;
}


exports.deleteProduct = (id) => {
    return productServices.deleteProduct(id);
}

exports.getProductDetail = (id) => {
    return productServices.getProductDetail(id);
}

exports.updateImagesProduct = async(product, req) => {
    const message = await productServices.updateImagesProduct(product, req);
    return message;
}

exports.updateCategories = async(id, category) => {
    const message = await productServices.updateCategories(id, category);
    return message;
}

exports.updateStyle = async(id, styleId) => {
    const message = await productServices.updateStyle(id, styleId);
    return message;
}

exports.deleteImages = async(imagesName) => {
    const message = await productServices.deleteImages(imagesName);
    return message;
}

exports.updateProduct = async(product, req) => {
    const message = await productServices.updateProduct(product, req);
    return message;
}

exports.getProductOnCategory = async(categoryId) => {
    const message = await productServices.getProductOnCategory(categoryId);
    return message;
}

exports.getProductOnStyles = async(stylesId) => {
    const message = await productServices.getProductOnStyles(stylesId);
    return message;
}