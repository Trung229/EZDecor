const cartServices = require('../services/cart');

exports.createCart = function(id) {
    const cart = cartServices.createCart(id);
    return cart;
}

exports.updateCart = function(id, data) {
    const cart = cartServices.updateCart(id, data);
    return cart;
}

exports.getAllCart = function(id) {
    const cart = cartServices.getAllCart(id);
    return cart;
}

exports.deleteItemInCart = function(id, productId) {
    const cart = cartServices.deleteItemInCart(id, productId);
    return cart;
}