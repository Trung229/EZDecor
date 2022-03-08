const categoryServices = require('../services/category');

exports.getAll = function() {
    const category = categoryServices.getAll();
    return category;
}

exports.addCategory = function(category) {
    const message = categoryServices.addCategory(category);
    return message;
}