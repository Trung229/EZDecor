const productServices = require('../services/product');
require('dotenv').config();


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
    const message = productServices.addProduct({
        name: data.name,
        price: data.price,
        image: data.image ?? [],
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
    }, req);
    return message;
}


exports.deleteProduct = (id) =>{
    return productServices.deleteProduct(id);
}